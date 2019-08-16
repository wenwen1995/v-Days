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





