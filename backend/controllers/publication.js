'use strict'

const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');

const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');

function savePublication(req, res) {
	const params = req.body;

	if (!params.text) return res.status(200).send({ message: 'you must send a text' });

	const publication = new Publication();
	publication.text = params.text;
	publication.file = 'null';
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'error saving post' });

        if (!publicationStored)
            return res.status(404).send({ message: 'the publication has not been saved' });

        return res.status(200).send({ publication: publicationStored });
    });
}

module.exports = {
	savePublication,
}