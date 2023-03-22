const passport = require("passport");
// const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
// const secretOrKey = process.env.SECRET_KEY;
const Users = require("../repositories/users");
const keys = require("../keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
