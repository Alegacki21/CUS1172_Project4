const express = require("express");
const router = express.Router();
const userData = require("../userData");

router.get("/dashboard/:videofilter", (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    const filter = req.params.videofilter;
    const videos = userData.getVideos(filter, req.session.user.email);
    res.render("dashboard", { videos: videos });
  }
});

router.get("/new_video", (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    res.render("newVideo");
  }
});

router.post("/new", (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
  } else {
    const url = req.body.url;
    const title = req.body.title;
    try {
      userData.addVideo(url, title, req.session.user.email);
      res.render("newVideo", { message: "Video added successfully" });
    } catch (error) {
      res.render("newVideo", { error: "Missing information" });
    }
  }
});

module.exports = router;
