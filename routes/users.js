var express = require('express');
var rp = require('request-promise');
var bcrypt = require('bcryptjs');

var router = express.Router();

var config = require(__dirname + '/../config/firebase.json');
var firebase = require('firebase');
var _ = require('underscore');

// var cons = require('../config/constant');
var logger = require('../logger/winston');

router.post('/join', function(req, res, next) {
	var user_id = req.body.user_id;
	var password = req.body.password;
	var reg_id = req.body.reg_id || null;


	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "user_id is empty",
			code  : 2
		});
	}
	if ( !password ) {
		return res.status(400)
		.json({
			error : "password is empty",
			code  : 2
		});
	}

	models.Users.findOne({
		where : {
			user_id : user_id
		}
	}).then(function(user) {
		if ( user ) {
			res.json({
				error : "해당 아이디 유저가 있습니다.",
				code  : 2
			});
			return;
		}
		models.Users.create({
			user_id : user_id,
			password : password,
			reg_id : reg_id
		}).then(function(result){
			logger.info('post join id/pw');
			res.json(result);
		});
	}).catch(function(err) {
		req.json(err);
	});
});


router.post('/login', function(req, res) {
	logger.info('post login id/pw');

	var user_id = req.body.user_id;
	var password = req.body.password;

	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "user_id is empty",
			code  : 2
		});
	}
	if ( !password ) {
		return res.status(400)
		.json({
			error : "password is empty",
			code  : 2
		});
	}

	models.Users.findOne({
		where : {
			user_id : user_id
		}
	}).then(function(user) {
		if ( !user ) {
			res.json({
				error : "아이디를 확인해주세요..",
				code  : 2
			});
			return;
		}

		var check = bcrypt.compareSync( password, user.dataValues.password );
		console.log('check 1: ', check);

		if ( !check ) {
			res.json({
				error : "비밀번호를 다시 확인해주세요..",
				code  : 2
			});
			return;
		}

		if ( req.body.reg_id ) {
			user.update({
				reg_id : req.body.reg_id
			}).catch(function(err){
				logger.info('로그인 후 reg_id 등록 실패 : ' + err);
			});
		}

		req.session._id = user.get('id');
		req.session.user_id = user.get('user_id');
		req.session.name = user.get('name');
		req.session.email = user.get('email');
		req.session.picture = user.get('picture');

		res.json(user);
	}).catch(function(err) {
		res.json(err);
	});
});

router.post('regId', function(req, res) {
	var user_id = req.session.user_id || req.body.user_id;
	var reg_id  = req.body.reg_id;

	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "user_id is empty",
			code  : 2
		});
	}

	if ( !reg_id ) {
		return res.status(400)
		.json({
			error : "reg_id is empty",
			code  : 2
		});
	}

	models.Publisher.update({reg_id: reg_id},
	 {where: {user_id: user_id}, returning: true}).then(function(user) {
	      res.json(user);
	 }).catch(function(err) {
	      res.json(err);
	});
});

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
	var reg_id = req.body.reg_id || null;
	var options = {
		url: 'https://www.googleapis.com/plus/v1/people/me?access_token='+req.body.accessToken,
	};
	rp(options)
	.then(function(google_info) {
		google_info = JSON.parse(google_info);
		var user_id = 'g_' + google_info.id;
		var data = {
			"user_id": user_id,
			"name": google_info.displayName,
			"picture":  google_info.image.url,
			"email"  : google_info.emails[0].value,
		};

		if ( reg_id ) data.reg_id = reg_id;
		console.log('data', data);
		models.Users.findOrCreate({
			where   : {"user_id" : user_id},
			defaults: data
		})
		.spread(function(user, created){
			if ( created ){
				logger.info('new user :'+user_id );
			}
			user.updateAttributes(data).
			then(function(user){
				req.session._id = user.get('id');
				req.session.user_id = user.get('user_id');
				req.session.name = user.get('name');
				req.session.email = user.get('email');
				req.session.picture = user.get('picture');

				res.json(user);
			});

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

	var user_id = req.session.user_id || req.body.user_id;

	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	models.UsersKeywords.findAll({
		where : {
			user_id : user_id
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

	var user_id = req.session.user_id || req.body.user_id;
	var post_id = req.body.post_id;

	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	if ( !post_id ) {
		return res.status(400)
		.json({
			error : "post_id is empty",
			code  : 2
		});
	}

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
		// console.log('created ', created);
		if (created) {
			models.UsersLikePosts.find({
				where : {id : like.get('id')},
				include  : [
					{model : models.Posts},
					{model : models.Users}
				]
			}).then(function(like2){
				like2.dataValues.is_user_like = true;
				res.json(like2);
			});
		} else {
			like.dataValues.is_user_like = true;
			res.json(like);
		}
	}).catch(function(err){
		logger.err(err);
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
	return {count: count, like: like};
}

router.delete('/like/posts', function(req, res) {
	logger.info('delete like posts');
	var user_id = req.session.user_id || req.body.user_id;
	var post_id = req.body.post_id;

	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	if ( !post_id ) {
		return res.status(400)
		.json({
			error : "post_id is empty",
			code  : 2
		});
	}
	var query = {
		'user_id' : user_id,
		'post_id' : post_id
	};

	models.UsersLikePosts.destroy({
		where : query
	}).then(function(result){
		if ( result ) {
			res.json(query);
		} else {
			res.json(false);
		}
		res.json(result);
	}).catch(function(err){
		logger.error(err);
		res.json(err);
	});

});

// api/users/like/posts/
router.get('/like/posts', function(req, res) {
	logger.info('get like posts');

	var user_id = req.session.user_id || req.query.user_id;
	console.log('user_id :', user_id);


	if ( !user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}
	models.UsersLikePosts.findAll({
		where : {'user_id' : user_id},
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
