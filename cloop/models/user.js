var mongoose = require("mongoose");
var Class = require("./class.js");
var Post = require("./post.js");
var Comment = require("./comment.js");
var bcrypt=require('bcryptjs');

var UserSchema = mongoose.Schema({
// for MVP - username, password, and email b/c implementing login and register
  username: {
	  type:String,
	  index:true,
	  required:true
  },
  password:{
	  type:String,
	  required:true
  },
  email:{
	  type:String
  },
  student: {
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'User'
  },
  kerberos:{
	  type:String,
	  index:true
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

//TODO: implement upvote and flag methods after finding a better schema

/**
 * Create a user object
 * 
 * @param newUser {Object} - new User object
 * @param callback {function} - callback function
 * @return new user
 */
UserSchema.statics.createUser=function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password=hash;
	        newUser.save(callback);
	    });
	});	
}

/**
 * Compare user password to hashed password
 * 
 * @param candidatePassword {String} - user's password
 * @param hash {String} - hash string
 * @param callback {function} - callback function
 * @return success or error
 */
UserSchema.statics.comparePassword=function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}

/**
 * Get user by user's name
 * 
 * @param name {String} - name of the user
 * @param callback {function} - callback function
 * @return user object with specific name
 */
UserSchema.statics.getUserByName=function(name,callback){
	var query={name:name};
	User.findOne(query,callback);
}


/**
 * Get user by username
 * 
 * @param kerberos {String} - username of the user
 * @param callback {function} - callback function
 * @return user object with specific username
 */
UserSchema.statics.getUserByUsername=function(username,callback){
	var query={username:username};
	User.findOne(query,callback);	
}

/**
 * Get user by id
 * 
 * @param id {Object} - id of the user
 * @param callback {function} - callback function
 * @return user object with specific user id
 */
UserSchema.statics.getUserById=function(id,callback){
	User.findById(id,callback);
}


/**
 * Get classes student has taken
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
UserSchema.statics.getClassesTakenByStudent=function(student,callback){
	User.findOne({_id: student.id}, function(err, studentFound){
    studentFound.populate('classesTaken');
    var classNames = [];
    for (var i = 0; i < studentFound.classesEnrolled.length; i++)
      classNames.append(studentFound.classesEnrolled[i].name);
    
    callback(classNames);
  });
}

/**
 * Add or remove class from classesTaken array
 * 
 * @param classId {ObjectId} - class id
 * @param userId {ObjectId} - user id
 * @param action {String} - add or remove 
 * @param callback {function} - callback function
 * @return success or error
 */
UserSchema.statics.updateClassesTakenList = function (classId, userId, action, callback) {
	var query={_id:userId};
    User.findOne(query, function (err, user) {
        if (err || user == null){
        	return callback(err, user);
        }         	
        var classesTaken = user.classesTaken;
        addOrRemoveFromList(classesTaken, userId, action);
        user.save(function (err, user) {
            return callback(err, user);
        });
    });
}

/**
 * Get classes student is currently enrolled in
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
UserSchema.statics.getClassesEnrolledByStudent=function(studentToFind,callback){
  User.findOne({_id: studentToFind.id}, function(err, studentFound){
    studentFound.populate('classesEnrolled');
    var classNames = [];
    for (var i = 0; i < studentFound.classesEnrolled.length; i++){
      classNames.append(studentFound.classesEnrolled[i].name);
    }
    callback(classNames);
  });
}

/**
 * Add or remove class from classesEnrolled array
 * 
 * @param classId {ObjectId} - class id
 * @param userId {ObjectId} - user id
 * @param action {String} - add or remove 
 * @param callback {function} - callback function
 * @return success or error
 */
UserSchema.statics.updateClassesEnrolledList = function (classId, userId, action, callback) {
	var query={_id:userId};
    User.findOne(query, function (err, user) {
        if (err || user == null){
        	return callback(err, user);
        }         	
        var classesEnrolled = user.classesEnrolled;
        addOrRemoveFromList(classesEnrolled, userId, action);
        user.save(function (err, user) {
            return callback(err, user);
        });
    });
}

/**
 * Adds a post to the user's upvoted posts
 * 
 * @param userId {ObjectId} - the user's id
 * @param postId {ObjectId} - the post's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addUpvotePost = function(userId, postId, callback) {
  var that = this;
  that.update({"_id": userId}, {$push: {"upvotePost": postId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Post.addUpvote(postId, callback);
    }
  })
}

/**
 * Removes a post from the user's upvoted posts
 * 
 * @param userId {ObjectId} - the user's id
 * @param postId {ObjectId} - the post's id
 * @param callback {function} - callback function
 */
