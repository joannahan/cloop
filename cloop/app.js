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
//var async = require ('async');
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

//API request
var destination = fs.createWriteStream("./seeds/courses.json");
var requests = [{
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=1', 
    // would like to only query the 
    //    qs: {from: 'items'},
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=2', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=3', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=4', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=5', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=6', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=7', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=8', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=9', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=10', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=11', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=12', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=14', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=15', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=16', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=17', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=18', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=20', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=21', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=22', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=STS', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}, {
    url: 'https://anypoint.mulesoft.com/apiplatform/proxy/https://mit-public.cloudhub.io/coursecatalog/v2/terms/2016FA/subjects?dept=MAS', 
    method: 'GET', 
    headers: { 
        'client_id': 'd9788cbff7e84180b7ba51fe78cde6c3',
        'client_secret': '6f19f6080e23484dA518BBD66B8DC569'
    }
}];

for (var i=0; i<requests.length; i++) {
    request(requests[i])
        .pipe(destination, {end: false})
        .on('finish', function(){
            console.log('done');
        })
        .on('error', function(err) {
            console.log(err);
        });
}


//async.map(requests, function(obj, callback) {
//	request(obj, function(error, response, body) {
//		if(!error && response.statusCode == 200) {
//			var body = JSON.parse(body);
//			callback(null, body);
//		} else {
//			callback(error || response.statusCode);
//		}
//	});
//}, function(err, results) {
//	if (err) {
//		console.log("error: " + err);
//	} else {
//		//console.log(JSON.stringify(results));
//		results
//			.forEach(function(v) {destination.write(JSON.stringify(v));});
//		destination
//			.on('finish', function() {
//				console.log('done');
//			})
//			.on('error', function(err) {
//				console.log(err);
//			});
//	}
//});

//	.pipe(destination)
//	.on('finish', function() {
//		console.log('done');
//	})
//	.on('error', function(err) {
//		console.log(err);
//	});



// error handlers

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
