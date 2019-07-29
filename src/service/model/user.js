const userSchema = require('../schema/user');
const mongoose = require('mongoose');

// 创建model
const userModel = mongoose.model('user',userSchema);

module.exports  = userModel;

