//Lead author: Joanna
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var handlebars = require('handlebars');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var request = require('request');
var fs = require('fs');
var index = require('./routes/index');
var users = require('./routes/users');
var group = require('./routes/group');
var post = require('./routes/post');
var comment = require('./routes/comment');

//Database setup
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/cloop');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("database connected");
});

var app = express();

// view engine setup
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout'}));
app.set('view engine', 'hbs');

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//Passport sessions
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },

  customValidators: {
  	isMITEmail: function(email) {
		emailLength = email.length;
		emailValidation = '@mit.edu';
		emailValidationLength = emailValidation.length;

		return email.slice(emailLength - emailValidationLength) === emailValidation;
	}
  }
}));

//Connect Flash
app.use(flash());

app.use(function(req,res,next){
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error'); //passport set own error
	res.locals.user=req.user||null;
	next();
});

//routes
app.use('/', index);
app.use('/users', users);
app.use('/group', group);
app.use('/post', post);
app.use('/comment', comment);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
	 res.status(err.status || 500);
	 res.json({
	   'message': err.message,
	   'error': err
	 });
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
	 'error': err.message
	});
});

module.exports = app;
