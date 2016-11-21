var mongoose = require("mongoose");
var Class = require("./class.js");
var Post = require("./post.js");
var Comment = require("./comment.js");

var UserSchema = mongoose.Schema({
  student: {
	  type: mongoose.Schema.Types.ObjectId, 
	  ref: 'User', 
	  required: true 
  },
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

//TODO: implement upvote and flag methods after finding a better schema

/**
 * Get user by user's name
 * 
 * @param name {String} - name of the user
 * @param callback {function} - callback function
 * @return user object with specific name
 */
module.exports.getUserByName=function(name,callback){
	var query={name:name};
	User.findOne(query,callback);
}


/**
 * Get user by kerberos
 * 
 * @param kerberos {String} - kerberos of the user
 * @param callback {function} - callback function
 * @return user object with specific kerberos
 */
module.exports.getUserByUsername=function(kerberos,callback){
	var query={kerberos:kerberos};
	User.findOne(query,callback);	
}

/**
 * Get user by id
 * 
 * @param id {Object} - id of the user
 * @param callback {function} - callback function
 * @return user object with specific user id
 */
module.exports.getUserById=function(id,callback){
	User.findById(id,callback);
}


/**
 * Get classes student has taken
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
module.exports.getClassesTakenByStudent=function(student,callback){
	var query={student:student};
	User
		.find(query,callback)
		.populate('classesTaken');
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
module.exports.updateClassesTakenList = function (classId, userId, action, callback) {
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
module.exports.getClassesEnrolledByStudent=function(student,callback){
	var query={student:student};
	User
		.find(query,callback)
		.populate('classesEnrolled');
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
module.exports.updateClassesEnrolledList = function (classId, userId, action, callback) {
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