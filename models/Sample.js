const Sequelize = require('sequelize');
const db = require('../config/MySqlKeys');

const Samples = db.define('Samples', {
  sample_id: {
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
  rdate: {
    type: Sequelize.DATEONLY,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  comment: {
    type: Sequelize.STRING,
  },
});

module.exports = Samples;
