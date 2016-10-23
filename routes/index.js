var express = require('express');
var router = express.Router();

var logger = require('../logger/winston');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('hi');
  res.render('index', { title: 'Express' });
});

router.get('/error', function(req, res, next) {
  throw new Error('error');
});

module.exports = router;
