var express = require('express');
var router = express.Router();

var config = require(__dirname + '/../config/firebase.json');
var firebase = require('firebase');
var _ = require('underscore');

// var cons = require('../config/constant');


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






module.exports = router;
