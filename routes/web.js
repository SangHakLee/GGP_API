var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {

	if ( req.session._id ) {
		res.render('index', {
			session: req.session,
			msg : '<a href="/api/users/logout">로그아웃</a>'
	   	});
	} else {
		res.render('index', {
			session: {
				name : '로그인이 필요합니다.'
			},
			msg : '<a href="/api/users/google">로그인 페이지 이동</a>'
	   	});
	}


});

router.use('/keywords', function(req, res){
	res.render('keywords', {
      session: req.session
    });
});

module.exports = router;
