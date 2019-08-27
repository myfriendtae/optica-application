const Sequelize = require('sequelize');
const db = require('../config/MySqlKeys');

const Products = db.define(
  'Products',
  {
    product_id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    product: {
      type: Sequelize.STRING,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: true,
    },
    cost: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Products;
