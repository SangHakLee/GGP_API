var express = require('express');
var router = express.Router();

var Gcm = require('../gcm/test');


var boards = require('./boards');
var users = require('./users');
var posts = require('./posts');
var keywords = require('./keywords');

router.get('/gcm', function(req, res) {
	Gcm();
	res.send(1);
});

router.use('/boards', boards);
router.use('/users', users);
router.use('/posts', posts);
router.use('/keywords', keywords);

module.exports = router;
