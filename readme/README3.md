## app 上传图片的功能

#### 1、官方没有上传图片的插件

#### 2、参考 [vux-uploader官方组件](https://github.com/greedying/vux-uploader) （官方github开源的上传组件）和[vux-uploader-component](https://github.com/eJayYoung/vux-uploader-component) 

想用前者，发现不支持的属性还挺多的，想用后者，尝试了一下，虽然封装的挺好的，预览、上传、单张多张、包括解决图片上传的旋转问题啥的。

但是上传封装的太死，源码看了下，是手动造了个xmlhttpRequest，进行访问请求。而我的后台是由node编写，请求这边自己封装了axios,且需要验证token..然后这条路就被堵死了。

然后大概仿照源码实现一下吧。(反复看了下二者， 前者看了下源码，设计的比较好，有些实现是本身实现的，但暴露出来一些方法属性也可供开发者去自己实现，还是比较推荐前者的开发风格的。边学边看吧)

#### 3、上传用的node插件是 koa-multer 插件。网上对它的介绍一堆，自行搜索了解哇。:yum:

 * 安装 koa-multer
 
```js
cnpm install -S koa-multer
```

  * v-Days-koa-server/service/下新建个uploadHandler.js,用来让 koa-multer 处理一下上传的文件存放在哪里，返回的路径名是什么样的


  **注意： 为了让前端在上传文件后，能及时显示在页面上，需要用到插件 *koa-static***
   
  **(1) 定义存放是文件夹是 static**

  **(2) 所在的目录是这样的：(service下的index.js 为入口文件)**

如图所示：

![目录图片](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-7/1.png)


**uploadHandler.js 代码如下：**

```js
const multer = require('koa-multer'); //上传文件的中间件

let storage = multer.diskStorage({
  destination: function(req,file,cb) { //配置图片上传的目录
    cb(null,'./static/');
  },
  filename: function(req,file,cb) { //上传后完成重命名文件名
    const fileFormat = file.originalname.split('.');
    const fileFormatLen = fileFormat.length;
    const finalName = `${fileFormat[0]}-${Date.now()}.${fileFormat[fileFormatLen-1]}`; //形如check-1565081101148.png 这样子
    cb(null, finalName);
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('This is not image file type'), false)
  }
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
```

 * 再安装 *koa-static* 插件，为了加载静态资源如图片等，可在浏览器下直接通过localhost:3000/xxx.png 查看到图片

```js
cnpm install -S koa-static
```

 * v-Days-koa-server/service/index.js 在原来的基础上，再配置对应的上传接口
 
```js
const Koa = require('koa');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const static = require('koa-static');


//引入连接文件,引入其他router
const { connect }= require('./init');
let user = require('./api/user');
let record = require('./api/record');
let img = require('./api/upload'); //图片

const app = new Koa();

//加载跨域中间件
app.use(cors());


//加载处理前端请求中间件
app.use(bodyParser());


//错误处理
app.use((ctx,next) => {
  return next().catch(error => {
    console.log('author error ===>',error.status)
    if(error.status === 401) {
      ctx.status = 401;
      ctx.body = { errorMsg:'未授权，拒绝访问！' };
    }else {
      throw error;
    }
  })
})

// /user/login  /user/forgetPwd /user/register 不需要token (这里后来都注释了！！否则访问静态资源时，会因为权限没有token而报401)
//app.use(koajwt({ secret: "userToken" }).unless({
  //path: [/\/user\/login/,/\/user\/register/,/\/user\/forgetPwd/,/\/uploadImg/]
//}));

//这里超重要！！指定服务器的静态资源地址，在当前目录下的文件可以直接localhost:3000/filename访问到
app.use(static('./static/')); //该目录是相对于server入口文件，即server下的index.js而言的


let router = new Router();

//装载user的路由
router.use('/user',user.routes());

//装载record的路由
router.use('/record',record.routes());


//装载img 上传的路由
router.use('/img',img.routes());


//加载路由中间件
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000,() => {
    console.log('koa works ----~~~')
});


(async () => {
  await connect();
})();
```

 * 对应的api/upload 处理图片上传的接口是这么写的

