// configs/passport.js
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }

  return jwt;
};

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (name, password, cb) => {
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      // if (!username || !password) {
      //   return cb(null, false);
      // }
      // password = bcrypt.hashSync(password, 10);


      //!!! findOne method Value need to be converted to String before Query Database
      return User.findOne({ username: name.toString() }, (err, user) => {
        //console.log(name)
        if (err) {
          return cb(err, false, { message: err});
        }
        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        
        let data = {id: user._id, username: user.username , name: user.name, prefix: user.prefix, reviewer: user.reviewer, department: user.department};
        if (process.env.process == 'development') {
          console.log("Passport data \n" + data)
        }
        if (bcrypt.compareSync(password, user.password)) {
          return cb(null, data, { message: "Logged In Successfully" });
        } else {
          return cb(null, false, { message: 'รหัสผิด'});
        }
      });
    }
  )
);

const passportJWT = require("passport-jwt"),
  JWTStrategy = passportJWT.Strategy;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: "mtb19signDev",
      jwtFromRequest: cookieExtractor,
    },
    (jwtPayload, cb) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

      return User.findOne(jwtPayload.username)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
