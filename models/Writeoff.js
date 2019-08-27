const Sequelize = require('sequelize');
const db = require('../config/MySqlKeys');

const Writeoffs = db.define('Writeoffs', {
  writeoff_id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  product: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  customer: {
    type: Sequelize.STRING,
  },
  qty: {
    type: Sequelize.INTEGER,
  },
  jobnumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Writeoffs;
