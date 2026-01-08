'use strict';

const express = require('express');
const profile = require('./routes/profile');
const post = require('./routes/post');

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use('/profile', profile);
app.use('/post', post);


module.exports = app;
