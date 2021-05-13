'use strict'

const mongoosePagination = require('mongoose-pagination');
const moment = require('moment');

const User = require('../models/user');
const Follow = require('../models/follow');
const Message = require('../models/message');

function saveMessage(req, res) {
    const params = req.body;

    if (!params.text || !params.receiver)
        return res.status(200).send({ message: 'send the necessary data' });
    
    const message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: 'request error' });

        if (!messageStored) return res.status(404).send({ message: 'error sending message' });

        return res.status(200).send({ message: messageStored });
    });
}

function getReceivedMessages(req, res) {
    const userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({ receiver: userId })
        .populate('emitter', 'name surname image nick _id')
        .paginate(page, itemsPerPage, (err, messages, total) => {
            if (err) return res.status(500).send({ message: 'request error' });

            if (!messages) return res.status(404).send({ message: 'no messages' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                messages,
            });
        });
}

function getEmitterMessages(req, res) {
    const userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Message.find({ emitter: userId })
        .populate('emitter receiver', 'name surname image nick _id')
        .paginate(page, itemsPerPage, (err, messages, total) => {
            if (err) return res.status(500).send({ message: 'request error' });

            if (!messages) return res.status(404).send({ message: 'no messages' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                messages,
            });
        });
}

function getUnViewedMessage(req, res) {
    const userId = req.user.sub;
    
    Message.countDocuments({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'request error' });

        return res.status(200).send({
            'unviewed': count
        });
    });
}

module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmitterMessages,
    getUnViewedMessage
}