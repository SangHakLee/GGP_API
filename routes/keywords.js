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

	if ( !req.session.user_id ) {
		return res.status(400)
		.json({
			error : "login first",
			code  : 2
		});
	}

	models.Keywords.findOrCreate({
		where : {
			"keyword" : req.body.keyword
		},
		defaults : {
			"keyword": req.body.keyword
		}
	}).spread(function(keyword, created){

		models.UsersKeywords.findOrCreate({
			where : {
				"user_id"    : req.session.user_id,
				"keyword_id" : keyword.get('id')
			},
			defaults : {
				"user_id"    : req.session.user_id,
				"keyword_id" : keyword.get('id')
			}
		}).spread(function(user_keyword, created2){
			if ( !created2 ) {
				console.log('이미 있음');
				res.json(keyword);
				return;
			}
			keyword.increment({
				"count" : 1
			});
			// .then(function(keyword){
			keyword.reload()
			.then(function(keyword){
				console.log('keyword', keyword);
				res.json(keyword);
			});
		});

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


// DELETE api/keywords
router.delete('/', function(req, res) {

});



// GET api/keywords
router.get('/', function(req, res){
	logger.info('get all keywords');
	console.log('req.session',req.session);
    models.Keywords.findAll({
    })
    .then(function(keywords){
      res.json(keywords);
    })
    .catch(function(err){
      res.json(err);
    });
});

// GET api/keywords/1
router.get('/:id', function(req, res){
	logger.info('get keyword by id');
    models.Keywords.findById(req.params.id)
    .then(function(keyword){
      res.json(keyword);
    })
    .catch(function(err){
      res.json(err);
    });
});



module.exports = router;
