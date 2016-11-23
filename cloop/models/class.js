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
	  }],
	  posts:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post'
	  }]
	});

/**
 * Gets a specific class by name
 * 
 * @param name {string} - The name of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClass = function(name, callback) {
    var that = this;
    that.findOne({"name": name}, callback);
}

/**
 * Get all students of a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getStudents = function(classId, callback) {
    var that = this;
    that
        .findOne({"_id": classId})
        .populate("students")
        .exec(function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(results);
            }
        });
}

/**
 * Get all posts of a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getPosts = function(classId, callback) {
    var that = this;
    that
        .findOne({"_id": classId})
        .populate("posts")
        .exec(function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(results);
            }
        });
}

/**
 * Get all posts of a class, sorted by upvotes
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getPostsSortedByUpvotes = function(classId, callback) {
    var that = this;
    that
        .findOne({"_id": classId})
        .populate("posts")
        .exec(function(err, results) {
            if (err) {
                callback(err);
            } else {
                results.sort(function(a, b) {
                    return b.numUpvotes - a.numUpvotes;
                });

                callback(results);
            }
        });
}

/**
 * Add a post to a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
ClassSchema.statics.addPost = function(classId, postId, callback) {
    var that = this;
    that.update(
        {"_id": classId},
        {"$push": {"posts": postId}},
        callback);
}

/**
 * Add a student to a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.addStudent = function(classId, userId, callback) {
    var that = this;
    that.update(
        {"_id": classId},
        {"$push": {"students": userId}},
        function(err, result) {
            if (err) {
                callback(err);
            } else {
                User.addClass(userId, classId, callback);
            }
        });
}

/**
 * Remove a student from a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.removeStudent = function(classId, userId, callback) {
    var that = this;
    that.update(
        {"_id": classId},
        {"$pull": {"students": userId}},
        function(err, result) {
            if (err) {
                callback(err);
            } else {
                User.removeClass(userId, classId, callback);
            }
        });
}

/**
 * Creates a class
 * 
 * @param name {string} - The name of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.createClass = function(name, callback) {
    var that = this;
    that.create({"name": name}, callback);
}

var Class = module.exports = mongoose.model("Class", ClassSchema);