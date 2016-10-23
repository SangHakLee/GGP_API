var request = require('request'),
		cheerio = require('cheerio'),
    rp = require('request-promise');


var models = require('../models');

var crawler = {};


function getAllBoard(){
	return models.Boards.findAll({})
	.then(function(results){
		return results;
	})
	.catch(function(err){
		throw err;
	});
}

getAllBoard().then(function(boards){
	// console.log(boards)
});


function updateBoardPostNo(update_row, where){
	return models.Boards.update(update_row, {
		where : where
	}).then(function(result){
		return result;
	}).catch(function(err){
		throw err;
	});
}


function updateRecent(boards){
	for(i in boards){
		// console.log('board : ', boards[i].get('board_url'));
		var board_id = boards[i].get('id');
		var board_url = boards[i].get('board_url');
		var now_post_no_db = boards[i].get('now_post_no');
		var now_board_no_db = boards[i].get('now_board_no');
		getNowPostNo(boards[i].get('board_url')).then(function(now_no){
			if(now_no){ // 에러가 아닐 때

				if(now_no[0] != now_post_no_db){ // 추가할 것이 있다.
					console.log('추가할 것이 있음');
					while( now_board_no_db < now_no[1] ){
						// console.log('while', ++now_board_no_db); console.log('while', ++now_post_no_db);
						getBoardByCrawler(board_url, ++now_board_no_db, ++now_post_no_db).then(function(){
						});
					}
					// console.log('now_board_no_db', now_board_no_db)
					// console.log('now_post_no_db', now_post_no_db)
					var update_row = {
						now_board_no : now_board_no_db,
						now_post_no : now_post_no_db
					};
					var where = {id : board_id};
					updateBoardPostNo(update_row, where);
				}
				// console.log('now_post_no', now_post_no)
				// console.log('now_post_no_db', now_post_no_db)
			}
		});
	}
}

function getBoardNoFromUrl(url){
	var aa = url.split(';');
	for(i in aa){
		if(~aa[i].indexOf('board_no')){
			return aa[i].replace(/[^0-9]/g, '');
		}
	}
	return null;
}

// console.log('aa', getBoardNoFromUrl())


// 현재 특정 공지사항 게시판 최근 글번호
function getNowPostNo(url){
	var options = {
		uri: url,
    transform: function (body) {
       return cheerio.load(body, {
				normalizeWhitespace: true, // 공백 제거
			});
    }
	};
	return rp(options)
	.then(function($){
		var now_post_no = null;
		var now_board_no = null;
		$('.boardlist tbody tr').each(function(){
			var $td = $(this).children().text();
			var $a = $(this).children().next(); // a 태그 선택자
			$('img').remove();
			$td = $td.split(' ')[0]; // 띄어쓰기로 자른 데이터
			$td = $td.replace(/[^0-9]/g, ''); // 숫자만 가져오기
			if($td){ // 공백 데이터 제외
				now_board_no = getBoardNoFromUrl($a.eq(0).html());
				now_post_no = $td;
				return false;
			}
		});
		console.log('now_post_no :',now_post_no);
		console.log('now_board_no :',now_board_no);
		return [now_post_no, now_board_no];
	})
	.catch(function(err){
		console.error('err: ', err);
		throw err;
	});


}

function getBoardByCrawler(board_url, board_no, post_no){
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
			var td_raw = $(this).find('td')
			if(!td_raw) {// 해당 번호에 게시판이 없다는 것
				return false
			}
			// console.log('있다');
			var td = td_raw.text();
			// var td = $(this).find('td').html();
			++index;
			// console.log('index : ', index);
			// console.log('td : ', td);
			if(index == 1) row.post_title = td;
			if(index == 3) row.posted_at = td;
			if(index == 6){
				row.post_content = td;
				row.post_content_html = td_raw.html();
			}
		});
		row.post_no = post_no;
		row.board_id = 1;
		row.board_no = board_no;
		// console.log('row : ', row)
		models.POSTS_STATS.create(row)
	})
	.catch(function(err){
		throw err
		// return err
		console.error('err: ', err)
	});
}


// getNowPostNo('http://gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358')



crawler.getAllBoard = getAllBoard;
crawler.updateRecent = updateRecent;
module.exports = crawler;
