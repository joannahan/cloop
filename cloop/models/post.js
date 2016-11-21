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

// PostSchema.statics.returnPosts = function() {
//     var that = this;
//     that.find({"removed": false}, function(err, results) {
//         if (err) {
//             console.log(err);
//         } else {
//             return results;
//         }
//     });
// }

// PostSchema.statics.sortedByUpvotes = function() {
//     var that = this;
//     that.find({"removed": false}, function(err, results) {
//         if (err) {
//             console.log(err);
//         } else {
//             results.sort(function(a, b) {
//                 return b.numUpvotes - a.numUpvotes;
//             });

//             return results;
//         }
//     });
// }



var PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;