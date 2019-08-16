//上传
const path = require('path');
const uploadModel = require('../service/model/upload');
const recordModel = require('../service/model/record');
const upload = require('../uploadHandler');
const Router = require('koa-router');
let router = new Router();

//使用阿里云对象存储，初始配置
const OSS = require('ali-oss');
const fs = require('fs');
let client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: '*******',
  accessKeySecret: '*******',
  bucket: 'wenwen-img-bucket',
});

//删除图片
router.post('/deleteImg',async(ctx,next) => {
  const { fileName, id } = ctx.request.body;
  await uploadModel.findOneAndRemove({"fileName": fileName},(err,doc) => {
    if(err) {
      ctx.body = { code: 500 };
    }else if(doc) {
      ctx.body = { code: 200, message: '删除成功！' };
    }

  });
  
  if(id) { //为修改记录，删除时，同时删除对应记录表中的数据
    return recordModel.findOneAndUpdate({ fileName, },{ "fileName": "" } ,(err,doc) => {
      if(err) {
        ctx.body = { code: 500 };
      }else if(doc) {
        ctx.body = { code: 200, message: '删除成功！' };
      }else {
        ctx.body = { code: 200, message: '删除失败！' };
      }

      console.log(855,err,doc)
    })  
  }
});

//存储图片
router.post('/uploadImg',upload.single('file'), async(ctx, next) => {
  const { file } = ctx.req;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  try {

    //获取图片的路径
    const list = file.path.split('\\');
    const fileFinalName = list[list.length-1]; //截取最终的文件名

    //上传图片到数据库中
    const uploadEntity = new uploadModel({
      fileName: fileFinalName,
      filePath: file.path 
    });
    await uploadEntity.save();


    ctx.body = {  code: 200, name: fileFinalName,  message: '上传成功！' };

  }catch(err) {
    console.log('err is ==>',err)
    ctx.body = {
      errorMsg: err
    }
  }
});


router.post('/uploadImgToAliClound',upload.single('file'), async(ctx, next) => {
  const { file } = ctx.req;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);

  try {
    //获取图片的路径
    const list = file.path.split('\\');
    const fileFinalName = list[list.length-1]; //截取最终的文件名

    let result = await client.put(fileFinalName, file.path); //获得的是个对象

    if(result.res.status === 200) {
      const { url } = result;

      //上传图片到数据库中
      const uploadEntity = new uploadModel({
        fileName: fileFinalName,
        filePath: url
      });
      await uploadEntity.save();

      ctx.body = {  code: 200, name: url,  message: '上传成功！' };
    }else {
      ctx.body = {  errorMsg: '上传出错！' };
    }

    // console.log('result is ===>',result);
  } catch (err) {
    console.log('upload to cloud',err);
    ctx.body = {
      errorMsg: err
    }
  }

})

module.exports = router;