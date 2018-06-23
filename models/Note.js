var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var noteSchema = new Schema({
    //title is a required string
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    }
});

var note = mongoose.model("note", noteSchema);
module.exports = note;