```js
const uploadModel = require('../service/model/upload');
const upload = require('../service/uploadHandler');
const Router = require('koa-router');
let router = new Router();

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

    //详情的上传图片，更新到对应的数据库
    if(ctx.req.body.id) {
       const { id } = ctx.req.body;
       return recordModel.findOneAndUpdate({ "_id": id },{ $set: { "filePath": file.path } },(err,doc) => {
        if(err) {
          ctx.body = { code: 500 };
        }else if(doc) {
          ctx.body = {  code: 200, name: file.path,  message: '上传成功！' };
        }else {
          ctx.body = { errorMsg: '上传出错！' };
        }

      })  
    }else {
      ctx.body = {  code: 200, name: file.path,  message: '上传成功！' };
    }

  }catch(err) {
    console.log('err is ==>',err)
    ctx.body = {
      errorMsg: err
    }
  }
});
```


 * 上传的schema(数据库表设计)和model 实现如下：
 
 ```js
 //schema/upload.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema; //declare Schema
const id = Schema.Types.ObjectId; //declare type


//create upload
const uploadSchema = new Schema({
  id,
  fileName: String,
  filePath: String,
});


module.exports = uploadSchema;


//model/upload.js
const uploadSchema = require('../schema/upload');
const mongoose = require('mongoose');

// 创建model
const uploadModel = mongoose.model('upload',uploadSchema);

module.exports  = uploadModel;
 ```

 * 上传的前端代码，涉及上传的组件是components/uploader.vue

代码如下：

