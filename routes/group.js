// Lead author: Joanna
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();

var User = require('../models/user');
var Class = require('../models/class');
var Post = require('../models/post');
var Comment = require('../models/comment');
var CoursePersist= require('../util/coursePersist');

var requestCallback = function(res) {
	return function(err, result) {
		if (err)	res.render('error', {message: 'There was an error.', error: err});
		else		res.redirect('/group');
	}
}

// get group page
router.get('/', function(req, res, next) {
	//check to see if the user is verified
	if (req.user.verifiedEmail) {
		Class.getClasses(req.user.classesEnrolled, function(err, enrolledClasses){
			var enrolledClassNames=[];
			enrolledClasses.forEach(function(item) {
				enrolledClassNames.push(item.name);
			});
			User.syncAdminRole(req.user,function(err, user){
				if (err){
					console.log("syncAdminRole error");
				}
				if (user.admin !== req.user.admin){
					//sync user
					User.getUserById(req.user._id,function(err, user){
						if(err){
							return done(res, err, false, null);
						}else{
							req.user=user;
						}
					});
				}
			});
			Class.getClasses(req.user.classesTaken, function(err, takenClasses){
				var takenClassNames=[];
				takenClasses.forEach(function(item) {
					takenClassNames.push(item.name);
				});
				Class.getAllClassesNames(function(classNames){
					//filter
					var untakenClassNames = classNames.filter(function(el){return enrolledClassNames.indexOf(el) < 0});
					untakenClassNames = untakenClassNames.filter(function(el){return takenClassNames.indexOf(el) < 0});
					
					Class.getClassesByNames(untakenClassNames, function(err, untakenClasses){			
						var data = {
							user: req.user,
							untakenClasses: untakenClasses,
							enrolledClasses: enrolledClasses,
							takenClasses: takenClasses
						};		
						res.render('user_page', data);					
					});
				});
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

//gets all class names the user isn't currently enrolled in and hasn't taken
router.get('/nonuserclasses', function(req,res, next) {
	User.getClassesEnrolledByStudent(req.user, function(classIds){
		Class.getClasses(req.user.classesEnrolled, function(err, enrolledClasses){
			var enrolledClassNames=[];
			enrolledClasses.forEach(function(item) {
				enrolledClassNames.push(item.name);
			});
			Class.getClasses(req.user.classesTaken, function(err, takenClasses){
				var takenClassNames=[];
				takenClasses.forEach(function(item) {
					takenClassNames.push(item.name);
				});
				Class.getAllClassesNames(function(classNames){
					//filter
					var nonUClasses = classNames.filter(function(el){return enrolledClassNames.indexOf(el) < 0});
					nonUClasses = nonUClasses.filter(function(el){return takenClassNames.indexOf(el) < 0});
					res.json({
						success:true,
						classes:nonUClasses
					});
				});
			});
		});
	});
});

//get all posts
router.get('/getall', function(req, res, next) {
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
		res.redirect('/');
	} 	
	Class.getClass(className, function(err, _class) {
		if (err || !_class) {
			res.render('error', {message: "There was an error.", error: err});
		} else {
			var classId = _class._id;
			handlebarsObject.classId = classId;
			handlebarsObject.studentListing = _class.studentListing;

			Class.getPosts(classId, function(err, posts) {
				if (err) {
					res.render('error', {message: "There was an error.", error: err});
				} else {
					var classPosts = posts.posts;
					var postIds = classPosts.map(function(a) {return a._id});

					Post.populateComments(postIds, function(err, posts) {
						if (err) {
							res.render('error', {message: "There was an error.", error: err});
						} else {
							handlebarsObject.post = posts.reverse();
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
		throw new Error("Please login first.");
	} 	
	Class.getClass(className, function(err, _class) {
		if (err || !_class) {
			res.render('error', {message: "There was an error.", error: err});
		} else {
			var classId = _class._id;
			handlebarsObject.classId = classId;

			Class.getPosts(classId, function(err, posts) {
				if (err) {
					res.render('error', {message: "There was an error.", error: err});
				} else {
					var classPosts = posts.posts;
					var postIds = classPosts.map(function(a) {return a._id});

					Post.populateComments(postIds, function(err, posts) {
						if (err) {
							res.render('error', {message: "There was an error.", error: err});
						} else {
							handlebarsObject.post = posts.reverse();
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
	Class.getClass(className, function(err, _class){
		if (err){
			return done(res, err, false, null);
		}else{
			if (_class){
				return done(res, null, true, 'There already exists a class with that name.');
			}else{
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
			}
		}
	});
});

//enroll a user in a class
router.post('/user/enroll_class', function(req, res, next) {
	var userId = req.user.id;
	var classId = req.body.classId;
	var isEnrolled=(req.user.classesEnrolled.indexOf(classId)>-1);
	var isTaken=(req.user.classesTaken.indexOf(classId)>-1);
	if (!isEnrolled && !isTaken){
		Class.addEnrolledStudent(classId, req.user.id,function(err, user){
			if (err) {
				return done(res, err, false, null);
			} else {
				//sync user
				User.getUserById(req.user._id,function(err, user){
					if(err){
						return done(res, err, false, null);
					}else{
						req.user=user;
						res.redirect('/group');
					}						
				});				
			}
		});		
	}else{
		return done(res, null, true, 'You are already enrolled/have taken this class.');
	}
});

//enroll a user in a class by class name
router.post('/user/enroll_class_by_name', function(req, res, next) {
	Class.getClass(req.body.className, function(err, _class){
		if(err){
			res.render('error', {message: "There was an error.", error: err});
			return err;
		}else{
			var isEnrolled=false;
			var isTaken=false;
			if (_class){
				isEnrolled=(req.user.classesEnrolled.indexOf(_class._Id)>-1);//Warning:will return null if there is a null in the array			
				isTaken=(req.user.classesTaken.indexOf(_class._Id)>-1);
			}
			if (!isEnrolled && !isTaken){
				Class.addEnrolledStudent(_class._id, req.user.id,function(err, user){
					if (err) {
						return done(res, err, false, null);
					} else {
						//sync user
						User.getUserById(req.user._id,function(err, user){
							if(err){
								return done(res, err, false, null);
							}else{
								req.user=user;
								res.redirect('/group');
							}
						});
					}
				});
			}else{
				return done(res, null, true, 'You are already enrolled/have taken this class.');
			}
		}
	});
});

//remove a student from a class
router.post('/user/remove', function(req, res, next) {
	var userId = req.user.id;
	var className = req.body.className;

	Class.getClass(className, function(err, result) {
		if (err) {
			res.render('error', {message: "There was an error.", error: err});
		} else {
			var classId = result._id;
			Class.removeStudent(classId, userId, requestCallback(res));
		}
	});
});

//download mit course data from web services
router.post('/admin/download_courses', function(req, res, next) {
	console.log("downloading MIT courses....");	
	CoursePersist.download(function(err, data) {
		if (err) {
			done(res,err,false,null);
		}else{
			done(res,null, true, "Courses download complete.");
		}
	});
});

//import/update course data for mongoimport utility
router.post('/admin/package_course_data', function(req, res, next) {
	console.log("packaging course data...");	
	CoursePersist.transfer(function(err) {
		if (err) {
			done(res,null,false,null);
		}else{
			done(res, null, true, "Courses data import complete.");
		}
	});
	console.log("sync complete");
});

//update classesTaken list based on whether taken or not
router.post('/user/move_enrolled_class', function(req, res, next) {
	// if already taken, but want to move it from classEnrolled array to classTaken array
	Class.getClassById(req.body.classId, function(err,data){
		if (err){
			return done(res, err, false, null);
		}
		var _class = data;
		var isTaken=(req.user.classesTaken.indexOf(_class._id)>-1);
		if(!isTaken){
			User.moveFromEnrolledClassToTakenClass(req.user._id, _class._id, function(err){
				if (err){
					return done(res, err, false, null);
				}else{
					//sync user
					User.getUserById(req.user._id,function(err, user){
						if(err){
							return done(res, err, false, null);
						}else{
							req.user=user;
							res.redirect('/group');
						}
					});
				}
			});					
		}else{
			return done(res, null, true, 'This class has already been taken.');
		}		
	});
});

//common helper function for callback
var done = function(res, err, success, customMessage) {
	if (err) {
		res.render('error', {message: "There was an error.", error: err});
		res.json({
			success: false, 
			message: err.message
		});
	} else if (err === null && success === false) {
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
