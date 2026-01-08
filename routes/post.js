'use strict';

const express = require('express');
const router = express.Router();
const postSchema = require('../models/post');
const postLikeSchema = require('../models/post_like');
const userSchema = require('../models/user');

router.get('/', async function(req, res, next) {
    const sortBy = req.query.sortBy;
    let sortOptions = {};

    if (sortBy === 'most_liked') {
        sortOptions = { totalLikes: -1 };
    } else if (sortBy === 'most_recent') {
        sortOptions = { createdAt: -1 };
    }

    const filterBy = req.query.filterBy;
    let filterQuery = {};

    if (filterBy) {
        const allowed = ['mbti', 'enneagram', 'zodiac'];
        const filterValue = req.query[filterBy];

        if (allowed.includes(filterBy) && filterValue) {
        filterQuery = {
            $or: [
            { [`vote.${filterBy}`]: filterValue }
            ]
        };
        }
    }

    const posts = await postSchema.find(filterQuery).sort(sortOptions);
    res.status(200).json({
        posts: posts,
    });
});

router.post('/', async function(req, res, next) {
    let { title, content, vote } = req.body;
    const userName = req.headers['x-user-name'];
    if (!userName) {
        return res.status(400).json({ success: false, message: 'User name is required in headers' });
    }

    try {
        const user = await userSchema.findOne({
            name: userName,
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const post = await postSchema.create({
            userId: user._id,
            title,
            content,
            vote
        });
        res.status(201).json({ success: true, post: post });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create post', error: err.message });
    }
});

router.post('/:id/upvote', async function(req, res, next) {
    const userName = req.headers['x-user-name'];
    if (!userName) {
        return res.status(400).json({ success: false, message: 'User name is required in headers' });
    }


    try {
        const user = await userSchema.findOne({
            name: userName,
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const post = await postSchema.findById({
            _id: req.params.id,
        });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }


        const postLike = await postLikeSchema.findOne({
            userId: user._id,
            postId: req.params.id,
        });

        if (postLike) {
            await postLikeSchema.deleteOne({ _id: postLike._id });
            await postSchema.findByIdAndUpdate(
                req.params.id,
                { $inc: { totalLikes: -1 } },
                { new: true }
            );
            return res.json({ success: true, post: post });
        }

        await postLikeSchema.create({
            userId: user._id,
            postId: req.params.id,
        });
        const newPost = await postSchema.findByIdAndUpdate(
        req.params.id,
        { $inc: { totalLikes: 1 } },
        { new: true }
        );
        res.json({ success: true, post: newPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to upvote post', error: err.message });
    }
});


module.exports = router; 