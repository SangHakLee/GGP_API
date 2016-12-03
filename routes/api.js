var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');


var Gcm = require('../gcm/test');


var boards = require('./boards');
var users = require('./users');
var posts = require('./posts');
var keywords = require('./keywords');

router.post('/gcm', function(req, res) {
	console.log('req.seesion : ', req.session);
	console.log('req.body : ', req.body);
	var reg_id = req.body.reg_id;

	if ( !reg_id ) {
		return res.status(400)
		.json({
			error : "reg_id is empty",
			code  : 2
		});
	}

	var post_title = '[공통] 17년 동계방학 MOS자격증 특강반 모집 안내';
	var post_content = '17년 동계방학 MOS자격증 특강반 모집 안내 ...';
	var message = new gcm.Message({
	    collapseKey: 'demo',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	    	post_id : 381,
	      	post_title: post_title,
	      	post_content: post_content
	    },
	    notification: {
	      title: post_title,
	      icon: "aim_bleu",
	      body: post_content
	    }
	});


	var server_api_key = 'AIzaSyAUEX5kRjIR5yh_G4t54KulHwh7SCrLs3c';
	var sender = new gcm.Sender(server_api_key);
	var registrationIds = [];


	registrationIds.push(reg_id);

	 console.log('message : ', message );

	sender.send(message, registrationIds, 4, function (err, result) {
	    console.log('result : ', result);
		if (err) {
			res.json({
				result : false,
				gcm_result : err,
				body : req.body

			});
		} else {
			if ( result.success ) {
				res.json({
					result : true,
					gcm_result : result,
					gcm_data : message.params.data,
					gcm_notification : message.params.notification,
					body : req.body
				});
			} else {
				res.json({
					result : false,
					gcm_result : result,
					body : req.body
				});
			}

		}
	});
});

router.use('/boards', boards);
router.use('/users', users);
router.use('/posts', posts);
router.use('/keywords', keywords);

module.exports = router;
