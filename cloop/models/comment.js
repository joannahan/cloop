// Lead author: Danny
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Post = require("./post");

var CommentSchema = mongoose.Schema({
    text:           {type: String, required: true},
    author:         {type: ObjectId, ref:"User"},
    timeCreated:    {type: Date, default: Date.now},
    timeEdited:     {type: Date, default: null},
    
    upvoteUsers:    [{type: ObjectId, ref: "User"}],
    flagUsers:      [{type: ObjectId, ref: "User"}]
});

/**
 * Gets a specific comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.getComment = function(commentId, callback) {
    var that = this;
    that.findOne({"_id": commentId}, callback);
}

/**
 * Edits a comment with new text, and updates time edited
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param text {string} - The new text for the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.editComment = function(commentId, text, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$set": {"text": text, "timeEdited": Date.now}}, callback);
}

/**
 * Removes a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.removeComment = function(commentId, callback) {
    var that = this;
    that.findOne({"_id": commentId}, function(err, result) {
        if (err) {
            callback(err);
        } else {
            that.remove({"_id": commentId}, callback);
        }
    });
}

/**
 * Add an upvote to a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.addUpvote = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$inc": {"numUpvotes": 1}}, callback)
}

/**
 * Remove an upvote from a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.unUpvote = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$dec": {"numUpvotes": 1}}, callback)
}

/**
 * Add a flag to a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.addFlag = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$inc": {"numFlags": 1}}, callback)
}

/**
 * Remove a flag from a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.unFlag = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$dec": {"numFlags": 1}}, callback)
}

/**
 * Creates a new comment for a post
 * 
 * @param authorId {ObjectId} - The author of the comment
 * @param posttId {ObjectId} - The id of the post
 * @param text {string} - The text of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.createComment = function(authorId, postId, text, callback) {
    var that = this;
    that.create({"author": authorId, "text": text}, function(err, result) {
        if (err) {
            callback(err);
        } else {
            var commentId = result._id;
            Post.addComment(postId, commentId, callback);
        }
    });
}

var CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;