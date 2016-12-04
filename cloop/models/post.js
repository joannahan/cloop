// Lead author: Danny
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var User = require("./user");
// var Comment = require("./comment");

var PostSchema = mongoose.Schema({
    text:           {type: String,                required: true},
    author:         {type: ObjectId, ref: "User", required: true},
    timeCreated:    {type: Date, default: Date.now},
    timeEdited:     {type: Date, default: null},
    
    comments:       [{type: ObjectId, ref:"Comment"}],
    upvoteUsers:    [{type: ObjectId, ref: "User"}],
    flagUsers:      [{type: ObjectId, ref: "User"}],
    
    resource:       {type: String, default: null}
});

/**
 * Creates a new post for a class
 * 
 * @param authorId {ObjectId} - The id of the author
 * @param text {string} - The text of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.createPost = function(authorId, text, callback) {
    Post.create({"author": authorId, "text": text}, callback);
}

/**
 * Gets a specific post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.getPost = function(postId, callback) {
    Post.findOne({"_id": postId}, callback);
}

/**
 * Edits a post with new text, and updates time edited
 * 
 * @param postId {ObjectId} - The id of the post
 * @param text {string} - The new text for the post
 * @param callback {function} - callback function
 */
PostSchema.statics.editPost = function(postId, text, callback) {
    Post.update({"_id": postId}, {$set: {"text": text, "timeEdited": Date.now}}, callback);
}

/**
 * Removes a post and all its associated comments
 * 
 * @param postId {ObjectId} - The id of the post
 * @param callback {function} - callback function
 */
PostSchema.statics.removePost = function(postId, callback) {
    Post.remove({"_id": postId}, callback);
        // if (err) {
        //     callback(err);
        // } else {
        //     Comment.remove({"_id": {$in: result.comments}}, function(err, result) {
        //         if (err) {
        //             callback(err);
        //         } else {
        //             that.remove({"_id": postId}, callback);
        //         }
        //     });    
        // }
}

/**
 * Adds a comment to a post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param commentId {ObjectId} - The id of the comment
 * @param callback {function} - callback function
 */
PostSchema.statics.addComment = function(postId, commentId, callback) {
    Post.update({"_id": postId}, {$addToSet: {"comments": commentId}}, callback);
}

/**
 * Gets all comments of an array of posts
 * 
 * @param postIds {Array[ObjectId]} - The ids of the posts
 * @param callback {function} - callback function
 */
PostSchema.statics.populateComments = function(postIds, callback) {
    Post.find({"_id": {$in: postIds}})
        //.populate("comments")
        .populate("author")
        .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .exec(callback);
}

/**
 * Add a user to a post's set of users who have upvoted the post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
PostSchema.statics.userUpvote = function(postId, userId, callback) {
    Post.update({"_id": postId}, {$addToSet: {"upvoteUsers": userId}}, callback)
}

/**
 * Remove a user from a post's set of users who have upvoted the post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
PostSchema.statics.userUnupvote = function(postId, userId, callback) {
    Post.update({"_id": postId}, {$pull: {"upvoteUsers": userId}}, callback)   
}

PostSchema.virtual('isUpvoteUser').get(function(userId) {
    return this.upvoteUsers.indexOf(userId) >= 0
})

PostSchema.virtual('upvoteCount').get(function() {
    return this.upvoteUsers.length;    
})

/**
 * Add a user to a post's set of users who have flagged the post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
PostSchema.statics.userFlag = function(postId, userId, callback) {
    Post.update({"_id": postId}, {$addToSet: {"flagUsers": userId}}, callback)
}

/**
 * Remove a user from a post's set of users who have flagged the post
 * 
 * @param postId {ObjectId} - The id of the post
 * @param userId {ObjectId} - The id of the user
 * @param callback {function} - callback function
 */
PostSchema.statics.userUnflag = function(postId, userId, callback) {
    Post.update({"_id": postId}, {$pull: {"flagUsers": userId}}, callback)
}

PostSchema.virtual('isFlagUser').get(function(userId) {
    return this.flagUsers.indexOf(userId) >= 0
})

PostSchema.virtual('flagCount').get(function() {
    return this.flagUsers.length;    
})

var Post = mongoose.model("Post", PostSchema);
module.exports = Post;