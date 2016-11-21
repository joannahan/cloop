var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Comment = require('../models/comment');

//Get all comments
router.get('/', function(req,res){
	//res.send('commentcommentcommentcomment');
	res.render('comments');
});

//get all comments - json stringified
router.get('/getall', function(req, res, next) {
	
});

//create new comment
router.post('/comment', function(req, res, next) {
	var commentText = req.body.commentText;
	var authorId = req.session.userId;
	var postId = req.body.postId;
	Comment.createComment(authorId, postId, commentText, res.redirect('/'));
});

router.delete('/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;

	Comment.getComment(commentId, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result.author === userId) {
				Comment.removeComment(commentId, function(err, result) {
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
	var commentId = req.body._id;
	var newText = req.body.newText;
	var userId = req.session.userId;
	
	Comment.getComment(commentId, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result.author === userId) {
				Comment.editComment(commentId, newText, function(err, result) {
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
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for upvote method in user model
});

router.post('/unupvote/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unupvote method in user model
});

router.post('/flag/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for flag method in user model
});

router.post('/unflag/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unflag method in user model
});

module.exports = router;
