const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

// Routes folder
const users = require('./routes/api/users');
const samples = require('./routes/api/samples');
const products = require('./routes/api/products');
const writeoffs = require('./routes/api/writeoffs');

const app = express();

// MySql Config
const db = require('./config/MySqlKeys');

db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/samples', samples);
app.use('/api/products', products);
app.use('/api/writeoffs', writeoffs);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));