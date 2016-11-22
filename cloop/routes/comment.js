var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Comment = require('../models/comment');

var requestCallback = function(err, result) {
	if (err) {
		res.send(err);
	} else {
		res.send("Success!");
	}
}

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
	Comment.createComment(authorId, postId, commentText, requestCallback);
});

//delete comment
router.delete('/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;

	Comment.getComment(commentId, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			if (result.author === userId) {
				Comment.removeComment(commentId, requestCallback);
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//edit comment
router.put('/edit/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var newText = req.body.newText;
	var userId = req.session.userId;
	
	Comment.getComment(commentId, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			if (result.author === userId) {
				Comment.editComment(commentId, newText, requestCallback);
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//upvote post
router.post('/upvote/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for upvote method in user model
});

//unupvote post
router.post('/unupvote/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unupvote method in user model
});

//flag post
router.post('/flag/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for flag method in user model
});

//unflag post
router.post('/unflag/:_id', function(req, res, next) {
	var commentId = req.body._id;
	var userId = req.session.userId;
	
	//waiting for unflag method in user model
});

module.exports = router;
