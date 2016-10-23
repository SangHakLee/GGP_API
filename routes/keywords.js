var express = require('express');
var router = express.Router();

router.post('/', function(req, res){
	// TODO keywords 추가
});

router.get('/', function(req, res){
	// TODO keywords 모두 읽기
});

router.get('/:id', function(req, res){
	// TODO keywords 1개 읽기
});

module.exports = router;
