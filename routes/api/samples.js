const express = require('express');

const router = express.Router();
const passport = require('passport');
const sendmail = require('../../validation/nodemailer.js');

// Load Validation
const validateFormInput = require('../../validation/forms.js');

// Load Sample Model
const Sample = require('../../models/Sample');

// Load Product Model
const Product = require('../../models/Product');

// @route   GET api/samples/test
// @desc    Tests sample route
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Samples work',
  });
});

// @route   GET api/users/register
// @desc    Get all samples
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const errors = {};
    Sample.findAll({
      order: [['rdate', 'ASC']],
      attributes: ['sample_id', 'rdate', 'product', 'qty', 'name', 'status'],
      raw: true,
    })
      .then(samples => {
        if (samples.length === 0) {
          errors.nosample = 'There is no sample request';
          return res.status(400).json(errors);
        }
        res.json(samples);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/samples/post
// @desc    Create sample request
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
    const sampleFields = {};
    // sampleFields.user = req.user.id;
    sampleFields.name = req.user.name;
    if (req.body.product) sampleFields.product = req.body.product;
    if (req.body.qty) sampleFields.qty = req.body.qty;
    if (req.body.customer) sampleFields.customer = req.body.customer;
    if (req.body.status) sampleFields.status = req.body.status;
    if (req.body.rdate) sampleFields.rdate = req.body.rdate;
    if (req.body.comment) sampleFields.comment = req.body.comment;

    // Validate product input and Save sample request
    Product.findOne({
      where: { product: req.body.product },
    })
      .then(product => {
        if (product.length === 0) {
          errors.product = 'Product does not exist';
          return res.status(400).json(errors);
        }
        // Save sample request
        Sample.create(sampleFields).then(samples => res.json(samples));

        // Send a confirmation email
        sendmail(sampleFields, req.user.email);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/samples/:id
// @desc    Get sample by id
// @access  Private
router.get(
  '/edit/:sample_id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const errors = {};

    Sample.findAll({
      where: { sample_id: req.params.sample_id },
    })
      .then(sample => {
        if (!sample[0]) {
          errors.nosample = 'There is no sample in the list';
          res.status(404).json(errors);
        }
        res.json(sample[0]);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/samples/edit/:id
// @desc    Edit sample by id
// @access  Private
router.put(
  '/edit/:sample_id',
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
    const sampleFields = {};
    // sampleFields.user = req.user.id;
    // sampleFields.person = req.user.name;
    if (req.body.product) sampleFields.product = req.body.product.toUpperCase();
    if (req.body.qty) sampleFields.qty = req.body.qty;
    if (req.body.customer) sampleFields.customer = req.body.customer;
    if (req.body.status) sampleFields.status = req.body.status;
    if (req.body.rdate) sampleFields.rdate = req.body.rdate;
    // if(req.body.date) sampleFields.date = req.body.date;
    if (req.body.comment) sampleFields.comment = req.body.comment;

    Product.findOne({
      attributes: ['product'],
      where: { product: sampleFields.product },
    })
      .then(product => {
        if (product.length === 0) {
          errors.noproduct = 'Product does not exist';
          return res.status(400).json(errors);
        }
        Sample.update(sampleFields, {
          where: { sample_id: req.params.sample_id },
        })
          .then(sample => {
            console.log('success');
            res.json(sample);
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// Download first 50 Sample requests
// To-Do change the date range
router.get(
  '/download',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    Sample.findAll({ limit: 10, raw: true })
      .then(samples => {
        const sample = samples;
        res.setHeader(
          'Content-disposition',
          'attachment; filename=testing.csv'
        );
        res.set('Content-Type', 'text/csv');
        res.csv(sample, true);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
