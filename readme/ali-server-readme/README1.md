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










