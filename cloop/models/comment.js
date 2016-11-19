var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = mongoose.Schema({
    author: {type: ObjectId, ref:"User"}],
    text: String,
    timeCreated: {type: Date, default: Date.now},
    timeEdited: {type: Date, default: null},
    removed: [type: Boolean, default: false],
    numUpvotes: {type: Number, default: 0},
    numFlags: {type: Number, default: 0}
});

//TODO: Methods




var CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;