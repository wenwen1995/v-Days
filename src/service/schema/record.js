const mongoose = require('mongoose');
const Schema = mongoose.Schema; //declare Schema
const id = Schema.Types.ObjectId; //declare type

//create record
const recordSchema = new Schema({
  id,
  title: String,
  description: String,
  setTimeStamp: {
    type: Date,
    default: Date.now
  }, //设置的时间戳
  phoneNumber: { type: String },
  fileName: String,
  filePath: String,
});

module.exports = recordSchema;