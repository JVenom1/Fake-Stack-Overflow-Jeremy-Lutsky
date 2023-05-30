// Answer Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    text:{type: String, require: true},
    ans_by:{type: String, require: true},
    ans_date_time: {type: Date, default: Date.now},
});

AnswerSchema.virtual('url').get(function(){
    return 'posts/answer/' + this.id;
});

module.exports = mongoose.model('Answer', AnswerSchema);
