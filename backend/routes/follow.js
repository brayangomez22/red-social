'use strict'

const express = require('express');
const FollowController = require('../controllers/follow');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);

module.exports = api;