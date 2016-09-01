var request = require('request'),
		cheerio = require('cheerio'),
    rp = require('request-promise');


var models = require('../models');


function Crawler(){}

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
	console.log("hi getPostByCrawler");
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
		// console.log('row : ', row);
		console.log('게시판 추가 : ', board_no);
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

		crawler.getNowPostNumByBoardUrl(result.board_url)
		.then(function(now){
			console.log('now', now);
		})

		var _result = {
			"board_id" : result.board_id,
			"board_url" : result.board_url,
			"now_board_no" : result.now_board_no,
			"now_post_no" : result.now_post_no
		};
		return _result;
	})
	.catch(function(err){
		throw new Error(err);
	});
};



var crawler = new Crawler();
// crawler.getPostByCrawler(1, 'http://gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358', 5700, 5204);
crawler.updateBoardById(1)
.then(function(result){
	// return this.getPostByCrawler(1, result.board_url, result., 5204);
	return crawler.getPostByCrawler(1, 'http://gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358', 5700, 5204);
})
.then(function(result){
	console.log('result ?', result);
})
.catch(function(err){
	console.log('err : ', err);
});



module.exports = Crawler;
