// Lead author: Joanna
var express = require('express');
var router = express.Router();

var secret = require('../secret/secret');
var dropboxAccessToken = secret.dropboxAccessToken;
var Dropbox = require("dropbox");
var dbx = new Dropbox({accessToken: dropboxAccessToken});

var multer  = require('multer');
var upload = multer();

router.get('/upload', function(req, res) {
	res.render('upload', {title: "Upload stuff here"});
});

router.post('/upload', upload.single('resource'), function(req, res) {
	var resourceName = req.file.originalname;
	var resourceBuffer = req.file.buffer;
	var resourcePath = '/' + resourceName;

	console.log(req.file);

	dbx.filesUpload({path: resourcePath, contents: resourceBuffer})
	.then(function(response) {

	  dbx.sharingCreateSharedLink({path: resourcePath, short_url: true})
	  .then(function(response) {
	  	console.log(response);
	  })
	  .catch(function(error) {
	  	console.log("Sharing Error");
	  	console.log(error);
	  });

	})
	.catch(function(error) {
		console.log("Upload Error");
	  console.error(error);
	});
});

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', { title: 'Cloop - Homepage' });
});

/**
 * Ensure user is logged in
 * @param req - request
 * @param res - response
 * @param next - next function
 * @return success or redirect to /users/login
 */
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;


