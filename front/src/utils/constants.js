const debug = false;
const BASE_HOST = debug ? 'http://localhost': 'http://47.98.164.145';
export const BASE_URL = `${BASE_HOST}:3000`;

//用户
export const URL_REGISTER = '/user/register';// 用户注册
export const URL_LOGIN = '/user/login'; // 用户登录
export const URL_FORGET_PWD = '/user/forgetPwd'; // 忘记密码
export const URL_MODIFY_PWD = '/user/modifyPwd'; // 修改密码

//记录
export const URL_MODIFY_RECORD = '/record/modifyRecord'; // 添加/修改记录
export const URL_GET_RECORD_LIST = '/record/list'; // 记录list
export const URL_DELETE_RECORD = '/record/deleteRecord'; // 删除某条记录 

//上传
export const URL_UPLOAD_IMG = '/img/uploadImg'; //上传图片
export const URL_DELETE_IMG = '/img/deleteImg'; //获取图片资源
export const URL_UPLOAD_IMG_TO_ALI_CLOUD = '/img/uploadImgToAliClound'; //upload to ali cloud

//skin color
export const COLOR1 = '#4990ee';
export const COLOR2 = '#c2d3da';
export const COLOR3 = '#f3b05a';
export const COLOR4 = '#d6618f';
export const COLOR5 = '#d9ac2a';
export const COLOR6 = '#5c4a72';

