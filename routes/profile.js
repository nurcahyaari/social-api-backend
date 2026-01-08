'use strict';

const express = require('express');
const router = express.Router();
const profileSchema = require('../models/user');
const mongoose = require('mongoose');

router.get('/', async function(req, res, next) {
  const profiles = await profileSchema.find({});
  res.status(200).json({
    profiles: profiles,
  });
});

router.get('/:name', async function(req, res, next) {
  try {
    const profile = await profileSchema.findOne({ name: req.params.name });
    if (!profile) {
      return res.status(404).send('Profile not found');
    }
    res.render('profile_template', {
      profile: profile,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', async function(req, res, next) {
  let {
    name, 
    description, 
    mbti, 
    enneagram, 
    variant, 
    tritype, 
    socionics, 
    sloan, 
    psyche, 
    image 
  } = req.body;
  if (image === undefined || image === '' || image === null) {
    image = 'https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg';
  }
  try {
    const profile = await profileSchema.create({
      name,
      description,
      mbti,
      enneagram,
      variant,
      tritype,
      socionics,
      sloan,
      psyche,
      image
    });
    res.status(201).json({ success: true, profile: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create profile', error: err.message });
  }
});

module.exports = router;