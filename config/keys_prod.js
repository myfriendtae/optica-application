const Sequelize = require('sequelize');

// Create connection
const db = new Sequelize(
  'warehouse',
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: 'HOST ADDRESS',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = db;
