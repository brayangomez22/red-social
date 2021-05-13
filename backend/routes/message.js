'use strict'

const express = require('express');
const MessageController = require('../controllers/message');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmitterMessages);
api.get('/unviewed-messages/', md_auth.ensureAuth, MessageController.getUnViewedMessage);

module.exports = api;

