var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');

var api = require('./routes/api');
// var routes = require('./routes/index');
// var users = require('./routes/users');
// var boards = require('./routes/boards');
// var posts = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var config = require(__dirname + '/config/db.json')["aws"];

var sessionStore = new SessionStore({
	host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database
});

app.use(session({
    secret: 'gachon10',
	store:sessionStore,
    resave: false,// don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored,
	cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 쿠키 유효기간 하루
  }
}));

app.use('/api', api);
// app.use('/', routes);
// app.use('/users', users);
// app.use('/boards', boards);
// app.use('/posts', posts);



// app.get('/user/:id', function (req, res, next) {
//   console.log('ID:', req.params.id);
//   next();
// }, function (req, res, next) {
//   res.send('User Info');
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
