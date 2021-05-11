'use strict'

const User = require('../models/user');
const Follow = require('../models/follow');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

function saveFollow (req, res) {
    const params = req.body;

    const follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'error saving trace' });

        if (!followStored) return res.status(404).send({ message: 'tracking has not been saved' });

        return res.status(200).send({ follow: followStored });
    });
}

function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;

    Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
        if (err) return res.status(500).send({ message: 'error when un following' });
        
        return res.status(200).send({ follow: 'the follow has been deleted' });
    });
}

module.exports = {
    saveFollow,
    deleteFollow
}