// Lead author: Danny/Joanna
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var User = require("./user");
var Post = require("./post");

var ClassSchema = mongoose.Schema({
      name:         {type:String, index:true, required:true, unique: true},
      termCode:		{type:String},
      title:	    {type:String},      
      students:     [{type: ObjectId, ref: 'User'}],
      posts:        [{type: ObjectId, ref: 'Post'}]
});
/*
var ClassSchema = mongoose.Schema({
    name:         {type:String, index:true, required:true, unique: true},
    students:     [{type: ObjectId, ref: 'User'}],
    posts:        [{type: ObjectId, ref: 'Post'}],
    termCode:		{type:String},
    title:	    	{type:String},
    academicYear:	{type:String},
    title:			{type:String},
    cluster:		{type:String},
    prerequisites:	{type:String},
    units:			{type:String},
    optional:		{type:String},
    description:	{type:String},
    instructors:	{type:String}
});
*/
ClassSchema.virtual('studentListing').get(function() {
    // Make sure students is populated
    return this.students.map(s => s.name + " (" + s.username + ")").join(", ")
})

/**
 * Gets a specific class by name
 * 
 * @param name {string} - The name of the class (case insensitive)
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClass = function(name, callback) {
	var regex = new RegExp(["^", name, "$"].join(""), "i");
    Class.findOne({"name": regex}, callback).populate('students');
}

/**
 * Gets all classes, sorted by name
 * 
 * @param classIds {Array[ObjectId]} - array of class ObjectIds
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClasses = function(classIds, callback) {
	var query={_id:{$in:classIds}}
    Class
    	.find(query, callback)
    	.sort({name: 'asc' })
		.populate('students')
		.populate('posts');
}

/**
 * Gets all classes, sorted by name
 * 
 * @param classNames {Array[String]} - array of class names
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClassesByNames = function(classNames, callback) {
	var query={name:{$in:classNames}}
    Class
    	.find(query, callback)
    	.sort({name: 'asc' });
}

/**
 * Gets a specific class's name by id
 * 
 * @param id {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClassById = function(id, callback) {
    Class.findOne({"_id": id}, callback);
}

/**
 * Gets a specific class's name by post id
 * 
 * @param id {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
ClassSchema.statics.getClassByPostId = function(postId, callback) {
    Class.findOne({posts: postId}, callback);
}

/**
 * Gets list of all class names
 * @param callback {function} - callback function
 */
 ClassSchema.statics.getAllClassesNames = function(callback) {
    Class.find({}, function(err, results){
        if (err) {
            callback(err);
        } else {
            var classNames = results.map(function(x){return x.name});
            callback(classNames);
        }
    });
 }
 
 /**
  * Gets list of all classes
  * @param callback {function} - callback function
  */
  ClassSchema.statics.getAllClasses = function(callback) {
     Class.find({}, function(err, classes){
         if (err) {
             callback(err);
         } else {
             callback(classes);
         }
     });
  }

/**
 * Get all students of a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getStudents = function(classId, callback) {
    Class.findOne({"_id": classId})
        .populate("students")
        .exec(function(err, results) {
            if (err)    callback(err);
            else        callback(results);
        });
}

/**
 * Get all posts of a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getPosts = function(classId, callback) {
    Class.findOne({"_id": classId})
        //.populate('posts')
        .populate({
        	path: 'posts',
        	model: 'Post',
        	populate: {
        		path: 'author',
        		model: 'User'
        	}
        })
        .exec(callback);
}

/**
 * Get all posts
 * 
 * @param callback {function} - callback function
 * @return all posts collections
 */
ClassSchema.statics.getAllPosts=function(callback){
	Class
		.find(callback)
		.sort({dateCreated: 'desc' })
		.populate('posts');
}

/**
 * Get all posts of a class, sorted by upvotes
 * 
 * @param classId {ObjectId} - The id of the class
 * @param callback {function} - callback function
 */
ClassSchema.statics.getPostsSortedByUpvotes = function(classId, callback) {
    Class.findOne({"_id": classId})
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
    Class.update(
        {"_id": classId},
        {$addToSet: {"posts": postId}},
        callback);
}

/**
 * Add a student to an enrolled class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.addEnrolledStudent = function(classId, userId, callback) {
	Class.addStudent(classId, userId, function(err, _class){
		if (err){
			callback(err);
		}else{
			User.addEnrolledClass(userId, classId, callback);
		}
	})
}

/**
 * Add a student to a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.addStudent = function(classId, userId, callback) {
    Class.update(
        {"_id": classId},
        {$addToSet: {"students": userId}},
        callback);
}

/**
 * Removes a student from a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.removeStudent = function(classId,userId, callback) {
	var studentIds=[];
	studentIds.push(userId);
    Class.update(
        {"_id": classId},
        {$pullAll: {"students": studentIds}},
        callback);
}

/**
 * Remove a student from a class
 * 
 * @param classId {ObjectId} - The id of the class
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
ClassSchema.statics.removeStudent = function(classId, userId, callback) {
    Class.update(
        {"_id": classId},
        {$pull: {"students": userId}},
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
    Class.create({"name": name}, callback);
}

/**
 * Insert a course
 * 
 * @param course {Object} - course object
 * @param callback {function} - callback function
 */
ClassSchema.statics.insertCourse = function(course, callback) {
	Class.create({name:course.name,termCode:course.termCode,title:course.title,students:[],posts:[]}, callback);
}

/**
 * Update a course's title
 * 
 * @param course {Object} - course object
 * @param callback {function} - callback function
 */
ClassSchema.statics.updateCourse = function(course, clalback){
	Class.update({name:course.name}, {$set:{title:course.title}});
}

/**
 * Remove a post
 * 
 * @param postId {ObjectId} - Id of post
 * @param callback {function} - callback function
 */
ClassSchema.statics.removePost = function(postId, callback) {
    Class.update({posts: postId}, {$pull: {posts: postId}}, callback)
}

var Class = mongoose.model("Class", ClassSchema);
module.exports = Class;