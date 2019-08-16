* 在 `xftp软件` 找到mongodb的lock文件，进行删除（删除红色标出的文件）

![删除mongod.lock文件](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/14.png)

* 看一下服务列表里有没有mongodb 服务

```js
systemctl list-unit-files --type=service
```

返回如下，发现有这个服务，但是没有跑起来：

![服务列表](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/15.png)

* 好吧，想着执行下面的命令，让mongodb 服务跑起来

```js
systemctl start mongodb.service
```

以为成功了，但很不幸，失败了，报错如下：

![错误](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/16.png)

**提示命令后面 加 -l 以显示更多的错误信息，则在上述命令后追加 -l   如下所示：**

![错误](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/17.png)

提示错误：<font color=#DC143C  face="黑体"> mongodb.service lacks both ExecStart= and ExecStop= setting. Refusing, </font>这个错误又是什么鬼玩意！？

继续搜索解决方案中....,最终参考了这篇链接解决了问题： 

[mongodb.service lacks both ExecStart](https://blog.csdn.net/weixin_39198406/article/details/83656943)

* 首先用命令 打开这个mongodb 服务的配置文件：

```js
vim /etc/systemd/system/mongodb.service
```

* 将以下内容粘贴到该文件中，进行保存，如下：
![配置文件代码](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/18.png)

<table>
    <tr>
        <td bgcolor=#FFD700>
    超级要注意的点！！

    * 红色和蓝色圈出来的文件，user当时登录为root ,应该改为登录时的名字
    
    * 路径问题： 自己当时安装mongodb时，目录结构下的文件来写对应的路径和文件名！可能与图片上的一样，可能不一样（我的就不一样，这里建议使用xftp确认下自己的这两个文件具体路径是在什么地方）

     我的mongod 文件所在路径通过查看确认，是在： /usr/local/mongodb/bin/mongo 

       </td>
   </tr>
</table>


![mongod 文件路径位置](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/19.png)

<table>
    <tr>
        <td bgcolor=#FFD700>
            我的mongod.conf 文件所在路径通过查看确认，是这样的： /etc/mongodb.conf
        </td>
    </tr>
</table>

![mongod.conf 文件路径位置](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/20.png)


**所以我最终的这个文件代码就是：**

![mongodb.service 配置文件代码](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/21.png)


* 保存后，依次执行下面的命令

```js
systemctl enable mongodb.service
```

提示：
![提示](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/22.png)

```js
systemctl daemon-reload
```

注意这里中间的名称 **mongodb** 是根据这个上述查看 服务列表里有没有mongodb 服务来的，叫啥写啥（蓝色圈出来的内容）

![提示](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/23.png)

```js
service mongodb start
```

提示如下，即启动成功：

![提示](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/24.png)

再次查看服务列表下mongodb服务的运行状态，输入命令：

```js
systemctl list-unit-files --type=service
```

返回如下，已由static 变为enabled状态了，即启动成功
![提示](https://wrapper-1258672812.cos.ap-chengdu.myqcloud.com/19-8-16/25.png)

而且 **因为每次都是手动开启mongodb,每次关闭后，又要手动启动，很不方便，所以设置其为永久启动，敲以下命令：**

```js
systemctl enable mongodb
```







