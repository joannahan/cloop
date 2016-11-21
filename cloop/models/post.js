var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var PostSchema = mongoose.Schema({
    author: {type: ObjectId, ref:"User"},
    text: String,
    resource: {type: String, default: null},
    comments: [{type: ObjectId, ref:"Comment"}],
    timeCreated: {type: Date, default: Date.now},
    timeEdited: {type: Date, default: null},
    removed: {type: Boolean, default: false},
    numUpvotes: {type: Number, default: 0},
    numFlags: {type: Number, default: 0}
});

PostSchema.statics.getPost = function(postId, callback) {
    var that = this;
    that.findOne({"_id": postId}, callback);
}

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

PostSchema.statics.editPost = function(postId, text, callback) {
    var that = this;
    that.update({"_id": postId}, {"$set": {"text": text, "timeEdited": Date.now}}, callback);
}

PostSchema.statics.removePost = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$set": {"removed": true}}, callback);
}

PostSchema.statics.addUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numUpvotes": 1}}, callback)
}

PostSchema.statics.unUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$dec": {"numUpvotes": 1}}, callback)
}

PostSchema.statics.addFlag = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numFlags": 1}}, callback)
}

PostSchema.statics.createPost = function(authorId, text, callback) {
    var that = this;
    that.create({"author": authorId, "text": text}, callback);
}

var PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;