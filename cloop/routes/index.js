// Lead author: Joanna
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
