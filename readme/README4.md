## 使用 阿里云对象存储上传图片踩坑记

#### 如何上传图片到阿里云呢？


    1. 进入阿里云官网，找到对象存储，根据自己的需要购买对应的对象存储。（这里我买的是标准存储，40GB, 适用于全国大陆地区的， 一个月，费用是1块钱，先试着玩起来）（配置越高越贵）
    
    2. 找到所需的Sdk,进行配置和验证。这里由于我的后台使用的是node,所以参考的是阿里云对象存储node 方面的相关配置

**主要参考的文章是这几个：**

 * [使用阿里云对象存储OSS 全系统教程](https://zhuanlan.zhihu.com/p/45236836)
 * [阿里云对象存储node 方面的相关配置链接](https://help.aliyun.com/document_detail/111265.html?spm=a2c4g.11186623.6.1202.4b0d26f6mZVIt7)
 * [阿里云对象存储 官方 github](https://github.com/ali-sdk/ali-oss)
 * [简书（node+express+阿里云对象存储 例子）](https://www.jianshu.com/p/d19cb18ceaf8)



#### 下面就开始啦：
 * 首先安装 ali-oss

```js
cnpm install -S ali-oss
```

 * 填写成功后，进行配置，因为是在node端进行配置的，所以除了之前的Schema和model不动，koa -router用来处理上传图片请求的得重写一个，如下：
 
```js
// api/upload.js

const path = require('path');
const uploadModel = require('../service/model/upload');
const recordModel = require('../service/model/record');
const upload = require('../service/uploadHandler');
const Router = require('koa-router');
let router = new Router();

//使用阿里云对象存储，初始配置
const OSS = require('ali-oss');
const fs = require('fs');
let client = new OSS({
  region: 'oss-cn-hangzhou', //自己对象存储设置的地区
  //下面2项比较重要，就不放出来了，为了安全私密性
  accessKeyId: '**********', //自己对象存储自动生成的accessKeyId
  accessKeySecret: '**********',//自己对象存储自动生成的accessKeySecret
  bucket: 'wenwen-img-bucket', //自己新建的这个对象存储桶名称
});
const ali_oss = {
  bucket: 'wenwen-img-bucket',
  endPoint: 'oss-cn-hangzhou.aliyuncs.com',
};
```


  * 如何查看自己的accessKeyId， accessKeySecret是啥呢？

**点击控制台的这里：**

![控制台显示1](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/1143.png)

然后会进入，提示这个：

![控制台显示2](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/1145.png)


由于这两个参数信息很重要，所以我也是新建了个子用户，使用子用户对应的accessKeyId 和 accessKeySecret

 * 接下来node 处理对应的上传操作了， 参考官方配置：

![官方上传配置](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/1147.png)


*注意：*

  **上述的object-name 即为上传的本地图片的图片名称，比如camera-1565234754767.png**

  **上述的local-file 即为本地上传的图片路径，形如..\\..\\static\\1-1565169131267.jpg（这个路径的形成，参考 前篇上传图片 文章： [v-days 上传图片记](https://github.com/wenwen1995/v-Days/blob/master/readme/README3.md)**


* 先书写部分代码，打印阿里云对象存储返回的信息：

```js
router.post('/uploadImgToAliClound',upload.single('file'), async(ctx, next) => {
  const { file } = ctx.req;

  try {
    //获取图片的路径
    const list = file.path.split('\\');
    const fileFinalName = list[list.length-1]; //截取最终的文件名

    let result = await client.put(fileFinalName, file.path); //获得的是个对象
    console.log('result is ===>',result);
  } catch (err) {
    console.log('upload to cloud',err);
    ctx.body = {
      errorMsg: err
    }
  }
})
```

 **注： 上述的这个 upload.single('file') 也参考 前篇上传图片 文章： [v-days 上传图片记](https://github.com/wenwen1995/v-Days/blob/master/readme/README3.md)**


  * 上传图片，控制台打印出来的阿里云对象存储返回的信息如下, 即这里表示上传成功：

![上传成功控制台图片](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/1.png)

 * 再登陆到阿里云对象存储的控制台查看，发现图片已经上传成功：

![阿里云对象存储控制台图片](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/2.png)


 * 上传到阿里云的图片，在显示时，提示 403 forbidden错误，显示不出来

![403错误解释](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/3.png)


**原因是： 即  默认新增对象存储时。读写权限默认是私有的，要想显示出来。即改下存储对象的读写权限为公有读私有写，如下图，这是改写权限后：**

![改写权限图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/4.png)

这样一来就可以上传成功后，进行显示查看了

* 最终完整的上传图片到 阿里云对象存储的代码如下：

```js
router.post('/uploadImgToAliClound',upload.single('file'), async(ctx, next) => {
  const { file, } = ctx.req;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  try {
    //获取图片的路径
    const list = file.path.split('\\');
    const fileFinalName = list[list.length-1]; //截取最终的文件名

    let result = await client.put(fileFinalName, file.path); //获得的是个对象

    if(result.res && (result.res.status === 200)) {
      const { url } = result;

      //上传图片到uploads 表中
      const uploadEntity = new uploadModel({
        fileName: fileFinalName,
        filePath: url
      });
      await uploadEntity.save();

      //详情的上传图片，更新到对应的数据库
      if(ctx.req.body.id) {
         const { id } = ctx.req.body;
         return recordModel.findOneAndUpdate({ "_id": id },{ "filePath": url } ,(err,doc) => {
          if(err) {
            ctx.body = { code: 500 };
          }else if(doc) {
            ctx.body = {  code: 200, name: url,  message: '上传成功！' };
          }else {
            ctx.body = { errorMsg: '上传出错！' };
          }

        })  
      }else {
        ctx.body = {  code: 200, name: url,  message: '上传成功！' };
      }

    } else {
      ctx.body = {  errorMsg: '上传出错！' };
    }

  } catch (err) {
    console.log('upload to cloud',err);
    ctx.body = {
      errorMsg: err
    }
  }

})
```

<font color=#DC143C  face="黑体">注意： 上述这样的写法功能是完全没有问题的，但存在个问题就是： **上传的图片会先放在本地的static文件夹下，然后再上传到阿里云 对象存储上。如果上传到云 对象存储后，不做删除本地static文件夹下对应的图片，会使得服务器上static文件夹下图片越来越多和庞大**</font>

所以，参考网上的node 如何删除图片，写了个方法，在上传图片到云对象存储后，进行删除本地static文件夹下的处理

具体方法如下：
```js
//删除本地文件夹
function deleteLocalFolderImg(url) {
 let files = [];
 const isExistUrl = fs.existsSync(url);
 console.log('isExistUrl --->',isExistUrl);
 if(isExistUrl) {
  files = fs.readdirSync(url);
  console.log('files is ==>',files);
  files.forEach((file,index) => {
    // 得到图片路径，删除本地文件
    const curPath = path.join(url,file);
    console.log('curPath --->',curPath);
    curPath && fs.unlinkSync(curPath);
  })
 }
}
```

调用的话，在上述上传代码uploadImgToAliClound 中
```js
 //...前面一些省略内容
    const uploadEntity = new uploadModel({
      fileName: fileFinalName,
      filePath: url
    });
    await uploadEntity.save();

    //dev 测试环境
      //const localFileUrl = path.resolve('/MyStudy/vue-my-app-koa-server','./static');

    //prod 生产环境
    const localFileUrl = path.resolve('/home/vue-my-app-koa-server','./static');
    // console.log('localFileUrl ==>',localFileUrl);
    deleteLocalFolderImg(localFileUrl);
 //...后面一些省略内容
```

**注意：上述的生产环境，存放图片路径根据实际自己后台代码部署在服务器上的路径来**

我的路径在服务器上是这样的：
![static文件夹在服务器上的路径](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-20/1.png)

 
 * 原来对应的前端页面也要有对应的更改，  详情见src/views/Edit.vue,

```js
//template
<template>
...
<group>
      <Uploader :images="images"
                :max="1"
                :readOnly="false"
                name="file"
                @uploadImg="uploadImg"
                @removeImg="removeImg"
      />
    </group>
...
</template>
//一些方法methods+数据处理
<script>
data(){
  return {
    images: []
  }
},
methods: {
   //...
   uploadImg(data) {
      this.$vux.loading.show('正在上传...');
      post(URL_UPLOAD_IMG_TO_ALI_CLOUD,data)
          .then((res) => {
            let { name } = res.data;

            //本地路径local:3000/图片名称
            //let url = `${BASE_URL}/${name}`;
            //this.images.push(url);

            //现在由于后台直接返回的是阿里云对象存储的url,形如 http://wenwen-img-bucket.oss-cn-hangzhou.aliyuncs.com/%E5%8A%A0%E5%8F%B7-1565234815376.png，所以前面不需要添加host 进行拼接
             this.images.push(name);
    
            this.uploadFileName = name;
            this.$vux.loading.hide();
            
            console.log('upload res ==?',res,url)
          }).catch(err => {
            this.$vux.loading.hide();
            console.log('err ==>',err)
          })
    },
    removeImg() {
      const { uploadFileName,id } = this;
      const data = { filePath: this.uploadFileName };
      if(id) { data.id = id; }
      post(URL_DELETE_IMG,{...data})
          .then(res => {
            this.images.pop();
          })
    },
    //...
}
</script>
```

 * 后面还修改了记录的显示。原来默认卡片的颜色是从预置的颜色list里随机
显示颜色，现在是如果有上传图片，默认卡片背景显示的是图片，如下图gif
显示：


<img src="https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-8/1.gif" width="200px" alt="卡片背景为图片">






  




  




