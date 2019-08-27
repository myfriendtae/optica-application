const JwtDev = require('./jwtConfig_dev');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    secret: process.env.JWTKEY,
  };
} else {
  module.exports = JwtDev;
}
