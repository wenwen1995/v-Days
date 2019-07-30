# vue-my-app

> A Vue.js project

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
          


先来看下最终的效果吧。跟todolist蛮像的，基本的增删改查都有。

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/1.gif)


******

目录结构梳理一下：

![文件目录结构](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/structure.png)

写的不太全，具体看对应文件好啦。


接下来是踩坑过程

#### 1、使用mongodb koa 执行post 请求时，请求的数据时对的，数据库也插入了对应的记录，但是返回的状态码一直是404 ？

答：网上查了很久，后来发现原来koa2 中如果使用了async  await ,await中不应该再有回调函数，如下图所示

![显示1](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p1.png)

所以后来注册的方法改成这样就正确了：

```js
router.post('/register', async(ctx, next) => {
const { phoneNumber, password } = ctx.request.body; //获取传来的phoneNumber值


const pwd = secretHandler.encrypt(password);

await userModel.findOne({ phoneNumber },(err,doc) => {
   if(err) {
    ctx.body = { code:500 };
   }else if(doc) { //用户已注册
    ctx.body = { errorMsg:'该用户已注册！' };
   }else {
    const userEntity = new userModel({
      phoneNumber,
      password: pwd
    }); 
    const result = userEntity.save();
    ctx.body = { code:200, message: '注册成功' };
  }
});
});
```

#### 
2、使用mongoose进行查找到对应的这一项，如何进行删除？

答：对应的model方法中，有2个方法

 * findByIdAndRemove （这个可以删除成功）
 * findByIdAndDelete（刚开始试了这个，发现这个删除不成功）

具体写法如下：

```js
//删除记录
router.post('/deleteRecord',async(ctx,next) => {
  const { id } = ctx.request.body;
  await recordModel.findByIdAndRemove(id,(err,doc) => {
    console.log('delete doc is==>',doc)
    if(err) {
      ctx.body = { code:500 };
    }else if(doc){
      ctx.body = { code:200, message:'删除成功' };
    }
  })
})
```

#### 3、使用mongodb 对于得到的结果进行排序?

答：这里 sort 字段名后的值

*  -1  降序，从大到小
*  1  升序，从小到大

