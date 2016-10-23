var express = require('express');
var router = express.Router();

var logger = require('../logger/winston');
var models = require('../models');

router.post('/', function(req, res){
	logger.info('post keywords');
	if ( !req.body.keyword ) {
		return res.status(400)
		.json({
			error : "keyword is empty",
			code  : 2
		});
	}

	models.Keywords.findOne({
		where : {
			keyword : req.body.keyword
		}
	})
	.then(function(keyword, err){
		console.log('keyword', keyword);
		if ( keyword === null ) {
			models.Keywords.create({
				keyword : req.body.keyword
			})
			.then(function(keyword){
				res.json(keyword);
			});
		} else {
			res.json(keyword);
		}
	})
	.catch(function(err){
		console.log('err 2', err);
		res.json(err);
	});
	// models.Keywords.create({
	// 	keyword : req.body.keyword
	// })
	// .then(function(keyword){
	// 	// console.log('keyword', keyword);
	// 	// res.json(keywords);
	// 	model.Keywords.findAll({})
	// 	.then(function(keywords){
	// 		console.log('????');
	// 		res.json("??");
	// 	});
	// })
	// .catch(function(err){
	// 	res.json(err);
	// });
});

router.get('/', function(req, res){
	logger.info('get all keywords');
    models.Keywords.findAll({
    })
    .then(function(keywords){
      res.json(keywords);
    })
    .catch(function(err){
      res.json(err);
    });
});

router.get('/:id', function(req, res){
	// TODO keywords 1개 읽기
});

module.exports = router;
