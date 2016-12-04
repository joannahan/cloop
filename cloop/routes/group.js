// Lead author: Danny
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = require('../models/user');
var Class = require('../models/class');
var Post = require('../models/post');
var Comment = require('../models/comment');

var requestCallback = function(res) {
	return function(err, result) {
		if (err)	res.send(err);
		else		res.redirect('/group');
	}
}

/* GET user page. */
router.get('/', function(req, res, next) {
	//check to see if the user is verified
	if (req.user.verifiedEmail) {
			//get user's classes:
		User.getClassesEnrolledByStudent(req.user, function(classIds){
			var classlist = [];
			var classes = [];
			for (var i = 0; i < classIds.length; i++){
				Class.findOne({_id:classIds[i]}, function(err, resclass){
					classlist.push(resclass.name);
					classes.push(resclass);
				});
			}

			Class.getAllClasses(function(classNames){

				//remove userClass from allclass
				var otherClasses = classNames.filter(function(el){return classlist.indexOf(el) < 0});
				console.log("classlist: " + classlist + classes);
				var data = {
					username: req.user.username,
					email: req.user.email,
					userclass: classlist,
					allclass: otherClasses,
					classes: classes
				};

				res.render('user_page', data);	
			});
		});
	} else {
		var data = {
			username: req.user.username,
			email: req.user.email
		}
		res.render('verification', data);	
	}
});

//get all posts
router.get('/getall', function(req, res, next) {
	//TODO get all posts from each specific class
	//var className = req.params.name;
	Class.getAllPosts(function(err, posts){
		if (err) {
			return done(res, err, false, null);				
		}				
		if(!posts || posts.length===0){
			return done(res, null, true, 'there are no posts.');
		}
  		res.json({
			success: true, 
			posts: posts
		});				
	});			
});

//get class page
router.get('/:name', function(req, res, next) {
	var className = req.params.name;
	var handlebarsObject = {};
	handlebarsObject.title = className;
	handlebarsObject.description = "Class Page";
	if (req.user === undefined) {
		//return {end:"end"};
		throw new Error("Please login first.");
	} 	
	Class.getClass(className, function(err, _class) {
		if (err) {
			console.log(err);
		} else {
			var classId = _class._id;
			handlebarsObject.classId = classId;

			Class.getPosts(classId, function(err, posts) {
				if (err) {
					console.log(err);
				} else {
					var classPosts = posts.posts;
					var postIds = classPosts.map(function(a) {return a._id});

					Post.populateComments(postIds, function(err, posts) {
						if (err) {
							console.log(err);
						} else {
							//console.log("getPosts:" + posts);
							handlebarsObject.post = posts.reverse();
							//for each author in results, replace it with name
							res.render('class_page', handlebarsObject);
						}
					});
				}
			});
		}
	});
});

//get archived class page
router.get('/archives/:name', function(req, res, next) {
	var className = req.params.name;
	var handlebarsObject = {};
	handlebarsObject.title = className;
	handlebarsObject.description = "Class Page";
	if (req.user === undefined) {
		//return {end:"end"};
		throw new Error("Please login first.");
	} 	
	Class.getClass(className, function(err, _class) {
		if (err) {
			console.log(err);
		} else {
			var classId = _class._id;
			handlebarsObject.classId = classId;

			Class.getPosts(classId, function(err, posts) {
				if (err) {
					console.log(err);
				} else {
					var classPosts = posts.posts;
					var postIds = classPosts.map(function(a) {return a._id});

					Post.populateComments(postIds, function(err, posts) {
						if (err) {
							console.log(err);
						} else {
							//console.log("getPosts:" + posts);
							handlebarsObject.post = posts.reverse();
							//for each author in results, replace it with name
							res.render('archived_class_page', handlebarsObject);
						}
					});
				}
			});
		}
	});
});

//Search class by name
router.get('/search/:_name', function(req, res, next) {
	var className = req.params._name;
	Class.getClass(className, function() {});
});

//create new class page
router.post('/class', function(req, res, next) {
	var className = req.body.className;
	Class.createClass(className, function(err, result) {
		if (err) {
			if (err.code === 11000) {
				req.flash('error_msg','There already exists a class with that name.');
	  			res.redirect('/group');
			}
			else res.send(err);
		}	
		else
			res.redirect('/group');
	});
	//possibly update class list for autocomplete
});

//add student to a class
router.post('/user/add', function(req, res, next) {
	var userId = req.user.id;
	var className = req.body.className;

	Class.getClass(className, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			var classId = result._id;
			Class.addStudent(classId, userId, requestCallback(res));
		}
	});
});

//remove student from a class
router.post('/user/remove', function(req, res, next) {
	var userId = req.user.id;
	var className = req.body.className;

	Class.getClass(className, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			var classId = result._id;
			Class.removeStudent(classId, userId, requestCallback(res));
		}
	});
});

//update classesTaken list based on whether taken or not
router.put('/:id', function(req, res, next) {
	// if already taken, but want to untake
	Class.getClassById(req.params.id, function(err,data){
		if (err){
			return done(res, err, false, null);
		}
		var _class = data;
		console.log("class:" + _class);
		console.log("REQUSER: " + req.user);
		var isTaken=(req.user.classesTaken.indexOf(_class._id)>-1);
		console.log("CLASSID: "+ _class._id);
		console.log("ISTAKEN: " + isTaken);
		var action=req.body.action;
		if (!isTaken && action=='add') {
			User.updateClassesTakenList(_class._id,req.user._id, action, function(err, user){
				if (err) {
					return done(res, err, false, null);				
				} else {
					console.log("POOP: " + user);
		  			res.json({
						success: true,
						_class: _class
					});	
				}
			});					
		}else{
			return done(res, null, true, 'there is no required acton:'+action +' a class (add=class, remove=remove class).');
		}		
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
	} else if (err === null && success === false) {
		// console.log(customMessage);
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
module.exports = router;
