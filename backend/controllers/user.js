'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');

const home = (req, res) => {
    res.status(200).send({
        message: 'Hello World',
    });
}

const test = (req, res) => {
    console.log(req.body);
	res.status(200).send({
		message: 'Test',
	})
}

function saveUser(req, res) {
    const params = req.body;
    const user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'user request error' });
            
            if (users && users.length >= 1) {
                return res
                    .status(200)
                    .send({
                        message:
                            'the user you are trying to register already exists in the database',
                    });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash

                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'error when saving the user' });

                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'user has not registered' });
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'send all the necessary fields',
        }); 
    }
}

function loginUser(req, res) {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'request error' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken( user )
                        });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'request error' });
                }
            });
        } else {
            return res.status(404).send({ message: 'request error' });
        }
    });
}

function getUser(req, res) {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'request error' });

        if (!user) return res.status(404).send({ message: 'the user does not exist in the database' });

        return res.status(200).send({ user });
    })
}

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser
}