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
		if (err) {
			res.send(err);
		} else {
			res.redirect('/group');
		}
	}
}

/* GET user page. */
router.get('/', function(req, res, next) {
	//res.send('Class Page');
	//get user's classes:
	User.getClassesEnrolledByStudent(req.user, function(classIds){
		var classlist = [];
		for (var i = 0; i < classIds.length; i++){
			Class.findOne({_id:classIds[i]}, function(err, resclass){
				classlist.push(resclass.name);
			});
		}

		var data = {
		username: req.user.username,
		email: req.user.email,
		class: classlist
		};

		res.render('user_page', data);	
	});
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

	Class.getClass(className, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			var classId = result._id;
			handlebarsObject.classId = classId;

			Class.getPosts(classId, function(err, result) {
				if (err) {
					console.log(err);
				} else {
					var classPosts = result.posts;
					var postIds = classPosts.map(function(a) {return a._id});

					Post.getComments(postIds, function(err, results) {
						if (err) {
							console.log(err);
						} else {
							handlebarsObject.post = results.reverse();
							//for each author in results, replace it with name
							res.render('class_page', handlebarsObject);
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
	Class.createClass(className, requestCallback(res));
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
	})
});

//remove student from a class
router.post('/user/remove', function(req, res, next) {
	var userId = req.user.id;
	var classId = req.body.classId;
	Class.removeStudent(classId, userId, requestCallback(res));
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
		// console.log(customMessage);
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
