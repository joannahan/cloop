// Lead author: Danny
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Comment = require('../models/comment');
var Class = require('../models/class');

var requestCallback = function(res) {
	return function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('/group');
		}
	}
};

var requestCallback2 = function(res) {
	return function(err, result) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('/group/' + result.name);
		}
	}
};

//Get all comments
router.get('/', function(req,res){
	//res.send('commentcommentcommentcomment');
	res.render('comments');
});

//get all comments - json stringified
router.get('/getall', function(req, res, next) {
	
});

//create new comment
router.post('/:postId/comment', function(req, res, next) {
	var commentText = req.body.commentText;
	var authorId = req.user.id;
	var postId = req.params.postId;

	Comment.createComment(authorId, postId, commentText, function(err, _class) {
		if (err) {
			console.log(err);
		} else {
			Class.getClassByPostId(postId, requestCallback2(res));
		}
	});
});

//delete comment
router.delete('/:_id', function(req, res, next) {
	var commentId = req.params._id;
	var userId = req.user.id;

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
	var commentId = req.params._id;
	var newText = req.body.newText;
	var userId = req.user.id;
	
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
	var userId = req.user.id;
	
	User.addUpvoteComment(userId, commentId, requestCallback(res));
});

//unupvote comment
router.post('/unupvote', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.user.id;
	
	User.unUpvoteComment(userId, commentId, requestCallback(res));
});

//flag comment
router.post('/flag', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.user.id;
	
	User.addFlagComment(userId, commentId, requestCallback(res));
});

//unflag comment
router.post('/unflag', function(req, res, next) {
	var commentId = req.body.commentId;
	var userId = req.user.id;
	
	User.unFlagComment(userId, commentId, requestCallback(res));
});

module.exports = router;