这篇链接有对应的讲解：[https://blog.csdn.net/zk437092645/article/details/9345885](https://blog.csdn.net/zk437092645/article/details/9345885)


![显示2](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p2.png)

两种写法，

(1) 第一种：

*第二个参数没有的话，如果要用第三个排序，必须要写成null*

```js
model.find(null, null,{sort: [ {'_id': -1 } ] },(err,doc) => {
  ...
})
```

(2) 第二种：

```js
model.find({}).sort({'_id': -1 }).exec((err,doc) => {
  ...
})
```

#### 4、 get 如何传递参数，对应的路由那边如何获取参数 ？

答： get请求一般都是请求的内容键值对放在url后面，就像这样：

>http://localhost:3000/record/list?page=1&pageSize=5

传递参数时，这样写：

```js
const { pageSize } = this;
const url = `${URL_GET_RECORD_LIST}?page=${page}&pageSize=${pageSize}`;

get(url)
   .then((res) => {
        const { list, total } = res.data;
        this.total = total;
        this.list = this.changeResultList(list);
        this.$vux.loading.hide();
   }).catch(err => {
        this.$vux.loading.hide();
  });
```


对应的get方法这样写： *（当然前提是使用了kod-bodyparser,对axios做了一层封装）*

```js
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
```

后台koa 接收参数时，是这样的，如图所示：

![显示3](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p3.png)


#### 5、搞了2个多小时，如何使用model方法后的exec,并返回数据给前台页面？

答: 最终代码是这样写的：

```js
//获取记录list
router.get('/list',async(ctx, next) => {
  let { page, pageSize } = ctx.request.query;
  page = Number(page - 1); //这里要skip和limit接受的都是Number类型,要进行一层转换
  pageSize = Number(pageSize);


  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find()
         .skip(page * pageSize)
         .limit(pageSize)
         .sort({ '_id': -1 })
         .exec();

  return result.then((doc) => {
    ctx.body = {
      code: 200,
      list: doc,
    };
  }).catch(err => {
     ctx.body = { errorMsg: err };
  })  
});
```

注意事项：

  * 使用exec后，获取到的东西是个promise,要想获取里面的值，要么将其赋值给一个变量，再进行xx.then处理，要么直接在后面进行then处理
    
  * **下面的return 很关键！！**，之前就是一直没加这个return,在then里面能获取到doc数据，并打印出来，但前台就是拿不到数据！加了return 把对应的值传递过去，就可以了 ！！


#### 6、使用分页如何实现？


答： 在数据量少的情况下，可以使用limit + skip的方法 来获取分页

  * limit 限制出来多少条数据
  * skip 表示跳过制定数量的数据

详情戳这个理解： [http://outofmemory.cn/MongoDB/tutorial/mongodb-limit-skip.html](http://outofmemory.cn/MongoDB/tutorial/mongodb-limit-skip.html)

所以简单的分页实现就是如上述5 的代码一样实现，但是分页判断要根据

* pageNum >= total  ||  !total  (请求的总数大于等于数据库查出来的总数 或者 获得的总数为0 )  此时不再进行分页查询

* pageNum < total, 当前累计的获取的list总数小于 查出来的总数，进行继续分页请求查询


刚开始想到的方法是，分在两个接口。这里上述的5中的代码，是第一个接口，专门做分页处理的，另一个接口用来专门实现获取总数total,代码如下

```js
//获取list 总页数
router.get('/getListAllCount',async(ctx,next) => {
  const result = recordModel.find();
  return result.then(doc => {
    const total = doc ? doc.length : 0;
    ctx.body = { code: 200, total };
  }).catch(err => {
      ctx.body = { code:500 };
  })
})
```

对应的前端页面，先去请求这个/record/getListAllCount， 获取总数，再请求分页，进行分页处理，但这样感觉多一个请求又不太好，

后来鬼使神差想到 Promise的all  用法，因为现在两个接口中的result都是个Promise, 可以用All将其合并起来，统一在then里做处理，这样用一个接口就可以实现获取total可进行分页处理啦~:smile:

**Promise.all的用法，请戳：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 了解**


最终代码实现如下：

```js
//获取记录list 进行分页
router.get('/list',async(ctx, next) => {
  let { page, pageSize } = ctx.request.query;
  page = Number(page - 1);
  pageSize = Number(pageSize);

  const allCount = recordModel.find();

  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find({})
             .skip(page * pageSize)
             .limit(pageSize)
             .sort({ '_id': -1 })
             .exec();

  return Promise.all([allCount,result])
                .then(res => {
                  //结果res得到的是个数组，all中传递了几个，res就有几个值
                  const total = res[0].length ? res[0].length : 0;
                  const list = res[1].length ? res[1] : [];
                  ctx.body = {
                    total,
                    code: 200,
                    list,
                  };
                }).catch(err => {
                  ctx.body = { code:500 };
                });
});
```

`这里写当然还是存在一点问题的： 即每个人只能看到自己的记录，而不是看到所有的记录`

如何修改呢？

  * 登录后，将phoneNumber存在localStorage中，添加/修改记录时，同时将这个phoneNumber传给后台，后台根据这个phoneNumber进行检索
  * record的Schema字段的设计中，多增加一个phoneNumber字段，用来进行查询列表作为查询条件，如下图（红色标出的为多增加的）

![显示4](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p4.png)

  * 上述对应的分页查询中，内容也要对应的修改一下（增加了phoneNumber部分）
  
```js
//获取记录list 进行分页
router.get('/list',async(ctx, next) => {
  let { page, pageSize } = ctx.request.query;
  page = Number(page - 1);
  pageSize = Number(pageSize);

  const allCount = recordModel.find({ "phoneNumber": phoneNumber });

  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find({ "phoneNumber": phoneNumber })
             .skip(page * pageSize)
             .limit(pageSize)
             .sort({ '_id': -1 })
             .exec();


  return Promise.all([allCount,result])
                .then(res => {
                  //结果res得到的是个数组，all中传递了几个，res就有几个值
                  const total = res[0].length ? res[0].length : 0;
                  const list = res[1].length ? res[1] : [];
                  ctx.body = {
                    total,
                    code: 200,
                    list,
                  };
                }).catch(err => {
                  ctx.body = { code:500 };
                });
});
```

同时，前台如何实现上拉加载更多，下拉刷新？

---> (**使用的是vue-scroller 插件，进行上拉加载更多和下拉刷新** )

```js
//template html实现
<scroller
    ref="my_scroller"
    :on-refresh="refresh"
    :on-infinite="infinite"
    :minContentHeight="-1"
    loading-layer-color="#666"
    >
... //数据展示
</scroller>
```

```js
//方法实现

//data 定义数据类型
    page: 1, //当前第几页
    pageSize: 5,  //每次请求多少条
    total: 0, //总页数
    pageNum: 0, //当前获取返回数据的数量

 mounted() {
  this.fetchData(); 
 },
  methods: {
  refresh(done){ //下拉刷新
   setTimeout(() => {
        this.pageNum = 0;
        this.page = 1;
        this.fetchData();
        done();
      },1500);
    },
    infinite(done) { //上拉加载更多
      const that = this;
      const { total, pageNum } = that;

      //请求数量大于等于返回数量或者返回数量为0
      if(pageNum >= total || !total) {
        setTimeout(() => {
          that.$refs.my_scroller.finishInfinite(true);
        },800);
      }
      
      //进行分页请求
      if(pageNum < total) {
        setTimeout(() => {
          this.page ++;
          this.fetchData(this.page, true);
          done();
        },1500);
      }
    },
  fetchData(page = 1,fromLoadMore = false) {
      const { pageSize } = this;
      const url = `${URL_GET_RECORD_LIST}?page=${page}&pageSize=${pageSize}`;
      get(url).then((res) => {
        const { list, total } = res.data;
        const newList = translatorRecordList(list);
        this.pageNum += newList.length;
        if(fromLoadMore) {
          this.list = this.list.concat(newList);
        }else {
          this.list = newList;
        }
        this.total = total;
        this.$vux.loading.hide();
      }).catch(err => {
        this.$vux.loading.hide();
      })
    },
}
```

#### 7、为了增加安全性，请求需要进行token验证，如何实现token 产生和验证呢？

答： 推荐这篇文章，写的很好！！ 

链接： [http://blog.gdfengshuo.com/article/28/](http://blog.gdfengshuo.com/article/28/)

尝试了一下，最终打印出来的token值是这样的：

![显示5](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p5.png)


#### 8、在使用vue - router时，要对其进行全局守卫，即有token时，即使输入  / ,也跳转到记录页面，而不是又回到登录页面，无token时回到登录页面？

答： 进行上述路由处理时，使用beforeEach进行配置时，一直死循环报错： Maximum call stack size exceeded

```js
//退出页面的方法
logout() {
   localStorage.clear();
   this.$router.push({ path: '/' });
}
```

```js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Record from '@/views/Record'
import Me from '@/views/Me'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { title: '注册' }
    },
    {
      path: '/record',
      name: 'record',
      component: Record,
      meta: { title: '记录' }
    },
   {
      path: '/me',
      name: 'me',
      component: Me,
      meta: { title: '我的' }
    },
  ]
});


//全局守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const token_exp = localStorage.getItem('token_exp');
  const now_time = new Date().getTime();
  const remainTime = now_time - token_exp; //剩余的时间
  const time_step = 3 * 60 * 60 * 1000; //3h的时间，时间为毫秒级别
  const is_time_exceed = (token && remainTime >= time_step); //时间超过了3个月
    
  //if(!token) { //写了这个，在执行退出操作时，已经清空token, 同时执行，this.$router.push({ path: '/' }); 这条命令了，即本身 to 就要去 登录页面，这里又判断无token走登录页面，然后就一直绕啊绕啊，造成死循环了
    // next('/');
  //}

 if(token && is_time_exceed){ //token 过期跳转到登录页面
    if(to.name === 'login') { //return 防止死循环
      next();
      return;
    }else {
      next({ name: 'login' })
    }
    localStorage.clear();
  }else if(token && !is_time_exceed){
    if(to.name === 'login') {  //未过期。去->登录 返回->记录页
      next('/record');
    }else { //未过期 去->其他页，返回-> 其他页
      next();
    }
  }else {
    next();
  }

});

export default router;
```

#### 9、使用koajwt在进行路由模块的token验证，部分路由不需要验证token,参考网上的例子后，这样实现的。中间遇到问题，就是由登录页->主页，登录页不验证token,但是主页和其他一些页面获取数据需要token。主页获取数据时，明明请求的 Authorization 是有的，但是仍然报401的错误。排查了一圈，发现是axios在封装过程中，产生了问题。（排查了4-5个小时。。还好最终解决了）

答： 后台是这么设置token和验证token的

```js
const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koajwt = require('koa-jwt');

const app = new Koa();

//加载跨域中间件
app.use(cors());

//加载处理前端请求中间件
app.use(bodyParser());

//错误处理
app.use((ctx,next) => {
  return next().catch(error => {
    console.log('error ===>',error.status)
    if(error.status === 401) {
      ctx.status = 401;
      ctx.body = { errorMsg:'未授权，拒绝访问！' };
    }else {
      throw error;
    }
  })
})


// /user/login  /user/forgetPwd /user/register 不需要token
app.use(koajwt({ secret: "userToken" }).unless({
  path: [/\/user\/login/,/\/user\/register/,/\/user\/forgetPwd/]
}));
```

上述之所以这么写，是因为[http://blog.gdfengshuo.com/article/28/ ](http://blog.gdfengshuo.com/article/28/ )所说：


![显示6](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p6.png)

而最终问题产生的原因排查了很久，发现是自己错误的axios封装请求：

```js
import axios from 'axios';
import Vue from 'vue'


let requestList = [];
const baseURL = 'http://localhost:3000';
const token = localStorage.getItem('token'); 

const instance = axios.create({
  baseURL, // api 的 base_url
  timeout: 10000,
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': token,
  }
});

//请求拦截器处理
instance.interceptors.request.use((config) => {
  ...//request handle something
});

//响应拦截器处理
instance.interceptors.response.use((response) => {
  ...//response handle something 
});

export default instance;
```

上述代码的问题在于

  * localStorage由于是放在一开始获取的，所以一开始获取到的是空。

  * 第一次登录后，后台返回token,前台将其存在了localStorage中，此时主页get请求获取数据时，拿到的token还是原来的，还是空。所以会报401的错误，除非页面刷新一遍，此时拿到的就是获取后的token
  

  所以最终改了axios的封装，就好啦:smirk:

该邂逅的代码乳腺癌：

```js
import axios from 'axios';
import Vue from 'vue'

let requestList = [];
const baseURL = 'http://localhost:3000';

const instance = axios.create({
  baseURL, // api 的 base_url
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

    //token存在加入请求头中
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

```

#### 10、手机号注册时，用相同号码应提示已注册，虽然进了对应的判断语句，但没有显示对应的错误信息，发现控制台依旧报错：

**MongoError: E11000 duplicate key error collection: test.users index: phoneNumb
er_1 dup key: { : "13588888888" }**

如何解决？

答： 在网上找到答案了， 参考这篇链接：  [https://www.imooc.com/qadetail/234905](https://www.imooc.com/qadetail/234905)

解决步骤：

![显示7](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p7.png)

**出错原因是本来表中应该只有一个_id作为主键，但是不知道为啥，user表中_id和phoneNumber同时为主键，主键的值是不能重复的导致报错。所以只留下_id作为主键就好**

**我这里使用的是 *Studio 3T*（类似于图形化的mySql工具，只不过它是mongodb的图形化工具,推荐使用！）**

![显示8](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p8.png)


  * 第一个命令用来查看当前表下有多少个主键
  *  由于我的user表中有2个主键，只保留_id,所以我删去了phoneNumber_1这个主键


**注意： （主键的值可以从下面的面板copy获得）**

![显示9](
https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-7-30/p9.png)
