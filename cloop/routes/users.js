// Lead author: Joanna
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var secret = require('../secret/secret');
var transporter = secret.transporter;

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('This is the user page lmao');
  res.render('user_listing', { title: 'list of users in class' });
});

//Search users by name
router.get('/search/:name', function(req, res, next) {
	
});

//get all users
router.get('/getall', function(req, res, next) {
	
});


//Register
router.get('/register', function(req,res){
	res.render('register');
});

//create new registered user
router.post('/register', function(req,res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//Validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('email', 'Email must end in @mit.edu').isMITEmail();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	
	if (errors)	res.render('register', {errors:errors});
	else {
		var verificationString = generateVerificationString();
		var user = new User({name:name, email:email, username:username, password:password, verificationString: verificationString});
		
		user.save(function(err, user) {
			if(err) {
				if (err.code == 11000) {
					req.flash('error_msg','A user already exists with this username and/or email');
					res.redirect('/users/register');
				} else {
					req.flash('error_msg',err.message);
				}
			} else {
				var mailOptions = {
					from: 'noreply.cloop@gmail.com',
					to: email,
					subject: 'Verify your cloop account!',
					text: 'Thank you for registering with cloop! Please log in and use the following code to verify your account for full access to cloop: ' + verificationString
				}

				transporter.sendMail(mailOptions);				

				req.flash('success_msg','You are registered and can now log in. You should receive an email that will allow you to verify your account.');
				res.redirect('/users/login');
			}
		})
	}
});

router.post('/verify', function(req, res) {
	var userId = req.user.id;
	var verificationString = req.body.verificationString;

	User.verifyAccount(userId, verificationString, function(err, result) {
		if (err === "Verification Error") {
			req.flash("error_msg", "The verification code you have entered is not valid. Please double check and try again.");
			res.redirect('/group');
		} else if (err) {
			console.log(err);
		} else {
			res.redirect('/group');
		}
	});
});

//Login
router.get('/login', function(req,res){
	res.render('login');
});

//create new user login session
router.post('/login',
	passport.authenticate('local',{successRedirect:'/group',failureRedirect:'/users/login',failureFlash:true}),
	function(req, res) {
		res.redirect('/');
	}
);

//Logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You have been logged out');
	res.redirect('/users/login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
	  User.getUserByUsername(username, function(err, user) {
		  if(err) throw err;
		  if(!user){
			  return done(null, false,{message:'Unknown User'});
		  }
		  user.verifyPassword(password, function(err, isMatch){
			  if (err) 
			  	throw err;
			  if (isMatch) {
				  //insert user object to a session here later
				  return done(null, user)
			  } else {
				  return done(null, false, {message:'Invalid password'});
			  }
		  })
	  });
  }
));

//serialize user session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

//deserialize user session
passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

//common helper function for callback
var done = function(res, err, success, customMessage) {
	if (err) {
		console.log(err);
			res.json({
			success: false, 
			message: err.message
		});
	} else if (err===null && success===false) {
		console.log(customMessage);
		res.json({
			success: false, 
			message: customMessage	
		});	
	} else {
		res.json({
			success: true, 
			message: customMessage	
		});			
	}
	return done;
}

var generateVerificationString = function() {
	var text = [];

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i=0; i < 6; i++)
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return text.join("");
}


module.exports = router;
