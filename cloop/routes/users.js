var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('This is the user page lmao');
  res.render('user_listing', { title: 'list of users in class' });
});

//Search users by name
router.get('/search/:name', function(req, res, next) {
	
});

//get all users
router.get('/getall', function(req, res, next) {
	
});

module.exports = router;
