'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const jwt = require('../services/jwt');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

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

        followThisUsers(req.user.sub, userId).then((value) => {
            user.password = undefined;
            
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });
    })
}

async function followThisUsers(identity_user_id, user_id) {
    let following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    let followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following: following,
        followed: followed
    }
}

function getUsers(req, res) {
    const identity_user_id = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    const itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'request error' });

        if (!users)
            return res.status(404).send({ message: 'no users available' });

        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}

async function followUserIds(user_id){
    let following = await Follow.find({"user": user_id}).select({'_id': 0, '__uv': 0, 'user': 0}).exec().then((follows)=>{
        var follows_clean = [];
        
        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        return follows_clean;
    }).catch((err)=>{
        return handleError(err)
    });

    let followed = await Follow.find({"followed": user_id}).select({'_id': 0, '__uv': 0, 'followed': 0}).exec().then((follows)=>{
        var follows_clean=[];

        follows.forEach((follow)=>{
            follows_clean.push(follow.user);
        });

        return follows_clean;
    }).catch((err)=>{
        return handleError(err)
    });

    return {
        following: following,
        followed: followed
    }
}

const getCounters = (req, res) => {
	let userId = req.user.sub;
	if (req.params.id) {
		userId = req.params.id;
	}
	getCountFollow(userId).then((value) => {
		return res.status(200).send(value);
	});
}

const getCountFollow = async (user_id) => {
	try {
		let following = await Follow.countDocuments({ 'user': user_id }, (err, result) => {
			return result;
        });
        
        let followed = await Follow.countDocuments({ 'followed': user_id }).then((count) => count);

        let publications = await Publication.countDocuments({ 'user': user_id }, (err, result) => {
			return result;
		});
        
		return { following, followed, publications };
	} catch (e) {
		console.log(e);
	}
}

function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    delete update.password;

    if (userId != req.user.sub) {
        return res
            .status(500)
            .send({ message: 'you do not have permission to update user data' });
    }

    User.find({
        $or: [{ email: update.email }, { nick: update.nick }],
    }).exec((err, users) => {
        var user_isset = false;
        users.forEach((user) => {
            if (user && user._id != userId) user_isset = true;
        });

        if (user_isset) return res.status(404).send({ message: 'the data is already in use' });

        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'request error' })

            if (!userUpdated) return res.status(404).send({ message: 'the user could not be updated' });

            return res.status(200).send({ user: userUpdated });
        });
    });
}

function uploadImage(req, res) {
    const userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'you do not have permission to update user data');
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'request error' });

                if (!userUpdated)
                    return res.status(404).send({ message: 'the user could not be updated' });

                return res.status(200).send({ user: userUpdated });
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
    const path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'the image does not exist' });
        }
    });
}

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}