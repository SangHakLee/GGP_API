var express = require('express');
var router = express.Router();

var boards = require('./boards');
var users = require('./users');
var posts = require('./posts');

router.use('/boards', boards);
router.use('/users', users);
router.use('/posts', posts);

module.exports = router;
