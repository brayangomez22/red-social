'use strict'

const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');

const User = require('../models/user');
const Follow = require('../models/follow');
const Message = require('../models/message');

function saveMessage(req, res) {
    const params = req.body;

    if (!params.text || !params.receiver) return res.status(200).send({ message: 'send the necessary data' });
    
    const message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: 'request error' });

        if (!messageStored) return res.status(404).send({ message: 'error sending message' });

        return res.status(200).send({ message: messageStored });
    });
}

module.exports = {
    saveMessage
}