var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');

var util = require('util');
var fs = require('fs');

/* @routing pages */
var index_login = require('./routes/index_login');
var index_signup = require('./routes/index_signup');
var imageload = require('./routes/images');
var index_main = require('./routes/main');
/* routing pages@ */

var app = express();
var multer  = require('multer');
var upload      =   multer({ dest: './uploads/'});
var done=false;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {

    var name = filename;
    if(10<name.length){
      name = name.substring(0,9);
    }
    return name+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
}));

app.use('/', index_login);
app.use('/main', index_main);
app.use('/users', users);
app.use('/login',index_login);
app.use('/signup',index_signup);
app.use('/image',imageload);

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

http.createServer(app).listen(3000, function() {
  console.log('Express server listening on port ' + 3000);
});
