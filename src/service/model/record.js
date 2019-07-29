const recordSchema = require('../schema/record');
const mongoose = require('mongoose');

// 创建model
const recordModel = mongoose.model('record',recordSchema);

module.exports  = recordModel;