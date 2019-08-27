const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtSecret = require('../../config/jwtConfig');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'users work',
  })
);

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findAll({
    where: {
      email: req.body.email,
    },
  }).then(user => {
    if (user.length !== 0) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    }
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        User.create(newUser)
          .then(userData => res.json(userData))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email } = req.body;
  const { password } = req.body;

  // Find user by email
  User.findOne({
    where: {
      email,
    },
  }).then(user => {
    // Check for user

    if (user == null) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check password

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Martched
        const payload = {
          id: user.user_id,
          name: user.name,
          email: user.email,
        }; // Create JWT Payloadd
        // Sign Token
        jwt.sign(
          payload,
          jwtSecret.secret,
          {
            expiresIn: 8640,
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`,
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    console.log(req);

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
