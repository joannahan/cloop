// Lead author: Danny
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment')
var Class = require('../models/class');

var secret = require('../secret/secret');
var Dropbox = require("dropbox");
var dropboxAccessToken = secret.dropboxAccessToken;
var dbx = new Dropbox({accessToken: dropboxAccessToken});

var multer  = require('multer');
var upload = multer();

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
router.post('/:classId/post', upload.single("resource"), function(req, res, next) {
	var postText = req.body.postText;
	var authorId = req.user.id;
	var classId = req.params.classId;
	var resourceUrl = null;

	if (req.file) {
		var resourceName = req.file.originalname;
		var resourceBuffer = req.file.buffer;
		var resourcePath = '/' + authorId + '/' + resourceName;

		var resourcePathLength = resourcePath.length;
		var pdfValidation = ".pdf";
		var pdfValidationLength = pdfValidation.length;

		if (!(resourcePath.slice(resourcePathLength - pdfValidationLength) === pdfValidation)) {
			res.send("Not a valid pdf");
		} else {
			dbx.filesUpload({path: resourcePath, contents: resourceBuffer, autorename: true})
				.then(function(response) {
					resourcePath = response.path_display;

					dbx.sharingCreateSharedLink({path: resourcePath, short_url: true})
					.then(function(response) {
				  		resourceUrl = response.url;

				  		Post.createPost(authorId, postText, resourceUrl, function(err, post) {
							if (err) {
								res.send(err);
							} else {
								var postId = post._id;
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

					})
				  	.catch(function(error) {
				  		res.send(error);
				  	});

				})
				.catch(function(error) {
				  	res.send(error);
				});
		}
	} else {
		Post.createPost(authorId, postText, resourceUrl, function(err, post) {
			if (err) {
				res.send(err);
			} else {
				var postId = post._id;
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
	}
});


//delete post
router.delete('/:_id', function(req, res, next) {
	var postId = req.params._id;
	var userId = req.user.id;

	Post.getPost(postId, function(err, post) {
		if (err)	res.send(err);
		else {
			if (post.author == userId)
				Comment.removeAllComments(post.comments, function(err, result) {
					if (err)			res.send(err);
					else
						Post.removePost(postId, function(err, result) {
							if (err) 	res.send(err);
							else
								Class.removePost(postId, function(err, result) {
									if (err)	res.send(err)
									else		res.send({remove: true})
								});
						});
				})
			else
				res.send("Wrong user!");
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
			if (result.author == userId) {
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