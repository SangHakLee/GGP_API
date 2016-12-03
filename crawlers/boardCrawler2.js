var request = require('request'),
	cheerio = require('cheerio'),
    rp = require('request-promise');


var models = require('../models');
var logger = require('../logger/winston');


function Crawler(){}

// searchKeywords.js 대체
Crawler.prototype.findKeywords = function(sentence) {
	return models.Keywords.findAll({
		limit : 50,
		order : ['updated_at', 'desc']
	}).then(function(keywords){
		return keywords;
	}).catch(function(err){
		throw err;
	});
};


function getBoardNoFromUrl(url) {
  var aa = url.split(';');
  for (var i in aa) {
    if (~aa[i].indexOf('board_no')) {
      return aa[i].replace(/[^0-9]/g, '');
    }
  }
  return null;
}

Crawler.prototype.getNowPostNumByBoardUrl = function(board_url){
	var options = {
    uri: board_url,
    transform: function(body) {
      return cheerio.load(body, {
        normalizeWhitespace: true, // 공백 제거
      });
    }
  };
  return rp(options)
    .then(function($) {
      var now_post_no = null;
      var now_board_no = null;
      $('.boardlist tbody tr').each(function() {
        var td = $(this).children().text();
        var a = $(this).children().next(); // a 태그 선택자
        $('img').remove();
        td = td.split(' ')[0]; // 띄어쓰기로 자른 데이터
        td = td.replace(/[^0-9]/g, ''); // 숫자만 가져오기
        if (td) { // 공백 데이터 제외
          now_board_no = getBoardNoFromUrl(a.eq(0).html());
          now_post_no = td;
          return false;
        }
      });
      // console.log('now_post_no :',now_post_no);
      return [now_post_no, now_board_no];
    })
    .catch(function(err) {
			console.error('err: ', err);
      throw new Error(err);
    });
};


Crawler.prototype.getAllBoard = function(board_no){

  return models.Boards.findAll({
    where : {board_no : board_no}
  })
	.then(function(results){
    if(results.length < 0){
      return null;
    }
		return results;
	})
	.catch(function(err){
		throw err;
	});
};

Crawler.prototype.getPostByCrawler = function(board_id, board_url, board_no, post_no){
  var options = {
		uri: board_url,
		qs : {
			mode : 'view',
			// boardType_seq : 358,
			board_no : board_no
		},
    transform: function (body) {
       return cheerio.load(body, {
				normalizeWhitespace: true, // 공백 제거
			});
    }
	};
  return rp(options)
	.then(function($){
		var row = {};
		$('.boardview table tr').each(function(index){
			var td_raw = $(this).find('td');
			if(!td_raw) {// 해당 번호에 게시판이 없다는 것
				return false;
			}
			var td = td_raw.text();
			++index;

			if(index == 1) row.post_title = td;
			if(index == 3) row.posted_at = td;
			if(index == 6){
				row.post_content = td;
				row.post_content_html = td_raw.html();
			}
		});
    row.board_id = board_id;
    row.board_no = board_no;
		row.post_no = post_no;
		console.log('게시판 추가 : ', board_no);
		models.Posts.create(row);
	})
	.catch(function(err){
    console.error('err: ', err);
		throw err;
	});
};

Crawler.prototype.updateBoardById = function(board_id){
	return models.Boards.findById(board_id)
	.then(function(result){
		// console.log(result);
		return result;

		// crawler.getNowPostNumByBoardUrl(result.board_url)
		// .then(function(now){
		// 	console.log('now', now);
		// })
		//
		// var _result = {
		// 	"board_id" : result.board_id,
		// 	"board_url" : result.board_url,
		// 	"now_board_no" : result.now_board_no,
		// 	"now_post_no" : result.now_post_no
		// };
		// return _result;
	})

	.catch(function(err){

		throw new Error(err);
	});
};

Crawler.prototype.updateBoardPostNo = function (update_row, where) {
  return models.Boards.update(update_row, {
    where : where
  }).then(function(result) {
    return result;
  }).catch(function(err) {
    throw err;
  });
};


Crawler.prototype.updateRecent = function (crawler, board) {
  var board_id = board.get('id');
  var board_url = board.get('board_url');
  var now_post_no_db = board.get('now_post_no');
  var now_board_no_db = board.get('now_board_no');
  crawler.getNowPostNumByBoardUrl(board.get('board_url'))
	.then(function(now_no) {
    if (now_no) { // 에러가 아닐 때
      if (now_no[0] != now_post_no_db) { // 추가할 것이 있다.
        while (now_board_no_db < now_no[1]) {
          crawler.getPostByCrawler(board_id, board_url, ++now_board_no_db, ++now_post_no_db)
					.then(function() {})
					.catch(function(err){throw new Error(err);});
        }
        var update_row = {
          now_board_no: now_board_no_db,
          now_post_no: now_post_no_db
        };
        var where = {
          id: board_id
        };
        crawler.updateBoardPostNo(update_row, where);
      }
    }
  });

};




// var crawler = new Crawler();
// // crawler.getPostByCrawler(1, 'http://gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358', 5700, 5204);
// crawler.updateBoardById(1)
// .then(function(result){
// 	return crawler.updateRecent(crawler, result);
// })
// .catch(function(err){
// 	console.log('err : ', err);
// });





module.exports = Crawler;
