const express = require("express");
const router = express.Router();
const userData = require("../userData");


router.get("/login", (req, res) => {
  res.render("login");
});

// Login route
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = userData.validateUser(email, password);
  if (user) {
    req.session.user = user;
    res.redirect("/video/dashboard/all");
  } else {
    res.render("login", { error: "Incorrect email or password" });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Register route
router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = userData.createUser(email, password);
  if (user) {
    req.session.user = user;
    res.redirect("/video/dashboard/all");
  } else {
    res.render("register", { error: "Registration failed" });
  }
});

module.exports = router;
