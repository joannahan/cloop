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
			var enrolledClasses = [];
		for (var i = 0; i < req.user.classesEnrolled.length; i++){
			Class.findOne({_id:req.user.classesEnrolled[i]}, function(err, enrolledClass){
					enrolledClasses.push(enrolledClass);
				});
			}
				var takenClasses = [];
		for (var j=0; j<req.user.classesTaken.length; j++) {
			Class.findOne({_id:req.user.classesTaken[j]}, function(err, takenClass) {
						takenClasses.push(takenClass);
					});
				}
					var untakenClasses = [];
		Class.getAllClasses(function(allClasses){
	//			console.log("allClasses:"+allClasses);
			untakenClasses=getUntakenClasses(allClasses,req);
	//			console.log("enrolledClasses:"+req.user.classesEnrolled);
	//			console.log("takenClasses:"+req.user.classesTaken);
	//			console.log("untakenClasses:"+untakenClasses);
			console.log("group page*************");
			var data = {
				user: req.user,
				untakenClasses: untakenClasses,
				enrolledClasses: enrolledClasses,
				takenClasses: takenClasses
			};		
			res.render('user_page', data);
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

//common helper function for untakeClasses
var getUntakenClasses = function(allClasses,req) {
	var enrolledClasses=req.user.classesTaken;
	var takenClasses=req.user.classesEnrolled;
	var untakenClasses=[];
//	console.log("enrolledClasses:"+enrolledClasses);
//	console.log("takenClasses:"+takenClasses);

	var isTaken=false;
	for (var k=0; k<allClasses.length; k++) {
//		console.log("allClass: " + allClasses[k].name);
		for (var l=0; l<enrolledClasses.length; l++) {
			//console.log("enrolledClass: " + enrolledClasses[l].name);							
			if (allClasses[k]._id === enrolledClasses[l]._id) {								
				//console.log("isTaken: " + isTaken);	
				isTaken=true;
				break;
			}
		}
//		console.log("enrrolled:isTaken: " + isTaken);	
		if (isTaken===true){
			continue;
		}else{
			for (var m=0; m<takenClasses.length; m++) {
				//console.log("takenClass: " + takenClasses[m].name);							
				if (allClasses[k]._id === takenClasses[m]._id) {
					isTaken=true;
					//console.log("isTaken2: " + isTaken);	
					break;
				}
			}
//			console.log("takenClasses:isTaken: " + isTaken);	
			if (isTaken===true){
				continue;
			}else{
//				console.log("push:untakenClasses:" + allClasses[k]);
				untakenClasses.push(allClasses[k]);
			}
		}
		isTaken = false;
	}
//	console.log("push:all_untakenClasses:" + untakenClasses);
	return untakenClasses;
}

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
	Class.getClass(className, function(err, _class){
		if (err){
			return done(res, err, false, null);
		}else{
			console.log("create new class:"+_class);
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

////add student to a class
//router.post('/user/add', function(req, res, next) {
//	var userId = req.user.id;
//	var className = req.body.className;
//
//	Class.getClass(className, function(err, result) {
//		if (err) {
//			console.log(err);
//		} else {
//			var classId = result._id;
//			//console.log("RESULT: " + result);
//			Class.addStudent(classId, userId, requestCallback(res));
//		}
//	});
//});

router.post('/enroll', function(req, res, next) {
	var userId = req.user.id;
	var classId = req.body.classId;
	var isEnrolled=(req.user.classesTaken.indexOf(classId)>-1);
	var isTaken=(req.user.classesTaken.indexOf(classId)>-1);
	console.log("isEnroll: "+ isEnrolled);
	console.log("isTaken: " + isTaken);
	if (!isEnrolled && !isTaken){
		console.log("Add:user "+ userId);	
		console.log("To:classId: " + classId);
		Class.updateStudentList(classId, userId, "add", function (err, _class) {
			if (err) {
				return done(res, err, false, null);
			} else {
				User.updateClassesEnrolledList(userId, classId, "add", function (err, _class) {
					if (err){
						return done(res, err, false, null);
					}else{
						res.redirect('/group');
					}						
				});				
			}
		});		
	}else{
		return done(res, null, true, 'You already enroll/take this class.');
	}
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
		//console.log("class:" + _class);
		//console.log("REQUSER: " + req.user);
		var isTaken=(req.user.classesTaken.indexOf(_class._id)>-1);
		//console.log("CLASSID: "+ _class._id);
		//console.log("ISTAKEN: " + isTaken);
		var action=req.body.action;
		if (!isTaken && action=='add') {
			User.updateClassesTakenList(req.user._id,_class._id, action, function(err, user){
				if (err) {
					return done(res, err, false, null);				
				} else {
					//console.log("POOP: " + user);
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
