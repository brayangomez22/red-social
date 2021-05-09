'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'secret key of my social network'

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ message: 'the request does not have the authentication header' });   
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'the token has expired'
            });
        }
    } catch (error) {
        return res.status(404).send({
            message: 'the token is not valid'
        });
    }

    req.user = payload;

    next();
}