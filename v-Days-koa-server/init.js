const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');

const url = "mongodb://127.0.0.1:27017/test";

mongoose.Promise = global.Promise;


exports.connect = () => {

	mongoose.connect(url,{ useNewUrlParser: true });

	let maxConnectTimes = 0; //失败重连次数

	return new Promise((resolve,reject) => {
        mongoose.connection.on('disconnected',() => {
			console.log('****** 数据库断开 ******');
			if(maxConnectTimes < 3) {
				maxConnectTimes ++;
				mongoose.connect(url,{ useNewUrlParser: true });
			}else {
				reject();
				throw new Error("数据库连接出现问题，请人工解决！")
			}
	    });

	    mongoose.connection.on('error',(err) => {
	      
	      if(maxConnectTimes < 3) {
				maxConnectTimes ++;
				mongoose.connect(url,{ useNewUrlParser: true });
			}else {
				reject();
				throw new Error("something error in 数据库连接" + err)
			}
	    });


	    mongoose.connection.once('open',() => {
		  	//connect
		   console.log('MongoDB Connected successfully!')
		   resolve();

		});

	});
}
