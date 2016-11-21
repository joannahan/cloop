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

});

//delete post
router.delete('/:id', function(req, res, next) {

});

module.exports = router;
