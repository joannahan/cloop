// Lead author: Joanna
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

var Post = require("./post.js");
var Comment = require("./comment.js");

var UserSchema = mongoose.Schema({
  username:   {type:String,  required:true, unique:true, index:true},
  password:   {type:String,  required:true},
  hashed:     {type:Boolean, default:false, required:true},
  name:       {type:String,  required:true},
  email:      {type:String,  required:true, unique: true},
  
  classesTaken:     [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}], 
  classesEnrolled:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],

  verificationString: {type:String},
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
 * @param callback {function} - callback function
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
    for (var i = 0; i < studentFound.classTaken.length; i++){
      classIds.push(studentFound.classTaken[i]);
    }
    callback(classIds);
  });
}

/**
 * Get classes student has taken
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
UserSchema.statics.getClassesTakenByStudentId = function(studentId,callback) {
	User.findOne({_id: studentId}, function(err, studentFound){
    var classIds = [];
    for (var i = 0; i < studentFound.classesEnrolled.length; i++){
      classIds.push(studentFound.classesEnrolled[i]);
    }
    callback(classIds);
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
 * Get classes student is currently enrolled in
 * 
 * @param student {Object} - Object Id of specific student
 * @param callback {function} - callback function
 * @return classes collections with specific student id
 */
UserSchema.statics.getClassesEnrolledByStudentId = function(studentId,callback) {
  User.findOne({_id: studentId}, function(err, studentFound){
	  callback(studentFound.classesEnrolled);
//    var classIds = [];
//    for (var i = 0; i < studentFound.classesEnrolled.length; i++){
//      classIds.push(studentFound.classesEnrolled[i]);
//    }
//    callback(classIds);
  });
}

/**
 * Move an enrolled class from classesEnrolled array to classesTaken array 
 * 
 * @param classId {ObjectId} - class id
 * @param userId {ObjectId} - user id
 * @param callback {function} - callback function
 */
UserSchema.statics.moveFromEnrolledClassToTakenClass= function (userId, classId, callback) {
	User.addTakenClass(userId, classId, function(err, user){
		if(err){
			callback(err);
		}else{
			console.log("user:"+user);
			User.removeEnrolledClass(userId, classId, function(err,user){
				return callback(err, user);
			});			
		}
	});  
}

UserSchema.statics.addEnrolledClass = function(userId, classId, callback) {
    User.update(
        {"_id": userId},
        {$addToSet: {"classesEnrolled": classId}},
        callback);
}

UserSchema.statics.removeEnrolledClass = function(userId, classId, callback) {
	var classIds=[];
	classIds.push(classId);
    User.update(
        {"_id": userId},
        {$pullAll: {"classesEnrolled": classIds}},
        callback);
}

UserSchema.statics.addTakenClass = function(userId, classId, callback) {
	User.update(
        {"_id": userId},
        {$addToSet: {"classesTaken": classId}},
        callback);
}

UserSchema.statics.removeTakenClass = function(userId, classId, callback) {
	var classIds=[];
	classIds.push(classId);
	User.update(
        {"_id": userId},
        {$pullAll: {"classesTaken": classIds}},
        callback);
}

UserSchema.statics.getAllClass = function(userId, classId, callback) {
	var classIds=[];
	classIds.push(classId);
	User.update(
        {"_id": userId},
        {$pullAll: {"classesTaken": classIds}},
        callback);
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

/**
 * Verifies a user's account, if the correct string for the user is given
 * 
 * @param userId {ObjectId} - the user's id
 * @param verificationString {string} - the code that the user typed
 * @param callback {function} - a callback function
 */
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


var User = mongoose.model("User", UserSchema);
module.exports = User;