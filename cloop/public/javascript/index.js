// Lead author: Joanna
$(document).ready(function() { 
	console.log(Handlebars.templates);
	// var comm_template = Handlebars.templates['comment.hbs'];
	// var post_template = Handlebars.templates['post.hbs'];
	// var class_template = Handlebars.templates['class_page.hbs'];

	// //register partials
	// Handlebars.registerPartial("render_comment", comm_template);
	// Handlebars.registerPartial("render_post", post_template);
	// Allow Handlebars templates and partials
	//Handlebars.partials = Handlebars.templates;
	var $login=$('#login');
	
	// On document load, fetch class page.
    $.get('/group/getall', function(posts) {
	      if (posts.success) {
	    	  class_template({title:"test"});
		}
	});
    
	/*
	 * security protection:
	 * if login userid is empty in page, redirect user to login page
	 */
	if ($login && $login.data('userid')===''){
		window.location.href = "/users/login";
	}
	/*
	 * Custom Handlebars Function Helpers
	 * source: http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/ 
	 */
	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
	    if (arguments.length < 3)
	        throw new Error("Handlebars Helper equal needs 2 parameters");
	    if( lvalue!=rvalue ) {
	        return options.inverse(this);
	    } else {
	        return options.fn(this);
	    }
	});
	
	Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {	
	    if (arguments.length < 3)
	        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
	
	    var operator = options.hash.operator || "==";
	
	    var operators = {
	        '==':       function(l,r) { return l == r; },
	        '===':      function(l,r) { return l === r; },
	        '!=':       function(l,r) { return l != r; },
	        '<':        function(l,r) { return l < r; },
	        '>':        function(l,r) { return l > r; },
	        '<=':       function(l,r) { return l <= r; },
	        '>=':       function(l,r) { return l >= r; },
	        'typeof':   function(l,r) { return typeof l == r; }
	    }
	
	    if (!operators[operator])
	        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
	
	    var result = operators[operator](lvalue,rvalue);
	
	    if( result ) {
	        return options.fn(this);
	    } else {
	        return options.inverse(this);
	    }
	
	});	
});