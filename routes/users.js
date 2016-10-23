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
			res.json(user);
			// console.log('user', user);
		});
	})
	.catch(function(err) {
		console.error('err: ', err);
	});
});



module.exports = router;
