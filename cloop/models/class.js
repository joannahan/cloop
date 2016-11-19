var mongoose = require("mongoose");
var User = require("./user.js");

var ClassSchema = mongoose.Schema({
	  name:{
		  type:String,
		  index:true,
		  required:true
	  },
	  students:[{
		  type: mongoose.Schema.Types.ObjectId, 
		  ref: 'User'
	  }]
	});

var Class = module.exports = mongoose.model("Class", ClassSchema);

//TODO: methods

