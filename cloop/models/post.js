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

//TODO: Methods




var PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;