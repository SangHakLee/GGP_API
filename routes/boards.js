var express = require('express');
var router = express.Router();

var logger = require('../logger/winston');
var models = require('../models');

router.get('/', function(req, res, next) {
  logger.info('get all board');
  models.Boards.findAll({})
  .then(function(boards){
    res.json(boards);
  })
  .catch(function(err){
    res.json(err);
  });
});

router.get('/:id', function(req, res){
  logger.info('get board by id');
  models.Boards.findById(req.params.id)
  .then(function(board){
    res.json(board);
  })
  .catch(function(err){
    res.json(err);
  });
});

module.exports = router;
