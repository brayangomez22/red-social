'use strict'

const User = require('../models/user');
const Follow = require('../models/follow');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

const test = (req, res) => {
    res.status(200).send({
        message: 'Test follow',
    });
}

module.exports = {
    test
}