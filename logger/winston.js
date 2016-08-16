var winston = require('winston'),
  moment = require('moment'),
  expressWinston = require('express-winston');



var logFilePath = __dirname + '/../logger';

winston.add(winston.transports.File, {
  filename: logFilePath + '/exception.log',
  handleExceptions: true,
  humanReadableUnhandledException: true
});



var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      level: 'info',
      colorize: true,
      timestamp: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      }
    }),
    new(winston.transports.File)({
      level: 'debug',
      json: false,
      filename: logFilePath + '/debug.log',
      datePattern: 'yyyy-MM-dd.log'
    })
  ],
  // exceptionHandlers: [
  //   new winston.transports.File({
  //     filename: logFilePath + '/exception.log',
  //   })
  // ]
});

// logger.configure({
//    level: 'verbose',
//    transports: [
//      new (require('winston-daily-rotate-file'))({
//        json: false
//      })
//    ]
//  });



module.exports = logger;
