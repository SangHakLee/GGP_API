var express = require('express');
var rp = require('request-promise');
var router = express.Router();

var config = require(__dirname + '/../config/firebase.json');
var firebase = require('firebase');
var _ = require('underscore');

// var cons = require('../config/constant');
var logger = require('../logger/winston');


firebase.initializeApp({
  apiKey: "AIzaSyCQ7ElGgbPhf8ueajaho8Bc2P-h8I-XW5U",
  authDomain: "ggp10.firebaseapp.com",
  databaseURL: "https://ggp10.firebaseio.com",
  storageBucket: "firebase-ggp10.appspot.com",
  serviceAccount: config
});

var models = require('../models');
var logger = require('../logger/winston');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // TODO: 모든 유저 정보 가져오는 API
  models.Users.findAll().then(function(users){
    res.json(users);
  })
  .catch(function(err){
    // logger.error(err);
    res.json(err);
  });
  // res.send('respond with a resource');
});

router.post('/firebase', function(req, res){
  logger.info('post firebase');
  var email = _.random(1, 10) + "@good.com";
  var password = "123qwe";
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(result){
    console.log('result :', result);
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('error :', error);
  });

});

router.get('/firebase', function(req, res){
  var user = firebase.auth().currentUser;
  if (user) {
  // User is signed in.
    console.log(user);
  } else {
    // console.log(con.FIREBASE_DEFAULT_PASS);
  // No user is signed in.
  }

  res.json(user);
});


// 구글 로그인 토큰
router.get('/google', function(req, res){
	res.render('google');
});


router.get('/logout', function(req, res) {
	req.session.destroy(function(err){
		if (err) {
			logger.error(err);
			return;
		}
		res.send('logout 완료');
	});
});


router.post('/google', function(req, res){
	if ( !req.body.accessToken ) {
		return res.status(400)
		.json({
			error : "accessToken is empty",
			code  : 2
		});
	}
	var options = {
		url: 'https://www.googleapis.com/plus/v1/people/me?access_token='+req.body.accessToken,
	};
	rp(options)
	.then(function(google_info) {
		google_info = JSON.parse(google_info);
		var user_id = 'g_' + google_info.id;
		models.Users.findOrCreate({
			where: {"user_id" : user_id},
			defaults: {
				"user_id": user_id,
				"name": google_info.displayName,
				"picture":  google_info.image.url
			}
		})
		.spread(function(user, created){
			if ( created ){
				logger.info('new user :'+user_id );
			}
			req.session._id = user.get('id');
			req.session.user_id = user.get('user_id');
			req.session.name = user.get('name');
			req.session.picture = user.get('picture');

			res.json(user);
			// console.log('user', user);
		});
	})
	.catch(function(err) {
		// console.error('err: ', err);
		logger.error( err );
		res.status(400)
		.json({
			error : "google login error",
			code  : 2
		});
	});
});

// api/users/keywords
router.get('/keywords', function(req, res){
	logger.info('get all users\'s keywords');

	if ( !req.session.user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	models.UsersKeywords.findAll({
		where : {
			user_id : req.session.user_id
		},
		include: {model : models.Keywords}
	}).then(function(user_keyword){
      res.json(user_keyword);
    }).catch(function(err){
      res.json(err);
    });
});

// api/users/like/posts/
router.post('/like/posts', function(req, res){
	logger.info('add like posts');

	if ( !req.session.user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	if ( !req.body.post_id ) {
		return res.status(400)
		.json({
			error : "post_id is empty",
			code  : 2
		});
	}
	var user_id = req.session.user_id;
	var post_id = req.body.post_id;

	var query = {
		'user_id' : user_id,
		'post_id' : post_id
	};

	models.UsersLikePosts.findOrCreate({
		where    : query,
		defaults : query,
		include  : [
			{model : models.Posts},
			{model : models.Users}
		]
	}).spread(function(like, created) {
		res.json(like);
	}).catch(function(err){
		logger.err(err);
		res.json(err);
	});
});

// api/users/like/posts/
router.get('/like/posts', function(req, res) {
	logger.info('get like posts');

	if ( !req.session.user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	models.UsersLikePosts.findAll({
		where : {'user_id' : req.session.user_id},
		include  : [
			{model : models.Posts},
			{model : models.Users}
		]
	}).then(function(posts){
      res.json(posts);
    }).catch(function(err){
      res.json(err);
    });
});

module.exports = router;
