// Lead author: Danny
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Post = require("./post");

var CommentSchema = mongoose.Schema({
    text:           {type: String, required: true},
    author:         {type: ObjectId, ref:"User", required: true},
    timeCreated:    {type: Date, default: Date.now},
    timeEdited:     {type: Date, default: null},
    
    upvoteUsers:    [{type: ObjectId, ref: "User"}],
    flagUsers:      [{type: ObjectId, ref: "User"}]
});

/**
 * Creates a new comment for a post
 * 
 * @param authorId {ObjectId} - The author of the comment
 * @param posttId {ObjectId} - The id of the post
 * @param text {string} - The text of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.createComment = function(authorId, postId, text, callback) {
    Comment.create({"author": authorId, "text": text}, function(err, comment) {
        if (err)    callback(err);
        else        Post.addComment(postId, comment._id, callback);
    });
}

/**
 * Gets a specific comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.getComment = function(commentId, callback) {
    Comment.findOne({"_id": commentId}, callback);
}

/**
 * Edits a comment with new text, and updates time edited
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param text {string} - The new text for the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.editComment = function(commentId, text, callback) {
    Comment.update({"_id": commentId}, {$set: {"text": text, "timeEdited": Date.now}}, callback);
}

/**
 * Removes a comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
CommentSchema.statics.removeComment = function(commentId, callback) {
    Comment.findOne({"_id": commentId}, function(err, result) {
        if (err)    callback(err);
        else        Comment.remove({"_id": commentId}, callback);
        // TODO: CONTINUE CHECKING ROUTING FOR REMOVE POST AND REMOVE COMMENT
    });
}

/**
 * Add a user to a comments's set of users who have upvoted the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUpvote = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$addToSet: {"upvoteUsers": userId}}, callback)
}

/**
 * Remove a user from a comments's set of users who have upvoted the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUnupvote = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$pull: {"upvoteUsers": userId}}, callback)   
}

CommentSchema.virtual('isUpvoteUser').get(function(userId) {
    return this.upvoteUsers.indexOf(userId) >= 0
})

CommentSchema.virtual('upvoteCount').get(function() {
    return this.upvoteUsers.length;    
})

/**
 * Add a user to a comments's set of users who have flagged the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userFlag = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$addToSet: {"flagUsers": userId}}, callback)
}

/**
 * Remove a user from a comments's set of users who have flagged the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUnflag = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$pull: {"flagUsers": userId}}, callback)
}

CommentSchema.virtual('isFlagUser').get(function(userId) {
    return this.flagUsers.indexOf(userId) >= 0
})

CommentSchema.virtual('flagCount').get(function() {
    return this.flagUsers.length;    
})

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;