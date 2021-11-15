## Transmission Web UI

### 介绍
本项目是基于 Transmission RPC 接口
并采用Vue框架编写了前端UI界面

主要功能有

-[x] 添加/删除种子
-[x] 查看/管理种子列表
-[x] 查看/管理下载文件及文件类型筛选/过滤
-[x] 管理文件优先级
-[x] 新增/删除Tracker
-[x] 控制下载/上传速度。
-[x] IP地理位置查询 ipinfo.io 支持

### 食用方法
首次使用时会进入登录界面

登录界面里设置Transmission RPC 的URL
![登录页面](./login.png)

如有身份验证勾选身份验证,并填写用户名和密码

如长时间无法获取种子信息时 点击最右上角退出重新进行登录操作

![主界面](./main.png)

如配置正确下次打开默认自动进入种子管理界面

本项目配合Chromium内核浏览器开发插件食用,插件项目[chrome-extensions](https://github.com/zpqsunny/chrome-extensions)

也可以单独编译后配合Web服务使用
```shell script
npm run build
```

如果您觉得这项目不错或对您有帮助请支持我

PayPal: zpqsunny#gmail.com

![](./src/assets/alipay.jpg)

![](./src/assets/weixin.jpg)

感谢
