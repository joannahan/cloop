// Lead author: Manuel
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
        else {
            Post.update({comments: commentId}, {$pull: {comments: commentId}}, function(err) {
                if (err)    callback(err)
                else        Comment.remove({"_id": commentId}, callback)
            })
        }
    });
}

/**
 * Removes all comments
 * 
 * @param commentIds {Array[ObjectId]} - an array of ObjectIds of all comments
 * @param callback {function} - callback function
 */
CommentSchema.statics.removeAllComments = function(commentIds, callback) {
    Comment.remove({"_id": {$in : commentIds}}, callback)
};

/**
 * Toggle a user's upvote
 * 
 * @param commentId {ObjectId} - id of a comment
 * @param userId {ObjectId} - id of a user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userToggleUpvote = function(commentId, userId, callback) {
    Comment.findOne({"_id": commentId}, function(err, comment) {
        if (comment == null || err)
            callback(err)
        else {
            if (comment.upvoteUsers.indexOf(userId) >= 0)
                Comment.update({"_id": commentId}, {$pull: {"upvoteUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.upvoteCount = comment.upvoteCount - 1
                        callback(err, result)
                    }
                })
            else
                Comment.update({"_id": commentId}, {$addToSet: {"upvoteUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.upvoteCount = comment.upvoteCount + 1
                        callback(err, result)
                    }
                })
        }
    })
};

/**
 * Add a user to a comments' set of users who have upvoted the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUpvote = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$addToSet: {"upvoteUsers": userId}}, callback)
};

/**
 * Remove a user from a comments's set of users who have upvoted the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUnupvote = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$pull: {"upvoteUsers": userId}}, callback)   
};

CommentSchema.virtual('upvoteCount').get(function() {
    return this.upvoteUsers.length;    
})

/**
 * Toggle a user's flag
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userToggleFlag = function(commentId, userId, callback) {
    Comment.findOne({"_id": commentId}, function(err, comment) {
        if (comment == null || err)
            callback(err)
        else {
            if (comment.flagUsers.indexOf(userId) >= 0)
                Comment.update({"_id": commentId}, {$pull: {"flagUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.flagCount = comment.flagCount - 1
                        callback(err, result)
                    }
                })
            else
                Comment.update({"_id": commentId}, {$addToSet: {"flagUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.flagCount = comment.flagCount + 1
                        callback(err, result)
                    }
                })
        }
    })
};

/**
 * Add a user to a comments's set of users who have flagged the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userFlag = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$addToSet: {"flagUsers": userId}}, callback)
};

/**
 * Remove a user from a comments's set of users who have flagged the comment
 * 
 * @param commentId {ObjectId} - The id of the comment
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
CommentSchema.statics.userUnflag = function(commentId, userId, callback) {
    Comment.update({"_id": commentId}, {$pull: {"flagUsers": userId}}, callback)
};

CommentSchema.virtual('flagCount').get(function() {
    return this.flagUsers.length;    
})

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;