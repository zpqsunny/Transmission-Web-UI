## Transmission Web UI

[![GitHub package.json version](https://img.shields.io/github/package-json/v/zpqsunny/Transmission-Web-UI)]()
[![GitHub](https://img.shields.io/github/license/zpqsunny/Transmission-Web-UI)]()
[![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/zpqsunny/Transmission-Web-UI/vue)]()
[![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/zpqsunny/Transmission-Web-UI/vuetify)]()
[![#](https://img.shields.io/badge/transmission-version%3E%3D2.4-success)]()
![visitors](https://visitor-badge.glitch.me/badge?page_id=zpqsunny.Transmission-Web-UI&left_color=green&right_color=red)

### 介绍
本项目是基于 Transmission RPC 接口
并采用Vue框架编写了前端UI界面

主要功能有

:heavy_check_mark: 添加/删除种子

:heavy_check_mark: 查看/管理种子列表

:heavy_check_mark: 查看/管理下载文件及文件类型筛选/过滤

:heavy_check_mark: 管理文件优先级

:heavy_check_mark: 新增/删除Tracker

:heavy_check_mark: 控制下载/上传速度。

:heavy_check_mark: IP地理位置查询 [ipinfo](https://ipinfo.io) 支持

:heavy_check_mark: **浏览器扩展支持选中/链接右键快速下载**

### 安装方法

#### 1.替换默认安装

进入 transmission web 目录 /transmission/web
```shell script
# 下载编译后文件
wget https://github.com/zpqsunny/Transmission-Web-UI/releases/download/v2.1.9/release-v2.1.9.zip
# 重命名原transmission 默认index
mv index.html index.html.bak
unzip release-v2.1.9.zip
# 如果想恢复原来的 直接将备份的index.html.bak 重命名回index.html
```
#### 2.浏览器扩展安装

[![](https://img.shields.io/chrome-web-store/v/kbpnojigbmopjjhokfbdeejefhniedlo)](https://chrome.google.com/webstore/detail/transmission-web-ui/kbpnojigbmopjjhokfbdeejefhniedlo)
[![](https://img.shields.io/chrome-web-store/rating/kbpnojigbmopjjhokfbdeejefhniedlo)](https://chrome.google.com/webstore/detail/transmission-web-ui/kbpnojigbmopjjhokfbdeejefhniedlo)
[![](https://img.shields.io/chrome-web-store/users/kbpnojigbmopjjhokfbdeejefhniedlo)](https://chrome.google.com/webstore/detail/transmission-web-ui/kbpnojigbmopjjhokfbdeejefhniedlo)

[![](https://img.shields.io/badge/dynamic/json?label=edge%20web%20store&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flffaomgjiombjbglofglnmckpghnobom)](https://microsoftedge.microsoft.com/addons/detail/transmission-web-ui/lffaomgjiombjbglofglnmckpghnobom)
[![](https://img.shields.io/badge/dynamic/json?label=rating&suffix=/5&query=%24.averageRating&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flffaomgjiombjbglofglnmckpghnobom)](https://microsoftedge.microsoft.com/addons/detail/transmission-web-ui/lffaomgjiombjbglofglnmckpghnobom)
[![](https://img.shields.io/badge/dynamic/json?label=users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flffaomgjiombjbglofglnmckpghnobom)](https://microsoftedge.microsoft.com/addons/detail/transmission-web-ui/lffaomgjiombjbglofglnmckpghnobom)

### 食用方法

首次使用时会进入登录界面

登录界面里设置Transmission RPC 的URL

![登录页面](./login.png)

如有身份验证勾选身份验证,并填写用户名和密码

如长时间无法获取种子信息时 点击最右上角退出重新进行登录操作

![主界面](./main.png)

如配置正确下次打开默认自动进入种子管理界面

如果您觉得这项目不错或对您有帮助请支持我

PayPal: zpqsunny#gmail.com

<img src="https://raw.githubusercontent.com/zpqsunny/Transmission-Web-UI/main/src/assets/alipay.jpg" height="450"><img src="https://raw.githubusercontent.com/zpqsunny/Transmission-Web-UI/main/src/assets/weixin.jpg" height="450">

**感谢!**

## Stargazers over time

[![Stargazers over time](https://starchart.cc/zpqsunny/Transmission-Web-UI.svg)](https://starchart.cc/zpqsunny/Transmission-Web-UI)

## 鸣谢

特别感谢 JetBrains 为开源项目(Open Source Projects)提供免费的 **WebStorm** 等 IDE 的授权

[<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/WebStorm.svg" alt="WebStorm logo.">](https://www.jetbrains.com/?from=zpqsunny)


