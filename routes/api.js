var express = require('express');
var router = express.Router();

var boards = require('./boards');
var users = require('./users');
var posts = require('./posts');
var keywords = require('./keywords');

router.use('/boards', boards);
router.use('/users', users);
router.use('/posts', posts);
router.use('/keywords', keywords);

module.exports = router;
