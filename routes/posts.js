var express = require('express');
var _ = require('underscore');
var router = express.Router();

var logger = require('../logger/winston');
var models = require('../models');
var LIMIT = 10;
router.get('/', function(req, res){
  logger.info('get all posts');
  console.log('req.seesion : ', req.session);
  var page  = req.query.page || 1;
  var limit = req.query.limit || LIMIT;
  var offset = (page-1) * limit;
  models.Posts.findAll({
	  limit  : limit,
	  offset : offset,
	  include : [{
		  model: models.UsersLikePosts, // 좋아요 여부
		  attributes: ['user_id', 'post_id']
	  }],
	  order  : 'post_no DESC'
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
  var user_id = req.query.user_id;
  models.Posts.find({
	  where  : {id : req.params.id},
	  include: [{
		  model: models.UsersLikePosts, // 좋아요 여부
		//   required: false,
		  attributes: ['user_id', 'post_id']
	  }]
  })
  .then(function(posts){
	var likeInfo = findUserId(posts, user_id);
	// console.log('postsaaaaaaaaaaaaaaaa', likeInfo);

	posts.dataValues.likeCount = likeInfo.count;
	posts.dataValues.isUserLike    = likeInfo.like;
	// console.log('postsaaaaaaaaaaaaaaaa', posts);
    res.json(posts);
  })
  .catch(function(err){
    res.json(err);
  });
});

function findUserId (posts, user_id){
	var UsersLikePosts = posts.get('UsersLikePosts');
	var count = UsersLikePosts.length;
	var like  = false;

	for (var i in UsersLikePosts) {
		if ( user_id == UsersLikePosts[i].dataValues.user_id ) {
			like = true;
		}
	}
	console.log('postsaaaaaaaaaaaaaaaa 1', count);
	console.log('postsaaaaaaaaaaaaaaaa 2', like);

	return {count: count, like: like};

}


module.exports = router;
