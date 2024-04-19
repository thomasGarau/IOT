const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileInfoSchema = new Schema({
    creationDate: Date,
    duration: String,
    size: String
});

const FileInfo = mongoose.model('FileInfo', FileInfoSchema);
module.exports = FileInfo;
