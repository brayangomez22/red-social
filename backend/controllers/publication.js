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

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    const itemsPerPage = 4;

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'error returning the trace' });

        var follows_clean = [];
        
        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        Publication.find({ user: { '$in': follows_clean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'error returning posts' });
            
            if (!publications) return res.status(404).send({ message: 'no posts' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                publications 
            });
        });
    });
}

module.exports = {
    savePublication,
    getPublications
}