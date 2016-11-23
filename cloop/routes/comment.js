var express = require('express');
var router = express.Router();

var User = require('../models/user');
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

//Get all comments
router.get('/', function(req,res){
	//res.send('commentcommentcommentcomment');
	res.render('comments');
});

//get all comments - json stringified
router.get('/getall', function(req, res, next) {
	
});

//create new comment
router.post('/comment/:postId', function(req, res, next) {
	var commentText = req.body.commentText;
	var authorId = req.session.userId;
	var postId = req.body.postId;
	Comment.createComment(authorId, postId, commentText, requestCallback(res));
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
				Comment.removeComment(commentId, requestCallback(res));
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
				Comment.editComment(commentId, newText, requestCallback(res));
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//upvote comment
router.post('/upvote', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.session.userId;
	
	Comment.addUpvoteComment(userId, commentId, requestCallback(res));
});

//unupvote comment
router.post('/unupvote', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.session.userId;
	
	Comment.unUpvoteComment(userId, commentId, requestCallback(res));
});

//flag comment
router.post('/flag', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.session.userId;
	
	Comment.addFlagComment(userId, commentId, requestCallback(res));
});

//unflag comment
router.post('/unflag', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.session.userId;
	
	Comment.unFlagComment(userId, commentId, requestCallback(res));
});

module.exports = router;
