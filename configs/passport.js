// configs/passport.js
const passport = require("passport"),LocalStrategy = require("passport-local").Strategy
passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      (email, password, cb) => {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT

        return UserModel.findOne({ email, password })
          .then((user) => {
            if (!user) {
              return cb(null, false, {
                message: "Incorrect email or password.",
              });
            }
            return cb(null, user, { message: "Logged In Successfully" });
          })
          .catch((err) => cb(err));
      }
    )
  );

const passportJWT = require("passport-jwt"),
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, cb) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

      return UserModel.findOneById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
