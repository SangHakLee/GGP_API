// var schedule = require('node-schedule');        // Node 스케줄러
// var time = require('time');
// var moment = require('moment');
// var crawler = require('../boardCrawler');
// var logger = require('../config/logger');        // Winston Logger
//
// var timezone = time.currentTimeZone;        // Asia/Seoul
//
// logger.info(timezone);
//
//
//
//
//
//
// var cronTime = '*/30 * * * *';
// var j = schedule.scheduleJob(cronTime, function(){ // 30분 마다
//   logger.info('가천대 크롤러 ' + moment().format('YYYY MM DD HH:mm:ss'));
//   crawler.getAllBoard()
// 	.then(function(boards){
// 			return crawler.updateRecent(boards);
// 	})
// 	.then(function(results){
// 			// console.log('results 2: ', results);
// 	});
// });
