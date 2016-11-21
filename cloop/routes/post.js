var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');

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
	Post.createPost(authorId, postText, res.redirect('/'));
});

//delete post
router.delete('/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;

	Post.getPost(postId, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result.author === userId) {
				Post.removePost(postId, function(err, result) {
					if (err) {
						console.log(err);
					} else {
						res.redirect('/');
					}
				});
			} else {
				//throw some error about wrong users
			}
		}
	});
});

router.put('/edit/:_id', function(req, res, next) {
	var postId = req.body._id;
	var newText = req.body.newText;
	var userId = req.session.userId;
	
	Post.getPost(postId, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result.author === userId) {
				Post.editPost(postId, newText, function(err, result) {
					if (err) {
						console.log(err);
					} else {
						res.redirect('/');
					}
				});
			} else {
				//throw some error about wrong users
			}
		}
	});
});

router.post('/upvote/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for upvote method in user model
});

router.post('/unupvote/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unupvote method in user model
});

router.post('/flag/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for flag method in user model
});

router.post('/unflag/:_id', function(req, res, next) {
	var postId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unflag method in user model
});

module.exports = router;