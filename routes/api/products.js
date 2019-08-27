const express = require('express');

const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

// Load Product Model
const Product = require('../../models/Product');

// @route   GET api/products/post
// @desc    Create sample request
// @access  Private
router.get(
  '/:search',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const { search } = req.params;
    const errors = {};
    Product.findAll({
      where: {
        [Op.or]: [
          { product: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: 5,
    })
      .then(products => {
        if (products.length === 0) {
          errors.product = 'There is no product in the list';
          res.status(404);
        }
        res.json(products);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
