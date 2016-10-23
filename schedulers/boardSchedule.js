var CronJob = require('cron').CronJob;        // Node 스케줄러

var moment = require('moment');
var Crawler = require('../crawlers/boardCrawler2');
var logger = require('../logger/winston');








var boardCrawlJob = new CronJob(
  '01 */30 * * * *',
  // '*/1 * * * * *',
  function(){ // job 내용
    logger.info('게시판 크롤러');
	var crawler = new Crawler();
	crawler.updateBoardById(1)
	.then(function(result){
		return crawler.updateRecent(crawler, result);
	})
	.catch(function(err){
		logger.error(err);
		console.log('err : ', err);
	});
  },
  function(){
	  return true;
  },
  // true, // job 발 실행
  false, // job 발 실행
  'Asia/Seoul');

module.exports = boardCrawlJob;
