const express = require("express");
const session = require("express-session");
const authRoutes = require("../routes/authRoutes");
const videoRoutes = require("../routes/videoRoutes");
const userData = require("../userData");
const fs = require("fs");
const app = express();

// Middleware to parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Set the view engine to pug
app.set("view engine", "pug");
app.set("views", "./pug");

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

//filter videos by category and display them in the dashboard
app.get("/video/dashboard/:videofilter", checkAuthenticated, (req, res) => {
  const filter = req.params.videofilter;
  const videos = userData.getVideos(filter, req.session.user.email);
  const username = req.session.user.name;
  res.render("dashboard", { videos });
});

app.get("/video/add", checkAuthenticated, (req, res) => {
  res.render("newVideo");
});

//route to add new video
app.post("/video/add", checkAuthenticated, (req, res) => {
  const { title, url, description } = req.body;

  userData.addVideo(url, title, description, req.session.user.email);

  res.redirect("/video/dashboard");
});

app.get("/video/dashboard", checkAuthenticated, (req, res) => {
  const videos = userData.getVideos(req.session.user.email);

  res.render("dashboard", { videos });
});

//route to video with specific id
app.get("/video/:id", (req, res) => {
  const id = req.params.id;
  let videos = [];
  try {
    videos = JSON.parse(fs.readFileSync("jsons/videos.json", "utf-8"));
  } catch (error) {
    console.error("Error reading video data", error);
  }
  const video = videos.find((video) => video.id === id);
  if (video) {
    res.render("video", { video });
  } else {
    res.status(404).send("Video not found");
  }
});

app.use("/auth", authRoutes);
app.use("/video", videoRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
