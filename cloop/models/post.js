// Lead author: Danny
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

// var Comment = require("./comment");

var PostSchema = mongoose.Schema({
    author: {type: ObjectId, ref:"User"},
    text: String,
    resource: {type: String, default: null},
    comments: [{type: ObjectId, ref:"Comment"}],
    timeCreated: {type: Date, default: Date.now},
    timeEdited: {type: Date, default: null},
    numUpvotes: {type: Number, default: 0},
    numFlags: {type: Number, default: 0}
});

/**
 * Gets a specific post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.getPost = function(postId, callback) {
    var that = this;
    that.findOne({"_id": postId}, callback);
}

/**
 * Gets all comments of a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.getComments = function(postId, callback) {
    var that = this;
    that
        .findOne({"_id": postId})
        .populate("comments")
        .exec(function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(results);
            }
        });
}

/**
 * Adds a comment to a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
PostSchema.statics.addComment = function(postId, commentId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$push": {"comments": commentId}}, callback);
}

/**
 * Edits a post with new text, and updates time edited
 * 
 * @param postId {ObjectId} - The id of the post
 * @param text {string} - The new text for the post
 * @param callback {function} - callback function
 */
PostSchema.statics.editPost = function(postId, text, callback) {
    var that = this;
    that.update({"_id": postId}, {"$set": {"text": text, "timeEdited": Date.now}}, callback);
}

/**
 * Removes a post and all its associated comments
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.removePost = function(postId, callback) {
    var that = this;
    that.remove({"_id": postId}, callback);
        // if (err) {
        //     callback(err);
        // } else {
        //     Comment.remove({"_id": {"$in": result.comments}}, function(err, result) {
        //         if (err) {
        //             callback(err);
        //         } else {
        //             that.remove({"_id": postId}, callback);
        //         }
        //     });    
        // }
}

/**
 * Add an upvote to a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.addUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numUpvotes": 1}}, callback)
}

/**
 * Remove an upvote from a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.unUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$dec": {"numUpvotes": 1}}, callback)
}

/**
 * Add a flag to a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.addFlag = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numFlags": 1}}, callback)
}

/**
 * Remove a flag from a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.unFlag = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$dec": {"numFlags": 1}}, callback)
}

/**
 * Creates a new post for a class
 * 
 * @param authorId {ObjectId} - The id of the author
 * @param text {string} - The text of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.createPost = function(authorId, text, callback) {
    var that = this;
    that.create({"author": authorId, "text": text}, callback);
}

var PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;