const mongoose = require('mongoose');
const Schema = mongoose.Schema; //declare Schema
const id = Schema.Types.ObjectId; //declare type

//create user
const userSchema = new Schema({
	id,
	phoneNumber: { unique: true, type: String },
	password:String,
	createAt: { type: Date, default: Date.now() },
	lastLoginAt: { type: Date, default: Date.now() },
});

module.exports = userSchema;



