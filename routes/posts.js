var express = require('express');
var router = express.Router();

var logger = require('../logger/winston');
var models = require('../models');

router.get('/', function(req, res){
  logger.info('get all posts');
  models.Posts.findAll({
	  order : 'post_no DESC'
  })
  .then(function(posts){
    res.json(posts);
  })
  .catch(function(err){
    res.json(err);
  });
});

router.get('/:id', function(req, res){
  logger.info('get post by id');
  models.Posts.findById(req.params.id)
  .then(function(posts){
    res.json(posts);
  })
  .catch(function(err){
    res.json(err);
  });
});


module.exports = router;
