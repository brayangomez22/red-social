'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
    text: String,
    created_at: String,
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Message', MessageSchema);