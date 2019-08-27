const express = require('express');

const router = express.Router();
const passport = require('passport');
const sendmail = require('../../validation/nodemailer.js');

// Load Validation
const validateFormInput = require('../../validation/forms');

// Load Writeoff Model
const Writeoff = require('../../models/Writeoff');

// Load Product Model
const Product = require('../../models/Product');

// @route   GET api/writeoffs/test
// @desc    Tests writeoffs route
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    msg: 'writeoff work',
  });
});

// @route   GET api/writeoffs
// @desc    Get all writeoffs
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const errors = {};
    Writeoff.findAll({
      order: [['CreatedAt', 'ASC']],
      attributes: [
        'writeoff_id',
        'jobnumber',
        'createdAt',
        'product',
        'qty',
        'name',
        'status',
      ],
      raw: true,
    })
      .then(writeoffs => {
        if (writeoffs.length === 0) {
          errors.nowriteoff = 'There is no writeoff request';
          return res.status(400).json(errors);
        }
        res.json(writeoffs);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/writeoffs/post
// @desc    Create writeoff request
// @access  Private
router.post(
  '/add',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const { errors, isValid } = validateFormInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get fields
    const writeoffFields = {};
    // writeoffFields.user = req.user.id;
    writeoffFields.name = req.user.name;
    if (req.body.product) writeoffFields.product = req.body.product;
    if (req.body.qty) writeoffFields.qty = req.body.qty;
    if (req.body.status) writeoffFields.status = req.body.status;
    if (req.body.comment) writeoffFields.comment = req.body.comment;
    if (req.body.comment) writeoffFields.jobnumber = req.body.jobnumber;
    if (req.body.customer) writeoffFields.customer = req.body.customer;

    // Validate product input and Save Writeoff request
    Product.findOne({
      where: { product: req.body.product },
    })
      .then(product => {
        if (product.length === 0) {
          errors.product = 'Product does not exist';
          return res.status(400).json(errors);
        }
        // Save writeoff request
        Writeoff.create(writeoffFields).then(writeoffs => res.json(writeoffs));

        // Send a confirmation email
        sendmail(writeoffFields, req.user.email);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/writeoff/:id
// @desc    Get writeoff by id
// @access  Private
router.get(
  '/edit/:writeoff_id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const errors = {};

    Writeoff.findAll({
      where: { writeoff_id: req.params.writeoff_id },
    })
      .then(writeoff => {
        if (!writeoff[0]) {
          errors.nowriteoff = 'There is no writeoff in the list';
          res.status(404).json(errors);
        }
        res.json(writeoff[0]);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/writeoffs/edit/:id
// @desc    Edit writeoff by id
// @access  Private
router.put(
  '/edit/:writeoff_id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const { errors, isValid } = validateFormInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const writeoffFields = {};
    // writeoffFields.user = req.user.id;
    // writeoffFields.person = req.user.name;
    if (req.body.product)
      writeoffFields.product = req.body.product.toUpperCase();
    if (req.body.qty) writeoffFields.qty = req.body.qty;
    if (req.body.customer) writeoffFields.customer = req.body.customer;
    if (req.body.status) writeoffFields.status = req.body.status;
    if (req.body.jobnumber) writeoffFields.jobnumber = req.body.jobnumber;
    if (req.body.comment) writeoffFields.comment = req.body.comment;

    Product.findOne({
      attributes: ['product'],
      where: { product: writeoffFields.product },
    })
      .then(product => {
        if (product.length === 0) {
          errors.noproduct = 'Product does not exist';
          return res.status(400).json(errors);
        }
        Writeoff.update(writeoffFields, {
          where: { writeoff_id: req.params.writeoff_id },
        })
          .then(writeoff => {
            console.log('success');
            res.json(writeoff);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/writeoffs/download
// @desc    Download write-off requests
// @access  Private
// To-Do change the date range
router.get(
  '/download',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    Writeoff.findAll({ raw: true })
      .then(writeoff => {
        res.setHeader(
          'Content-disposition',
          'attachment; filename=testing.csv'
        );
        res.set('Content-Type', 'text/csv');
        res.csv(writeoff, true);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
