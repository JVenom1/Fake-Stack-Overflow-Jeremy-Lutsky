// Tag Document Schema
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema({
    name: {type: String, require: true},
});

TagSchema.virtual('url').get(function(){
    return 'posts/tag/' + this.id;
});

module.exports = mongoose.model('Tag', TagSchema);