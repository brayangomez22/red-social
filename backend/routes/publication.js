'use strict'

const express = require('express');
const PublicationController = require('../controllers/publication');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' });

api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-publication/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-publication/:imageFile', PublicationController.getImageFile);

module.exports = api;