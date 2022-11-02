var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport"); /* POST login. */
var multer = require('multer');
//const session = require('express-session');
require('./configs/db');
require('dotenv').config();

var app = express();

// Import passport auth
require('./configs/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var authRouter = require('./routes/auth');
var documentsRouter = require('./routes/documents');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var fs = require('fs')



//app.use(multer())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
//app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/users', passport.authenticate('jwt', {session: false}), usersRouter);
app.use('/upload', passport.authenticate('jwt', {session: false}), uploadRouter);
app.use('/auth',  authRouter);
app.use('/documents', passport.authenticate('jwt', {session: false}), documentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
