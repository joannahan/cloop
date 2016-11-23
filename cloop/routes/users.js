// Lead author: Joanna
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

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
router.post('/register', function(req,res){
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
	
	//Validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Password do not match').equals(req.body.password);
	var errors=req.validationErrors();
	if(errors){
//		console.log("error:" + errors);
		res.render('register',{
			errors:errors
		});		
	}else{
//		console.log("name:" + name);
		User.getUserByUsername(username, function(err,user){	
//			console.log("error:" + err);
//			console.log("user:" + user);
			if(err) {
				//return done(res, err, false, null);
				req.flash('error_msg',err.message);
			}else if (user!=null){
				req.flash('error_msg','Same user name is already used by someone. Please select a new user name.');
				res.redirect('/users/register');
			}else{	
//				console.log("user:" + user);
				var newUser=new User({
					name:name,
					email:email,
					username:username,
					password:password
				});
				User.createUser(newUser, function(err,user){
					if(err) throw err;
				});
				req.flash('success_msg','You are registered and can now login');
				res.redirect('/users/login');				
			}
		});
	}
});

//Login
router.get('/login',function(req,res){
	res.render('login');
});

//create new user login session
router.post('/login',
	passport.authenticate('local',{successRedirect:'/group',failureRedirect:'/users/login',failureFlash:true}),
	function(req, res) {
		res.redirect('/');
});

//Logout
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
	  User.getUserByUsername(username, function(err, user){
		  if(err) throw err;
		  if(!user){
			  return done(null, false,{message:'Unknown User'});
		  }
		  User.comparePassword(password, user.password, function(err, isMatch){
			  if(err)throw err;
			  if(isMatch){
				  //insert user object to a session here later
				  return done(null,user)
			  }else{
				  return done(null,false,{message:'Invalid password'});
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
var done=function(res, err, success, customMessage){
	if (err) {
		console.log(err);
			res.json({
			success: false, 
			message: err.message
		});
	}else if (err===null && success===false){
		console.log(customMessage);
		res.json({
			success: false, 
			message: customMessage	
		});	
	}else{
		res.json({
			success: true, 
			message: customMessage	
		});			
	}
	return done;
}


module.exports = router;
