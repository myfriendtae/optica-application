const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const jwtSecret = require('../config/jwtConfig');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      User.findAll({
        where: {
          email: jwtPayload.email,
        },
        raw: true,
      })
        .then(user => {
          if (user) {
            return done(null, jwtPayload);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
