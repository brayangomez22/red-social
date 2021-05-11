'use strict'

const express = require('express');
const FollowController = require('../controllers/follow');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.get('/tests-follow', md_auth.ensureAuth, FollowController.test);

module.exports = api;