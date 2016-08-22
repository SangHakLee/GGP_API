var request = require('request'),
		cheerio = require('cheerio'),
    rp = require('request-promise');


var models = require('../models');


function Crawler(){

}

Crawler.prototype.getNowPostNumByBoardId = function(board_id){
  this.getAllBoard(boa)
  .then(function(){

  })
  .catch(function(){

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
		console.log('row : ', row);
		// models.POSTS_STATS.create(row)
	})
	.catch(function(err){
    console.error('err: ', err);
		throw err;
	});
};

var crawler = new Crawler();
// crawler.getPostByCrawler('http://gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358', 5671, 5177);


module.exports = Crawler;
