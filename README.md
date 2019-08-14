# v-Days
  (my-first-vue-app)

> A Vue.js mobile project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:6333，开启前台的页面
npm run dev 

# 进入到文件目录/src/service下, localhost:3000 开启后台
node index.js

```

## 做项目踩坑记

想要完成这个项目的一些要求：


    前提
      技能掌握
        前端 
          1.javascript
          2.vue框架 + vue-router
          3.vux 移动端组件框架(PS:也可以选择你喜欢的框架)

        后端：
          1.node.js (koa框架)
          2.mongodb 数据库
          3.mongoose MongoDB的一个对象模型工具，是基于node-mongoldb-native开发的MongoDB nodes驱动，可以在异步的环境下执行。 
          

>  做该项目的缘由： 跟小勇娃随便瞎聊，后来说到都是做技术的，为什么不做个app自己用起来？刚好手机有个应用 **纪念日** 功能也比较简单，自己也一直想学学node,结合自己的前端技术很久了，索性闲余时间捯饬起来:relaxed:

先来看下最终的效果吧。跟todolist蛮像的，基本的增删改查都有。

![gif图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/1.gif)

注：这里gif图好像显示的不完整，要想看全部效果，要么照开始一样，跑起来命令进行查看，要么戳这个链接 [https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/1.gif](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/1.gif) 进行下载 gif 查看

******

目录结构梳理一下：(这里前后端采用分离，之前是在一个总文件夹下，对于在本地电脑跑前后端是可行的，后面因为应用要放在阿里云服务器上，采用nginx进行部署。故将前后端代码都分离出来)

**前端目录结构：**

![前端目录结构图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-14/1.png)

**后端目录结构：**

![后端目录结构图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-14/2.png)

*写的不太全，具体看对应文件好啦,这个项目还是练手项目，所以初期比较简单，后期会再支持`图片上传`、`换肤`、`模糊搜索获取记录`、`微信授权登录`等功能~*

目前表就只有3个，一个users表，一个records表,还有个upload表。

对应表中字段的设计见 **v-Days-koa-server/service/schema** 下的设计

接下来是一些记录，
  
  * [踩坑记](/readme/README1.md)
  * [换肤记录](/readme/README2.md)
  * [上传照片记](/readme/README3.md)
  * [上传照片到阿里云对象存储记](/readme/README4.md)
  * [记录页 增加模糊搜索记](/readme/README5.md)