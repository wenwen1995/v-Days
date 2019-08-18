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

详见[mongodb Error：127.0.0.1:27017 :: caused by :: Connection refused :解决方案](/README4.md)

5、使用nginx 代理，配置通过公网ip 访问时，正常情况下，若都配置完成，应该访问ip ,会出现如下界面：

![nginx 默认界面](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/32.png)

但是我的刚开始访问一直无法出现该页面，最后查了2个多小时，终于可以了。

中间参考的链接内容如下，给了很大的帮助：

参考的 jspang老师nginx 来配置：  [jspang老师nginx](https://jspang.com/posts/2018/10/05/nginx.html)

csdn这篇文章：  [csdn nginx配置](https://blog.csdn.net/qq_29767317/article/details/78579800)给了很大的启发和帮助，解决了nginx 不能访问的问题


 * 购买的是阿里云Ecs 服务器（1年） 
 * 服务器的操作系统是 cent OS 7.4 64位版本

#### 搭建nginx : 

  * 建议对linux系统不太熟的小白，跟我差不多的，下载 `xftp 软件` 来辅助自己理解系统内部的文件，同时为日后上传文件到服务器也做个准备

  * 这里，nginx 搭建主要看 `jspang 老师的上述的课程3`，讲述的已经很清楚了

#### 解决nginx不能访问的问题：

 * 检查服务端服务是否启动成功
 * 在服务端使用wget和curl测试下返回的是否正常
 * 浏览器wget或者curl等软件访问不了Nginx页面


`检查服务端服务是否启动成功：`

（1）查看nginx 是否启动，输入命令：

```js
ps -ef |grep nginx
```

出现如下，有nginx的，说明启动成功

![nginx 启动成功图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/1.png)

___注：我这里一开始是没有nginx服务的，原来是在安装完nginx后，没有将服务开起来。___

开nginx 服务 =》 安装好nginx后，再输入命令

```js
nginx 
```

即可。

（2） 检查80端口是否在监听状态
输入命令: 

```js
lsof -i :80
```

![80端口监听图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/2.png)


**注： 这里当时报错 : lsof command not found (找不到命令lsof)**

解决办法：我们可以通过yum来安装:

```js
yum install lsof
```


安装成功后，再试上述命令，则不会报错了

```js
netstat -lnt |grep 80
```

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/3.png)


发现一切正常。

**在服务端使用wget和curl测试下返回的是否正常**


（1） 输入命令进行wget 测试：

```js
wget 127.0.0.1
```

获的以下信息：
![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/4.png)

即wget 测试是 url 是没问题的。

（2） 输入命令进行curl 测试：

```js
curl 127.0.0.1
```

返回信息：
![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/5.png)

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/6.png)

即返回正常

上述即排查检测nginx 是否在服务器端的有错误

`浏览器，wget或者curl等软件访问不了Ngixn页面`

（1）可能是防火墙的开启的原因，所以要关闭防火墙 iptables

输入命令，查看防火墙是开启还是关闭状态

```js
getenforce
```

返回信息：
![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/7.png)

永久关闭防火墙，输入下面命令

```js
vim /etc/selinux/config

SELINUX=disabled #需要将此行更改为disabled 
SELINUXTYPE=targeted
```


再输入命令，检查防火墙的状态

```js
service iptables status
```

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/8.png)

问题不是出在nginx上，而是出在防火墙上，所以给iptable上添加80端口，输入下列命令，进入编辑模式：

```js
vi /etc/sysconfig/iptables
```


红色圈出的部分，原来是22，改成80后保存并推出，如下：

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/9.png)

执行下拉重启命令，再访问ip就可以啦（这里我的ip是： http://47.98.164.145/）

```js
/etc/init.d/iptables restart
```

（2） 本地客户端测试，
 
 *  ping 自己的服务器ip, 这里我的是47.98.164.145
 

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/10.png)


ctrl + C 结束 ping 通的命令

*   telnet服务端ip， 得到结果：

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/11.png)


安装telnet成功后，重新执行上述命令：

```js
yum -y install telnet
```

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/12.png)


* 使用curl 进行命令检测

```js
curl -i 47.98.164.145
```


得到结果：

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/13.png)

此时再访问浏览器ip,发现成功：
![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/14.png)



6、使用阿里云宝塔面板，可以更好的监控自己的服务器，安装各种东西，mysql 主从复制， 是个可视化面板，

首先在centos 下安装宝塔，大概需要5-10分钟：

```js
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install.sh && sh install.sh
```

安装结束后，如果成功会出现这样对应的访问ip, 用户名和密码，如下图：

![](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-18/15.png)

但一般直接访问 自己的公网ip +8888是不会成功的，具体原因加如何配置成功看这篇链接：  [https://blog.csdn.net/xiangshangbashaonian/article/details/79918567](https://blog.csdn.net/xiangshangbashaonian/article/details/79918567)


