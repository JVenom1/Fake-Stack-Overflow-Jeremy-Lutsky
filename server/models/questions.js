// Question Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: {type: String, require: true, maxLength: 100},
    text: {type: String, require: true},
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', require: true}],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    asked_by: {type: String, default: 'Anonymous'},
    ask_Date_Time: {type: Date, default: Date.now},
    views: {type: Number, default: 0},
});
 
QuestionSchema.virtual('url').get(function(){
    return 'posts/question/' + this.id;
});

module.exports = mongoose.model('Question', QuestionSchema);