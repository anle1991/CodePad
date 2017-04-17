var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // for reading json
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
var session = require('express-session');

// Config
var passport = require('passport'); // Require library not the config
require('./passport');
var config = require('./config');

// Use for route later
var indexRoute = require('./routes/index');
var authRoute = require('./routes/auth');
var taskRoute = require('./routes/task');

// Connect to db
mongoose.connect(config.dbConnstring);

// Set User model to be global
global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());

// Create session
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


// Create local info
app.use(function(req,res,next){
  if(req.isAuthenticated()){
    res.locals.user = req.user;
  }
  next();
});

// Use Route here
app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/', taskRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
