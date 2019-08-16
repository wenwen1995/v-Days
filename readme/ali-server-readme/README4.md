
原因可能为：  <font color=#DC143C  face="黑体">自己指定的数据库，不能自动加载服务。后面连接就无法进行连接了</font>

所以 每次启动前，自己手动，指定下自己指定的数据库 

我这边最终的解决步骤就是： 
 * 首先检查自己的mongodb服务是否有跑起来，没跑起来的话参考上面的启动步骤启动
 * 删除 mongod.lock文件，这个文件在我目录下的路径是：
   <font color=#F0E68C  face="黑体">/usr/local/mongodb/data/mongod.lock</font>
   <font color=#F0E68C  face="黑体">/usr/local/mongodb/data/db/mongod.lock </font>
 * 进入  /usr/local/mongodb/bin 目录下，输入该命令
 
 ```js
 ./mongod --dbpath=/usr/local/mongodb/data/db/
 ```

<font color=#DC143C  face="黑体">上述的dbpath路径，就是你那个mongod.conf配置文件配置的dbpath 路径</font>

若成功，会返回下列结果：

![成功结果](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/30.png)

这个putty窗口不要关闭，重新打开一个新的putty窗口登录后，进入  /usr/local/mongodb/bin 目录下，输入该命令

```js
./mongo
```

一串东西显示后，就可以输入mongodb的一些命令，开始进行啦，如下图：

![成功结果](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/31.png)