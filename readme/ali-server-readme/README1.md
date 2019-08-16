## 如何将项目部署到阿里云服务器上？

### 这里参考了好几篇文章，都写的很好，启发了我很多： 

 * 第一篇，网上知乎的一篇： [阿里云部署 nodejs+mongoDB 傻瓜教程](https://zhuanlan.zhihu.com/p/24474840)
 * 第二篇，建议多看看他的系列文章： [vue+node项目部署到服务器](https://segmentfault.com/a/1190000010205995)

#### 踩坑总结：

1、遇到问题，使用putty登录阿里云ecs服务器时，以root账户进行登录，输入密码老提示密码错误?

答： 查了之后，发现默认这个 ecs 服务器会有生成个密码，但这个密码不知道。所以我们要

 * 勾选自己的服务器，点击重置密码后；
 * 再重启服务器，让其重新运行；
 * 再使用putty进行连接；


出现如下字样，即连接成功！

![成功结果](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/1.png)
 

 2、装载node版本为10.16.0后，使用

 ```js
  make
 ```

 命令编译源代码，完成后，再使用

 ```js
  make install
 ```

 进行安装，却报错类似如下的错误：

![报错图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/2.png)


原因是，所购买的阿里云服务器centos版本为7，**如果安装node 8.x医生以上的版本，需要gcc 版本在4.9.4以上**。而使用命令：

```js
gcc -v
```

查看了下我当前gcc的版本,为 4.8.5,

![gcc初始版本图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/3.png)


显然不满足。这时候可以有2种解决方案，
    * **一种升级 gcc 版本，**
    * **一种是降级node 的版本**

[详见解决方案](/README2.md)

3、装mongodb,要装符合条件的mongodb版本。这里因为windows电脑上装的是4.0.10，所以还是参考这个链接 [阿里云部署 nodejs+mongoDB 傻瓜教程](https://zhuanlan.zhihu.com/p/24474840)进行安装和对应的配置！

**注意： 安装大概耗费了40min - 1h左右，这个过程不用太着急，可以边做别的边看下载进度**

装好后，mongodb的data和log的配置，以及配置文件的书写是参考该链接的: [centos mongodb配置](https://itjh.net/2016/07/11/centos-install-mongodb/)， 写得不错

配置好后，进入mongodb的命令模式下，如下, 输入测试的用户名和密码，若成功会返回1

![测试mongodb](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/12.png)

但是这里遇到问题，因为第一次是手动启动，后面再进入mongodb目录下

```js
cd /usr/local/mongodb/bin

./mongo
```

上次的mongodb被关闭锁定了，所以再执行上述命令会报错：

![mongodb锁定报错](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/13.png)

如何解决呢？

详见[详见centos mongodb启动失败解决方案](/README3.md)

4、这里在用linux 下，用如下命令

```js
vim /etc/mongodb.conf
```
配置mongodb配置文件时，输好内容，如何保存当前内容并退出当前vim编辑模式呢？

最终解决方法是： <font color=#DC143C  face="黑体">先按 Esc 退出当前编辑模式的状态，再 输入 :wq 进行保存并退出</font> 的处理就可以啦

参考链接：  [linux下vim 编辑](https://jingyan.baidu.com/article/148a1921ca21f14d70c3b169.html)

如果想要查看并继续修改当前编辑的文件， 使用下面的命令

```js
vim /etc/mongodb.conf
```

重新进入文件，再点击 i (即表示insert插入的命令)，就可进入编辑修改模式了

我所装的mongodb 目录结构如下：

![mongodb 目录图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/26.png)

bin文件夹下是mongodb 的一些可执行的exe，如下：

![bin 目录图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/27.png)

data文件夹下又有个db 文件夹，如下：

![data/db 目录图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/28.png)

所以这里最终我的mongodb.congf 配置文件书写如下：

![mongodb.congf 配置文件](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/29.png)

然后在/usr/local/mongodb/bin 路径下，想要通过 

```js
./mongo
```

进入mongodb 的编辑模式，一直报错：

<table>
    <tr>
        <td bgcolor=#FFD700>
[js] Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :
connect@src/mongo/shell/mongo.js:344:17
@(connect):2:6
exception: connect failed 
        </td>
    </tr>
</table>

查了国内国外好多文章均解决无果，后来参考了一篇链接解决： 

[解决mongodb Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :](https://blog.csdn.net/wyodyia/article/details/7965665)


说是原因为：  <font color=#DC143C  face="黑体">自己指定的数据库，不能自动加载服务。后面连接就无法进行连接了</font>

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


5、使用nginx 代理，配置通过公网ip 访问时，正常情况下，若都配置完成，应该访问ip ,会出现如下界面：

![nginx 默认界面](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/32.png)