```js
<template>
  <div>
    <div v-show="showHeader" class="weui-uploader__hd">
      <p class="weui-uploader__title"> {{ title }} </p>
      <div v-show="showHeader && showTip" class="weui-uploader__info">
        {{ images.length }} / {{ max }}
      </div>
    </div>
   
  <div class="file-wrap">
    <!-- 显示上传的小图 -->
    <ul class="weui-uploader__files">
      <li v-for="image in images" class="imgWrap" :key="image" >
        <img :src="image" class="imgStyle" @click="preview(image)">
        <x-icon type="ios-close" size="30" class="deleteIcon" @click="remove"></x-icon>
      </li>
    </ul>
  
      <!-- 预览大图 -->
      <div class="uploaderPreviewImg" v-if="showPreview" @click="hidePreview">
        <ul class="weui-uploader__files">
        <li v-for="image in images" :key="image" >
          <img :src="image" class="bigImgStyle" >
        </li>
      </ul>
      </div>

      <!-- 上传图片 -->
      <div v-show="!readOnly && images.length < max" class="weui-uploader__input-box">
        <input  ref="input" class="weui-uploader__input" type="file" accept="image/*" :capture="showCapture" @change="change">
      </div>
    </div>


  </div>
</template>

<script >
  export default {
    props: {
      images: {
        type: Array,
        default: () => []
      },
      max: {
        type: Number,
        default: 1
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showTip: {
        type: Boolean,
        default: true
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '图片上传'
      },
      // // 是否接管+号的click事件，如果是，点击不弹出选择文件的框
      // handleClick: {
      //   type: Boolean,
      //   default: false
      // },
      size: {
        type: String,
        default: 'normal'
      },
      capture: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'img'
      },
    },
    data() {
      return {
        showPreview: false, //预览大图与否
      }
    },
    methods: {
      change() {
        let formData = new window.FormData();
        const fileInfo = this.$refs.input.files[0];
        formData.append(this.name,fileInfo); //上传文件的信息放在对应的键值对中

        const fileType = fileInfo.type;
        const reg = /(gif|png|jpe?g)/;

        if(!reg.test(fileType)) { //非图片
          this.$vux.toast.text('上传文件类型不对！', 'middle');
          return false;
        }

        console.log('file is ==>',fileInfo)
        this.$emit('uploadImg',formData);

      },
      remove() {
         // 移除图片的时候将input file 置空，否则删除该图片之后无法再次上传该图片
        document.querySelector('.weui-uploader__input').value = '';
        this.$emit('removeImg')
      },
      preview(img) {
        console.log('img is -->',img)
        this.showPreview = true;
      },
      hidePreview() {
        this.showPreview = false;
      }

    },
    computed: {
      showCapture() { //调取相机
        return this.capture || undefined;
      },
    }
  }
</script>

<style scoped lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';

.weui-uploader__title {
  color: #999999;
}

.weui-uploader__hd {
  padding: 10px;
}

.weui-uploader__bd.small {
  .weui-uploader__input-box {
    margin-right: 5px;
    margin-bottom: 5px;
    width: 58px;
    height: 58px;
  }
  .weui-uploader__file {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}

.imgWrap {
  position: relative;
}

.deleteIcon {
  position: absolute;
  right: -8px;
  top: -10px;
  display: block;
  fill: red;
 }

.imgWrap, .imgStyle{
  width: 77px;
  height: 77px;
  border-radius: 8px;
  border: 1px dashed lightgray;
  margin-bottom: 10px;
}

.file-wrap {
  padding: 10px 0 0 10px;
}

.uploaderPreviewImg {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  z-index: 100;
}

.bigImgStyle {
  width: 400px;
  height: auto;
}

</style>
```

  * 对应的添加或修改页面的伪代码逻辑如下, 详情见src/views/Edit.vue

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
   uploadImg(formData) {
      const { id } = this;
      formData.append("id",id);
      this.$vux.loading.show('正在上传...');
      post(URL_UPLOAD_IMG_TO_ALI_CLOUD,formData)
          .then((res) => {
            let { name } = res.data;

            //本地路径local:3000/图片名称
            let url = `${BASE_URL}/${name}`;
            this.images.push(url);
    
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


 * 上传图片成功后，若要删除图片，需要进行3步
  
  (1) 发送删除请求，传递当前文件名 

  (2) koa 后台从表中查到对应的文件，删除uploads表中的这条记录。 **新增和修改记录的时候，这个图片的信息也会存在records 记录表中。所以在删除时，如果是修改时的删除图片（当有id存在），也要删除records中对应的图片信息，而新增时，是统一点提交才会保存在records和uploads表中的。只删除图片的话，还未在records中，只用删除对应的uploads表即可**

  (3) 前台在成功响应的前提下，删除对应的图片数组信息


```js
//步骤1： 发起删除请求
removeImg() {
      const { uploadFileName,id } = this;
      const data = { filePath: this.uploadFileName };
      if(id) { data.id = id; }

      post(URL_DELETE_IMG,{...data})
          .then(res => {
            //this.images.pop();
          })
 }


//步骤2，删除对应的表记录
//api/upload.js
//删除图片
router.post('/deleteImg',async(ctx,next) => {
  const { filePath, id } = ctx.request.body;
  await uploadModel.findOneAndRemove({"filePath": filePath},(err,doc) => {
    if(err) {
      ctx.body = { code: 500 };
    }else if(doc) {
      ctx.body = { code: 200, message: '删除成功！' };
    }

  });
  
  if(id) { //为修改记录，删除时，同时删除对应记录表中的数据
    return recordModel.findOneAndUpdate({ "_id": id },{ $set: { "filePath": "" } } ,(err,doc) => {
      if(err) {
        ctx.body = { code: 500 };
      }else if(doc) {
        ctx.body = { code: 200, message: '删除成功！' };
      }else {
        ctx.body = { errorMsg: '删除失败！' };
      }

    })  
  }
});

//步骤3,前台响应，进行删除
removeImg() {
      const { uploadFileName,id } = this;
      const data = { filePath: this.uploadFileName };
      if(id) { data.id = id; }


      post(URL_DELETE_IMG,{...data})
          .then(res => {
            this.images.pop();
      })
}
```


 * 预览大图对应的样式和逻辑，可以详见 upload.vue 中有写


最终实现的效果用动图展示一下：

![上传图片的gif](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-7/1.gif)


 * 可以看到上传的图片存放地已有图片: 
 
 ![存放的图片](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-7/1127_0.png)

 * 数据库records表中，最终该条记录如下：

 ![records表该纪录](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-7/1129_0.png)


 * uploads表中数据如下：
 
  ![uploads表数据](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-7/1131_0.png)


当然目前这个还有很多不足，如下：

   - 比如现在图片服务器node是弄在本地的，该如何弄在 **阿里云服务器** 上
   - 图片目前限制单张，还未在手机进行选取图片或者拍照的测试，是否有bug?
   - 对于图片可能会旋转的问题，也没做处理。。

之后解决起来！再来更新~:wink:









