`升级gcc 版本：`

前者升级 gcc 版本，可以参考这篇链接，写的很好： [升级gcc版本](https://www.vpser.net/manage/centos-6-upgrade-gcc.html)

这里我**升级gcc 版本到7.3**， 升级成功如下所示：

![gcc升级成功版本图](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/4.png)

`降级node版本：`

<font color=#DC143C  face="黑体">注意：若未使用ali-oss4.x （对象存储），则可采取降级node版本的方法。

因为这里有大坑，ali-oss 4.x 在centos 上，使用node < 8.x 版本表现十分不好，上传图片返回状态码200，但会返回 一个空的errorMsg ，查询多方均无结果解决</font>

这里由于我之前装的node是6.9.1的版本，要装7.x版本，则要先将之前的一些安装包和文件夹手动删除后，再依次执行如下命令


(注： 这里之前下载的是6.9.1的版本，而本地的windows环境下 node 版本为10.15.1，后台代码写了很多async await(**在node 7.6.x以后的版本才支持，以前的版本都只支持promise写法**),

<table><tr><td bgcolor=orange>因而： 综合考量卸载了原来的6.9.1版本，重新安装7.7.0版本</td></tr></table>

<table><tr><td bgcolor=#6495ED>这里建议windows 本机环境下装的什么node版本，就在对应的centos 下装啥版本，避免像我一样踩很多坑。。</td></tr></table>


* 如何卸载centos 下之前装过的node版本的，这里我参考的是这篇链接：[卸载centos上的node](https://www.cnblogs.com/zycbloger/p/5563243.html) 

由于我之前也是手动安装，未用yum 进行安装，所以卸载时采用手动对应的卸载方法，如下：

![手动卸载centos node](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/5.png)

下载相应的nodejs 包：
```js
 wget http://nodejs.org/dist/v7.7.0/node-v7.7.0.tar.gz
```

解压并进入对应的文件夹：
```js
tar zxf node-v7.7.0.tar.gz
cd node-v7.7.0
```

到configure目录下
```js
cd configure
```

编译源代码(此命令会耗费一段时间)
```js
make
```

完成后，再执行安装命令
```js
make install
```

成功后测试下node是否安装成功，输入命令 node -v,进行查看，发现出现版本号，即安装成功，如下：

![node版本](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/6.png)

### 还要注意一个超级重要的点！

上传图片用的是阿里云的ali-oss, 而这个 **node版本与这个ali-oss的版本是一一对应的关系！！**

![node版本与ali-oss版本对应关系](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/7.png)

这里我windows 下， node 版本是 10.16.0
![本地windows下node版本](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/8.png)

所以本地安装的ali-oss 为最新版本为：6.1.1
![本地windows下ali-oss版本](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/9.png)


**而现在阿里云服务器centos 中，node现在版本为7.7.0，所以依照上图，ali-oss 安装版本应为4.x, 重新安装。否则会报错！**


所以综上所述，最终项目装的版本分别是
    * **node 10.16.0**
    * **npm 6.9.0** 
    * **ali-oss 6.0.0**

![node、npm版本](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/10.png)

![ali-oss版本](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/11.png)

