import axios from 'axios';
import Vue from 'vue';
import { BASE_URL } from '@/utils/constants';

let requestList = [];



const instance = axios.create({
  baseURL: BASE_URL, // api 的 base_url
  timeout: 10000,
  headers: {
  	'Content-Type': 'application/json;charset=UTF-8',
  }
});


//request interceptor
instance.interceptors.request.use((config) => {
	const req = JSON.stringify(config.url) + JSON.stringify(config.data);
  const token = localStorage.getItem('token');

	if(requestList.includes(req)) {
		Vue.$vux.toast.text('操作过快，稍后再试~', 'middle');
		return;
	}else {
		requestList.push(req);
	}

	if(token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
},(error) => {
	requestList = [];
	return Promise.reject(error);
});

//response interceptor,对相应错误的封装
instance.interceptors.response.use((response) => {

    //当前请求列表删除该请求
	const req = JSON.stringify(response.url) + JSON.stringify(response.data);
	requestList.splice(requestList.findIndex(item => item === req),1);

	let successMsg = '';
	if(response.data.message) {
		successMsg = response.data.message;
		Vue.$vux.toast.text(successMsg, 'middle');
	}

	if(response.data.token) {
		localStorage.setItem('token',response.data.token);
	}

	return response;
},(error) => {
	let errMsg = "";
	console.log('handle err ==>',error);
	if(error.response.status) {
		switch(error.response.status) {
			case 400:
			    errMsg = "错误请求";
			    break;
			case 401:
			    errMsg = "未授权，请重新登录";
			    break;
			case 403:
			    errMsg = "拒绝访问";
			    break;
			case 404:
			    errMsg = "找不到地址";
			    break;
			case 500: 
			    errMsg = "服务器错误";
			    break;
			default: 
			    break;
		}
	}else {
			errMsg = "出了点错误";
	}
	requestList = [];
	Vue.$vux.toast.text(errMsg, 'middle');
	return Promise.reject(error);
});

export default instance;
