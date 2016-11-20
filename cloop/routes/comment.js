var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Comment = require('../models/comment');

//Get all comments
router.get('/', function(req,res){
	res.send('commentcommentcommentcomment');
	res.render('comments', { title: 'Comments' });
});


//get all comments - json stringified
router.get('/getall', function(req, res, next) {
	
});

//create new comment
router.post('/comment', function(req, res, next) {

});

//delete comment
router.delete('/:id', function(req, res, next) {

});


module.exports = router;
