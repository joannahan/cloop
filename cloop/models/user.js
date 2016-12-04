// Lead author: Joanna
var mongoose = require("mongoose");
var Post = require("./post.js");
var Comment = require("./comment.js");
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  username:   {type:String,  required:true, unique:true, index:true},
  password:   {type:String,  required:true},
  hashed:     {type:Boolean, required:true},
  name:       {type:String,  required:true},
  email:      {type:String,  required:true, unique: true},
  
  classesTaken:     [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}], 
  classesEnrolled:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],

  verificationString: type:String,
  verifiedEmail: {type:Boolean, default:false}
});

UserSchema.pre('save', function(next) {
  var user = this
  if (user.hashed) return next()

  bcrypt.genSalt(function(err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
          user.password = hash;
          user.hashed = true;
          next()
      });
  });
})

/**
 * Compare user password to hashed password
 * 
 * @param candidatePassword {String} - user's password
 * @param hash {String} - hash string
 * @param callback {function} - callback function
 * @return success or error
 */
UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err,isMatch) {
   callback(err,isMatch);
  });
}

/**
 * Get user by user's name
 * 
 * @param name {String} - name of the user
 * @param callback {function} - callback function
 * @return user object with specific name
 */
UserSchema.statics.getUserByName = function(name,callback) {
	User.findOne({name:name},callback);
}


/**
 * Get user by username
 * 
 * @param kerberos {String} - username of the user
 * @param callback {function} - callback function
 * @return user object with specific username
 */
UserSchema.statics.getUserByUsername = function(username,callback) {
	User.findOne({username:username},callback);	
}

/**
 * Get user by id
 * 
 * @param id {Object} - id of the user
 * @param callback {function} - callback function
 * @return user object with specific user id
 */
UserSchema.statics.getUserById = function(id,callback) {
	User.findById(id,callback);
}

/**
 * Get classes student has taken
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
UserSchema.statics.getClassesTakenByStudent = function(student,callback) {
	User.findOne({_id: student.id}, function(err, studentFound){
    var classIds = [];
    for (var i = 0; i < studentFound.classesEnrolled.length; i++){
      classIds.push(studentFound.classesEnrolled[i]);
    }
    callback(classIds);
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
  User.findOne({_id:userId}, function (err, user) {
      if (err || user == null){
      	return callback(err, user);
      }     	
      var classesTaken = user.classesTaken;
      addOrRemoveFromList(classesTaken, classId, action);
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
UserSchema.statics.getClassesEnrolledByStudent = function(studentToFind,callback) {
  User.findOne({_id: studentToFind.id}, function(err, studentFound){
    var classIds = [];
    for (var i = 0; i < studentFound.classesEnrolled.length; i++){
      classIds.push(studentFound.classesEnrolled[i]);

    }
    callback(classIds);
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
 * Adds a class to a user's enrolled classes 
 *
 * @param userId {ObjectId} - the user's id
 * @param classId {ObjectId} - the class's id
 * @param callback {function} - callback function
 */
UserSchema.statics.addClass = function(userId, classId, callback) {
  User.update({"_id": userId}, {"$push": {"classesEnrolled": classId}}, callback);
}

/**
 * Removes a class from a user's enrolled classes 
 *
 * @param userId {ObjectId} - the user's id
 * @param classId {ObjectId} - the class's id
 * @param callback {function} - callback function
 */
UserSchema.statics.removeClass = function(userId, classId, callback) {
  User.update({"_id": userId}, {$pull: {"classesEnrolled": classId}}, callback);
}

/**
 * Checks if user has taken a class
 * 
 * @param user {Object} - logged in user object
 * @param classId {ObjectId} - class id
 * @return true or false
 */
UserSchema.statics.hasTakenAlready = function (user, classId) {
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
UserSchema.statics.isEnrolledIn = function (user, classId) {
    var index = user.classesEnrolled.indexOf(classId);
    return index > -1;
}

UserSchema.statics.verifyAccount = function(userId, verificationString, callback) {
    User.findOne({_id: userId}, function(err, result) {
      if (err) {
        callback(err);
      } else {
        if (result.verificationString === verificationString) {
          User.update({_id: userId}, {verifiedEmail: true}, callback)
        } else {
          callback("Verification Error");
        }
      }
    });
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
    if (action ==='add') {
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

var User = mongoose.model("User", UserSchema);
module.exports = User;