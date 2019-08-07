const mongoose = require('mongoose');
const Schema = mongoose.Schema; //declare Schema
const id = Schema.Types.ObjectId; //declare type

//create upload
const uploadSchema = new Schema({
  id,
  fileName: String,
  filePath: String,
});

module.exports = uploadSchema;