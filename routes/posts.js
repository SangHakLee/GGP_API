var express = require('express');
var _ = require('underscore');
var router = express.Router();

var logger = require('../logger/winston');
var models = require('../models');
var LIMIT = 10;
router.get('/', function(req, res){
  logger.info('get all posts');

  console.log('req.seesion : ', req.session);
  console.log('req.query : ', req.query);

  var user_id = req.session.user_id || req.query.user_id;

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
	for ( var i in posts ) {
		var likeInfo = findUserId(posts[i], user_id);
		posts[i].dataValues.like_count  = likeInfo.count;
		posts[i].dataValues.is_user_like = likeInfo.like;
	}
    res.json(posts);
  })
  .catch(function(err){
    res.json(err);
  });
});

router.post('/', function(req, res) {
	console.log('req.body : ', req.body);

	var board_id = req.body.board_id || 1;
	var post_no = req.body.post_no || 9999;
	var board_no = req.body.board_no|| 9999;
	var post_title = req.body.post_title;
	var post_content = req.body.post_content;
	var post_content_html = req.body.post_content || post_content;
	var posted_at = req.body.posted_at || new Date();

	var data = {
		board_id : board_id,
		post_no : post_no,
		board_no : board_no,
		post_title : post_title,
		post_content : post_content,
		post_content_html : post_content_html,
		posted_at : posted_at,
	};

	models.Posts.create(data)
	.then(function(result) {
		console.log('req.result : ', req.result);
		res.json(result);
	}).catch(function(err) {
		console.log('req.err : ', req.err);
		res.json(err);
	});
});

router.get('/:id', function(req, res){
  logger.info('get post by id');
  console.log('req.seesion : ', req.session);
  console.log('req.query : ', req.query);

  var user_id = req.session.user_id || req.query.user_id;
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

	posts.dataValues.like_count  = likeInfo.count;
	posts.dataValues.is_user_like = likeInfo.like;
    res.json(posts);
  })
  .catch(function(err){
    res.json(err);
  });
});

function findUserId (posts, user_id){
	var UsersLikePosts = posts.get('UsersLikePosts');
	// console.log('UsersLikePosts :', UsersLikePosts);

	var count = UsersLikePosts.length;
	var like  = false;
	for (var i in UsersLikePosts) {
		if ( user_id == UsersLikePosts[i].dataValues.user_id ) {
			like = true;
		}
	}
	// console.log('count :', count);

	return {count: count, like: like};
}


module.exports = router;
