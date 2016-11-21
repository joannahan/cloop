var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Class = require('../models/class');
var Post = require('../models/post');
var Comment = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.send('Class Page');
	res.render('class_page');
});

//get class page
router.get('/:name', function(req, res, next) {
	  res.render('class_page', { title: 'This is the blah blah class page'});
});

//Search class by name
router.get('/search/:name', function(req, res, next) {
	
});

module.exports = router;
