// Lead author: Danny
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');
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


//Get all posts
router.get('/', function(req,res){
	res.render('posts');
});

////get all posts - json stringified
//router.get('/getall', function(req, res, next) {
//	
//});

var debug = 1;
//create new post
router.post('/:classId/post', function(req, res, next) {
	var postText = req.body.postText;
	var authorId = req.user.id;
	var classId = req.params.classId;

	Post.createPost(authorId, postText, function(err, post) {
		if (err) {
			console.log(err);
		} else {
			//console.log("post" + post);
			var postId = post._id;
			//console.log("postId" + postId);
			Class.addPost(classId, postId, function(err, result){
				if (err){
					if (debug===1) console.log("classId.err"+err);
					res.send(err);
				} else {
					Class.getClassById(classId, requestCallback2(res));
				}
			});

		}
	});
});


//delete post
router.delete('/:_id', function(req, res, next) {
	var postId = req.params._id;
	var userId = req.user.id;
	console.log("poop:" + postId);
	Post.getPost(postId, function(err, result) {
		if (err) {
			console.log("ERROR"+err);
			res.send(err);
		} else {
			console.log("RESULTAUTHOR: "+ result.author + "USERID: " + userId);
			if (result.author == userId) {
				//Post.removePost(postId, requestCallback(res));
				Post.removePost(postId, function(err, result) {
					res.json({
						success:true,
						remove:true,
						message: ""
					})
				});
			} else {
				//res.send("Wrong user!");
				console.log("WRONG PERSON");
				res.json({
					success:true,
					remove:false,
					message: "Wrong user!"
				});
			}
		}
	});
});

//edit post
router.put('/edit/:_id', function(req, res, next) {
	var postId = req.params._id;
	var newText = req.body.newText;
	var userId = req.user.id;
	
	Post.getPost(postId, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			if (result.author === userId) {
				Post.editPost(postId, newText, requestCallback(res));
			} else {
				res.send("Wrong user!");
			}
		}
	});
});

//upvote post
router.post('/upvote', function(req, res, next) {
	var postId = req.body.postId;
	var userId = req.user.id;
	
	Post.userUpvote(postId, userId, requestCallback(res));
});

//unupvote post
router.post('/unupvote', function(req, res, next) {
	var postId = req.body.postId;
	var userId = req.user.id;
	
	Post.userUnupvote(postId, userId, requestCallback(res));
});

//flag post
router.post('/flag', function(req, res, next) {
	var postId = req.body.postId;
	var userId = req.user.id;
	
	Post.userFlag(postId, userId, requestCallback(res));
});

//unflag post
router.post('/unflag', function(req, res, next) {
	var postId = req.body.postId;
	var userId = req.user.id;
	
	Post.userUnflag(postId, userId, requestCallback(res));
});

module.exports = router;