$(document).ready(function() { 
	// Allow Handlebars templates and partials
	Handlebars.partials = Handlebars.templates;
	
	
	
	
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