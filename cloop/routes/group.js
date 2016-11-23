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
			res.send("Success!");
		}
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.send('Class Page');
	res.render('user_page');
});

//get class page
router.get('/:name', function(req, res, next) {
	var className = req.params.name;
	var handlebarsObject = {};
	handlebarsObject.title = className;
	handlebarsObject.description = "Filler description";
	handlebarsObject.post = [];

	Class.getClass(className, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			var classId = result._id;
			handlebarsObject.classId = classId;
			res.render('class_page.hbs', handlebarsObject);
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
	var classId = req.body.classId;
	Class.addStudent(classId, userId, requestCallback(res));
});

//remove student from a class
router.post('/user/remove', function(req, res, next) {
	var userId = req.user.id;
	var classId = req.body.classId;
	Class.removeStudent(classId, userId, requestCallback(res));
});

module.exports = router;
