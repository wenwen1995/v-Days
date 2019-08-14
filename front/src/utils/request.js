import Vue from 'vue'
import instance from './index.js'


export function post(url,data) {
  return new Promise((resolve,reject) => {
  	instance.post(url,data).then(res => {
  		if(res.data.errorMsg) { //请求成功，但返回错误
  		  const errMsg = res.data.errorMsg;
  		  Vue.$vux.toast.text(errMsg, 'middle');
  		  reject(errMsg);
  		}
	  	resolve(res)
	  }).catch(err => {
	  	reject(err);
	  })
   }); 
}

export function get(url) {
	return new Promise((resolve,reject) => {
	  instance.get(url).then(res => {
	  	if(res.data.errorMsg) { //请求成功，但返回错误
  		  const errMsg = res.data.errorMsg;
  		  Vue.$vux.toast.text(errMsg, 'middle');
  		  reject(errMsg);
  		}
	  	resolve(res)
	  }).catch(err => {
	  	reject(err);
	  })
	})
}