UserSchema.statics.unUpvotePost = function(userId, postId, callback) {
  var that = this;
  that.update({"_id": userId}, {$pull: {"upvotePost": postId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Post.unUpvote(postId, callback);
    }
  })
}

/**
 * Adds a post to the user's flagged posts
 * 
 * @param userId {ObjectId} - the user's id
 * @param postId {ObjectId} - the post's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addFlagPost = function(userId, postId, callback) {
  var that = this;
  that.update({"_id": userId}, {$push: {"flagPost": postId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Post.addFlag(postId, callback);
    }
  })
}

/**
 * Removes a post from the user's flagged posts
 * 
 * @param userId {ObjectId} - the user's id
 * @param postId {ObjectId} - the post's id
 * @param callback {function} - callback function
 */
UserSchema.statics.unFlagPost = function(userId, postId, callback) {
  var that = this;
  that.update({"_id": userId}, {$pull: {"flagPost": postId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Post.unFlag(postId, callback);
    }
  })
}

/**
 * Adds a comment to the user's upvoted comments
 * 
 * @param userId {ObjectId} - the user's id
 * @param commentId {ObjectId} - the comment's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addUpvoteComment = function(userId, commentId, callback) {
  var that = this;
  that.update({"_id": userId}, {$push: {"upvoteComment": commentId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Comment.addUpvote(commentId, callback);
    }
  })
}

/**
 * Removes a comment from the user's upvoted comments
 * 
 * @param userId {ObjectId} - the user's id
 * @param commentId {ObjectId} - the comment's id
 * @param callback {function} - callback function
 */
UserSchema.statics.unUpvoteComment = function(userId, commentId, callback) {
  var that = this;
  that.update({"_id": userId}, {$pull: {"upvoteComment": commentId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Comment.unUpvote(commentId, callback);
    }
  })
}

/**
 * Adds a comment to the user's flagged comments
 * 
 * @param userId {ObjectId} - the user's id
 * @param commentId {ObjectId} - the comment's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addFlagComment = function(userId, commentId, callback) {
  var that = this;
  that.update({"_id": userId}, {$push: {"flagComment": commentId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Comment.addFlag(commentId, callback);
    }
  })
}

/**
 * Removes a comment from the user's flagged comments
 * 
 * @param userId {ObjectId} - the user's id
 * @param commentId {ObjectId} - the comment's id
 * @param callback {function} - callback function
 */
UserSchema.statics.unFlagComment = function(userId, commentId, callback) {
  var that = this;
  that.update({"_id": userId}, {$pull: {"flagComment": commentId}}, function(err, result) {
    if (err) {
      callback(err);
    } else {
      Comment.unFlag(commentId, callback);
    }
  })
}

/**
 * Adds a class to a user's enrolled classes 
 *
 * @param userId {ObjectId} - the user's id
 * @param classId {ObjectId} - the class's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addClass = function(userId, classId, callback) {
  var that = this;
  that.update({"_id": userId}, {$push: {"classesEnrolled": classId}}, callback);
}

/**
 * Removes a class from a user's enrolled classes 
 *
 * @param userId {ObjectId} - the user's id
 * @param classId {ObjectId} - the class's id
 * @param callback {function} - callback function
 */
UserSchema.statics.removeClass = function(userId, classId, callback) {
  var that = this;
  that.update({"_id": userId}, {$pull: {"classesEnrolled": classId}}, callback);
}

/**
 * Checks if user has taken a class
 * 
 * @param user {Object} - logged in user object
 * @param classId {ObjectId} - class id
 * @return true or false
 */
UserSchema.methods.hasTakenAlready = function (user, classId) {
    var index = user.classesTaken.indexOf(classId);
    return index > -1;
}

/**
 * Checks if user is currently enrolled in a class
 * 
 * @param user {Object} - logged in user object
 * @param classId {ObjectId} - class id
 * @return true or false
 */
UserSchema.methods.isEnrolledIn = function (user, classId) {
    var index = user.classesEnrolled.indexOf(classId);
    return index > -1;
}

var User = mongoose.model("User", UserSchema);
module.exports = User;

/**
 * Generic Helper Function
 * Mutates list and adds or removes 1st instance of item in list (if present)
 * 
 * @param list {Array} - list of items
 * @param item {ObjectId} - id
 * @return updated list 
 */
var addOrRemoveFromList = function(list, item, action) {
    // add to list
    if (action==='add') {
        list.push(item);
    } else { 
        // remove from list
    	var index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
    }
    return list;
}