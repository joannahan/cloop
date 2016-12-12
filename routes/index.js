// Lead author: Joanna
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('user_page');
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
		res.redirect('/group');
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;


