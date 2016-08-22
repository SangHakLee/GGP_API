var express = require('express');
var router = express.Router();

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





module.exports = router;
