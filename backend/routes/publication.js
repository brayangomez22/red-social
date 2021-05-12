'use strict'

const express = require('express');
const PublicationController = require('../controllers/publication');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' });

api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);

module.exports = api;