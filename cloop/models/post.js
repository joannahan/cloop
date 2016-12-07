// Lead author: Manuel
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

// MAJOR BUG: Interdependency (ex. Post <-> Comment) creates empty require() - implement interdependency in routing, not model
//var Comment = require("./comment");       (Interdependency: Post <-> Comment)     (Current Allowed: Post <- Comment)
//var Class = require("./class");           (Interdependency: Class <-> Post)

var PostSchema = mongoose.Schema({
    text:           {type: String,                required: true},
    author:         {type: ObjectId, ref: "User", required: true},
    timeCreated:    {type: Date, default: Date.now},
    timeEdited:     {type: Date, default: null},
    
    comments:       [{type: ObjectId, ref:"Comment"}],
    upvoteUsers:    [{type: ObjectId, ref: "User"}],
    flagUsers:      [{type: ObjectId, ref: "User"}],
    
    resourceUrl:    String
});

/**
 * Creates a new post for a class
 * 
 * @param authorId {ObjectId} - The id of the author
 * @param text {string} - The text of the post
 * @param resourceUrl {string} - The Url (if any) of the post's resource
 * @param callback {function} - callback function
 */
PostSchema.statics.createPost = function(authorId, text, resourceUrl, callback) {
    Post.create({"author": authorId, "text": text, "resourceUrl": resourceUrl}, callback);
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
    Post.remove({"_id": postId}, callback)
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

PostSchema.statics.userToggleUpvote = function(postId, userId, callback) {
    Post.findOne({"_id": postId}, function(err, post) {
        if (post == null || err)
            callback(err)
        else {
            if (post.upvoteUsers.indexOf(userId) >= 0)
                Post.update({"_id": postId}, {$pull: {"upvoteUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.upvoteCount = post.upvoteCount - 1
                        callback(err, result)
                    }
                })
            else
                Post.update({"_id": postId}, {$addToSet: {"upvoteUsers": userId}}, function(err, result) {
                    if (err)    callback(err)
                    else {
                        result.upvoteCount = post.upvoteCount + 1
                        callback(err, result)
                    }
                })
        }
    })
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
       
}

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

PostSchema.virtual('flagCount').get(function() {
    return this.flagUsers.length;    
})

var Post = mongoose.model("Post", PostSchema);
module.exports = Post;