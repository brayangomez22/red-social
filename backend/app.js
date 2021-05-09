'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// LOAD ROUTES
const user_routes = require('./routes/user');

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS 

// ROUTES 
app.use('/api', user_routes);

module.exports = app;