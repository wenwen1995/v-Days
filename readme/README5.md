## 如何实现动态搜索？

#### 这里参考了网上这篇链接，写mongoose 如何实现模糊匹配

 * [Mongoose 多条件模糊查询的实现](https://segmentfault.com/a/1190000008161345) 

前台代码中，增加了搜索框和对应的change方法,使用vux的input 进行节流搜索，请求后台

```js
<template>
 <div>
    //...
    <div class="searchWrap">
      <x-input placeholder="请输入搜索内容..." v-model="searchValue" :debounce="500" @on-change="fetchData(1)">
        <img slot="label" style="padding-right:10px;display:block;" src="../assets/search.png" width="24" height="24">
      </x-input>
    </div>
    //...
 </div>
</template>
```


方法fetchData增加传给后台对应的searchValue值，更多详见 **record.vue**

```js
 fetchData() {
      const phoneNumber = localStorage.getItem('phoneNumber');
      const { pageSize, searchValue, } = this;
      const url = `${URL_GET_RECORD_LIST}?page=${page}&pageSize=${pageSize}&phoneNumber=${phoneNumber}&searchValue=${searchValue}`;
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
 }
```

后台的获取数据方法中，主要改写了下面的部分，详见 **api/record.js**

原来写的是这样的：


```js
//前面省略了一部分...
let { page, pageSize, phoneNumber } = ctx.request.query;
  page = Number(page - 1);
  pageSize = Number(pageSize);

  //以手机号作为标识进行唯一查找
  const allCount = recordModel.find({ phoneNumber });

  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find({ phoneNumber })
             .skip(page * pageSize)
             .limit(pageSize)
             .sort({ '_id': -1 })
             .exec();
//后面省略了一部分...
```

后面加了搜索条件后，改写为这样的形式：

```js
//前面省略了一部分...
 let { page, pageSize, phoneNumber, searchValue } = ctx.request.query;
  page = Number(page - 1);
  pageSize = Number(pageSize);

  //搜索条件不区分大小写
  const reg = new RegExp(searchValue,'i');

  //以手机号作为标识进行唯一查找
  const allCount = recordModel.find(
  {
   phoneNumber,
   $or: [ //多条件，数组
    { title: { $regex: reg } },
    { description: { $regex: reg } },
   ] 
  }
  );

  //获得结果按照id降序排，即时间最新的在最前面，最早的在后面
  const result = recordModel.find(
             {
               phoneNumber,
               $or: [ //多条件，数组
                { title: { $regex: reg } },
                { description: { $regex: reg } },
               ] 
              }
             )
             .skip(page * pageSize)
             .limit(pageSize)
             .sort({ '_id': -1 })
             .exec();
//后面省略了一部分...
```


最终gif 展示效果如下：

<img src="https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-9/2.gif" width="200px" alt="动态搜索gif">