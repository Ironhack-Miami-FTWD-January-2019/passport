const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth-signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth-signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth-signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth-signup", { message: "Something went wrong" });
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/private-page');
        })
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



authRoutes.get("/login", (req, res, next) => {
  res.render("auth-login", { "message": req.flash("error") });
});
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/private-page", isLoggedIn, (req, res) => {
  res.render("private", { user: req.user });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}
module.exports = authRoutes;