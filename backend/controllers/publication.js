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

function getPublication(req, res) {
	const publicationId = req.params.id;

	Publication.findById(publicationId, (err, publication) => {
		if (err) return res.status(500).send({ message: 'request error' });

		if (!publication)
			return res.status(404).send({ message: 'the publication does not exist in the database' });

        return res.status(200).send({ publication });
	});
}

function deletePublication(req, res) {
	const publicationId = req.params.id;

    Publication.find({ 'user': req.user.sub, _id: publicationId }).remove(err => {
        if (err) return res.status(500).send({ message: 'error deleting post' });

        return res.status(200).send({ message: 'post removed' });
    });
}

function uploadImage(req, res) {
    const publicationId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; 

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {
                if (publication) {
                    Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({ message: 'request error' });

                        if (!publicationUpdated)
                            return res.status(404).send({ message: 'the publication could not be updated' });

                        return res.status(200).send({ publication: publicationUpdated })
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'you do not have permission to update this post');
                }
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'extension not valid');
        }
    } else {
        return res.status(200).send({ message: 'no images have been uploaded' });
    }
}

function removeFilesOfUploads (res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    const image_file = req.params.imageFile;
    const path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'the image does not exist' });
        }
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}