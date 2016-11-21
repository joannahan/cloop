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

ClassSchema.statics.returnStudents = function(classId, callback) {
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

ClassSchema.statics.returnPosts = function(classId, callback) {
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

ClassSchema.statics.returnSortedByUpvotes = function(classId, callback) {
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

ClassSchema.statics.addPost = function(classId, postId, callback) {
    var that = this;
    that.update({
        {"_id": classId},
        {"$push": {"posts": postId}},
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback;
            }
        }
    });
}

ClassSchema.statics.addStudent = function(classId, userId, callback) {
    var that = this;
    that.update({
        {"_id": classId},
        {"$push": {"students": userId}},
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback;
            }
        }
    });
}

ClassSchema.statics.removeStudent = function(classId, userId, callback) {
    var that = this;
    that.update({
        {"_id": classId},
        {"$pull": {"students": userId}},
        function(err) {
            if (err) {
                callback(err);
            } else {
                callback;
            }
        }
    });
}

ClassSchema.statics.removeStudent = function(classId, callback) {
    var that = this;
    that.findOne({"_id": classId}, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });
}

ClassSchema.statics.createClass = function(name, callback) {
    var that = this;
    that.create({"name": name}, callback);
}

var Class = module.exports = mongoose.model("Class", ClassSchema);

//TODO: methods

