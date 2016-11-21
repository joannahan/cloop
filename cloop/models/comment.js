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

CommentSchema.statics.getPost = function(postId, callback) {
    var that = this;
    that.findOne({"_id": postId}, callback);
}

CommentSchema.statics.editPost = function(postId, text, callback) {
    var that = this;
    that.update({"_id": postId}, {"$set": {"text": text, "timeEdited": Date.now}}, callback);
}

CommentSchema.statics.removePost = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$set": {"removed": true}}, callback);
}

CommentSchema.statics.addUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numUpvotes": 1}}, callback)
}

CommentSchema.statics.unUpvote = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$dec": {"numUpvotes": 1}}, callback)
}

CommentSchema.statics.addFlag = function(postId, callback) {
    var that = this;
    that.update({"_id": postId}, {"$inc": {"numFlags": 1}}, callback)
}

CommentSchema.statics.createPost = function(authorId, text, callback) {
    var that = this;
    that.create({"author": authorId, "text": text}, callback);
}

var CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;