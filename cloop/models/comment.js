var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = mongoose.Schema({
    author: {type: ObjectId, ref:"User"},
    text: String,
    timeCreated: {type: Date, default: Date.now},
    timeEdited: {type: Date, default: null},
    removed: {type: Boolean, default: false},
    numUpvotes: {type: Number, default: 0},
    numFlags: {type: Number, default: 0}
});

/**
 * Gets a specific comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.getComment = function(commentId, callback) {
    var that = this;
    that.findOne({"_id": commentId}, callback);
}

/**
 * Edits a comment with new text, and updates time edited
 * 
 * @param commentId {int} - The id of the comment
 * @param text {string} - The new text for the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.editComment = function(commentId, text, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$set": {"text": text, "timeEdited": Date.now}}, callback);
}

/**
 * Sets the status of a comment to "removed"
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.removeComment = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$set": {"removed": true}}, callback);
}

/**
 * Add an upvote to a comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.addUpvote = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$inc": {"numUpvotes": 1}}, callback)
}

/**
 * Remove an upvote from a comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.unUpvote = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$dec": {"numUpvotes": 1}}, callback)
}

/**
 * Add a flag to a comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.addFlag = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$inc": {"numFlags": 1}}, callback)
}

/**
 * Remove a flag from a comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.unFlag = function(commentId, callback) {
    var that = this;
    that.update({"_id": commentId}, {"$dec": {"numFlags": 1}}, callback)
}

/**
 * Remove a flag from a comment
 * 
 * @param commentId {int} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.createComment = function(authorId, text, callback) {
    var that = this;
    that.create({"author": authorId, "text": text}, callback);
}

var CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;