## app 换肤功能

#### 顶部header和底部tabbar对应的选中颜色都得改变

想法: 


1.开始想着是使用数据库，手机号和对应选中的颜色绑定，初始设置默认的颜色，
换肤保存后，请求后台更新对应的记录

2、前台login的后，获取初始的皮肤颜色，赋值给对应的app.vue中的header和
tabbar的背景色， 更改颜色后，在
 
  * app.vue中的updated请求，获取颜色，改变header颜色+传递颜色给tabbar
组件更新对应的图片（这里底部的是图片，不是图标）

后来行不通的原因有3个： 
  
  `（1）在此期间使用饿了vuex+axios请求，代码量变得多了，前后台代码都得书写
  好多;`
   
   `(2) 如果是用户换肤的话，最简单的就是存储在localStorage中，进行存取即可;`

后来换肤选择存在localstorage中,但这样做的一点是如果用户换个手机，用手机号登陆时，他的换肤
又得从默认的开始。。

目前还存在的问题是：现在底部的tabbar图标其实是一个个图片，有选中的颜色，不选中的颜色。现在我自定义了6种颜色，从对应的 [阿里巴巴矢量图标库](https://www.iconfont.cn/search/index?searchType=icon&q=%E6%89%AB%E6%8F%8F) 下载对应的图片素材

 **一个图标对应的有不选中(共1种)+选中(共6种)，那3个图标就共有21张图片，虽然图片本身大小不大，但图片过多总是不好的，而且代码引入这些文件，也是较多的，后期改一下这个问题**


最终代码的实现可以看 
  
  - front/src/App.vue(更改header颜色)
  - front/src/commponents/Tarbar.vue(更改tarbar选中的图片)
  - front/src/views/login.vue(实现设置默认皮肤)
  - front/src/views/ChangeSkin.vue(实现换肤)



