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

module.exports = {
	saveFollow,
}