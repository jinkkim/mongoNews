var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    //title is a required string
    title: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    imgLink: {
        type: String,
       
    },
    savedAt: {
        type: Date,
        default: null
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

var article = mongoose.model("article", articleSchema);
module.exports = article;