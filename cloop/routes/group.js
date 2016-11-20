var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Class = require('../models/class');
var Post = require('../models/post');
var Comment = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send('Class Page');
	res.render('index', { title: 'Cloop' });
});

//get class page
router.get('/group', function(req, res, next) {
	  res.render('class_page');
	});

//Search class by name
router.get('/search/:name', function(req, res, next) {
	
});

//Create posts
router.post('/', function(req,res){
	res.render('posts');
});

//Create comments
router.post('/', function(req,res){
	res.render('comments');
});

module.exports = router;
