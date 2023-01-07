// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


//Database USE
const User = require("../models/User");
const { authenticate } = require("passport");

//Register POST Methods for Route
router.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  // simple validation
  if (!name || !username || !password) {
    return res.render("register", { message: "Please try again" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    username,
    password: passwordHash,
  });

  await user.save();
  res.render("index", { user });
});

//Login POST method for login process
router.post("/login", async (req, res, next) => {
   passport.authenticate('login', { session: false } , (err, data, info) => {
      if (err) return next(err);
      console.log(data);
      if (data) {
        const token = jwt.sign({data}, 'mtb19signDev');
        res.cookie('jwt', token, {
          maxAge : 3600 * 12 * 1000
        }) 
        res.redirect('/');
      } else {
        res.status(400).send('What is a Problem ' + info.message);
      }
   })(req, res, next);
   
});

//Logout GET method for logout process
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = router;
