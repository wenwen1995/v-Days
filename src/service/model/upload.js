const uploadSchema = require('../schema/upload');
const mongoose = require('mongoose');

// 创建model
const uploadModel = mongoose.model('upload',uploadSchema);

module.exports  = uploadModel;