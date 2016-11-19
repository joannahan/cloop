var mongoose = require("mongoose");
var Class = require("./class.js");
var Post = require("./post.js");
var Comment = require("./comment.js");

var UserSchema = mongoose.Schema({
  kerberos:{
	  type:String,
	  index:true,
	  required:true
  },
  name:{
	  type:String
  },
  classesTaken:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Class'
  }], 
  classesEnrolled:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Class'
  }], 
  //TODO: find a better way to do this vvvvvvv
  upvotePost:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Post'
  }],
  upvoteComment:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Comment'
  }],
  flagPost:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Post'
  }], 
  flagComment:[{
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'Comment'
  }], 
  flaggedRemovals:{
	  type:Number,
	  default: 0
  }
});

var User = module.exports = mongoose.model("User", UserSchema);

//TODO: methods