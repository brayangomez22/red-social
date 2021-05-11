'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// LOAD ROUTES
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS 

// ROUTES 
app.use('/api', user_routes);
app.use('/api', follow_routes);

module.exports = app;