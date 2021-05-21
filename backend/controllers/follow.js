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

function getFollowingUsers(req, res) {
    var userId = req.user.sub;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id
    }

    const itemsPerPage = 4;

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'server error' });
        
        if (!follows) return res.status(404).send({ message: 'you are not following any user' });

        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
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

function getFollowedUsers(req, res) {
	var userId = req.user.sub;

	if (req.params.id && req.params.page) {
		userId = req.params.id;
	}

	var page = 1;

	if (req.params.page) {
		page = req.params.page;
	} else {
		page = req.params.id;
	}

	const itemsPerPage = 4;

	Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'server error' });

        if (!follows) return res.status(404).send({ message: 'no user follows you' })

        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}

function getMyFollows(req, res) {
    var userId = req.user.sub

    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'server error' });

        if (!follows) return res.status(404).send({ message: 'you don-t follow any user' });

        return res.status(200).send({ follows })
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}