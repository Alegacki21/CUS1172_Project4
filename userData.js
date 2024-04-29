const fs = require("fs");

// Create a new user
exports.createUser = (email, password) => {
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync("jsons/users.json", "utf-8"));
  } catch (error) {
    console.error("Error reading user data", error);
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return null;
  }

  const user = { email, password, name: email.split("@")[0] };

  users.push(user);
  fs.writeFileSync("jsons/users.json", JSON.stringify(users));

  return user;
};

// Validate user
exports.validateUser = (email, password) => {
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync("jsons/users.json", "utf-8"));
  } catch (error) {
    console.error("Error reading user data", error);
  }
  for (let user of users) {
    if (email === user.email && password === user.password) {
      return { email: user.email, name: user.name };
    }
  }
  return null;
};

const { v4: uuidv4 } = require("uuid");

// Add a new video
exports.addVideo = (url, title, description, userEmail) => {
  if (!url || !title || !description) {
    throw new Error("Missing information");
  }
  let videos = [];
  try {
    videos = JSON.parse(fs.readFileSync("jsons/videos.json", "utf-8"));
  } catch (error) {
    console.error("Error reading video data", error);
  }
  const video = { id: uuidv4(), url, title, description, userEmail };
  videos.push(video);
  fs.writeFileSync("jsons/videos.json", JSON.stringify(videos));
};

// Get videos
exports.getVideos = (filter, userEmail) => {
  let videos = [];
  try {
    videos = JSON.parse(fs.readFileSync("jsons/videos.json", "utf-8"));
  } catch (error) {
    console.error("Error reading video data", error);
  }
  if (filter === "mine") {
    videos = videos.filter((video) => video.userEmail === userEmail);
  }
  return videos;
};
