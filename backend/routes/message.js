'use strict'

const express = require('express');
const MessageController = require('../controllers/message');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);

module.exports = api;

