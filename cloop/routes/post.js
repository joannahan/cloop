var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');

var requestCallback = function(err, result) {
	if (err) {
		res.send(err);
	} else {
		res.send("Success!");
	}
}

//Get all posts
router.get('/', function(req,res){
	//res.send('postpostpostpost');
	res.render('posts');
});

//get all posts - json stringified
router.get('/getall', function(req, res, next) {
	
});

//create new post
router.post('/post', function(req, res, next) {
	var postText = req.body.postText;
	var authorId = req.session.userId;
	var classId = req.body.classId;
	Post.createPost(authorId, classId, postText, requestCallback);
});

//delete post
router.delete('/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;

	Post.getPost(postId, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			if (result.author === userId) {
				Post.removePost(postId, requestCallback);
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//edit post
router.put('/edit/:_id', function(req, res, next) {
	var postId = req.body._id;
	var newText = req.body.newText;
	var userId = req.session.userId;
	
	Post.getPost(postId, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			if (result.author === userId) {
				Post.editPost(postId, newText, requestCallback);
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//upvote post
router.post('/upvote/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for upvote method in user model
});

//unupvote post
router.post('/unupvote/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unupvote method in user model
});

//flag post
router.post('/flag/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for flag method in user model
});

//unflag post
router.post('/unflag/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unflag method in user model
});

module.exports = router;