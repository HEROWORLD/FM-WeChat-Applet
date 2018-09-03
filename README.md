# FM-WeChat-Applet
## 项目设计文件

### 小程序没有正式上线,因为是FM性质，需要资质，个人申请的小程序审核无法通过

### 小程序界面是自己设计的，不是很专业，有需要可自行下载PSD[百度云](https://pan.baidu.com/s/1436yKdlicTLHxkpUf8SmLA)

### 页面效果展示
<image src="https://ws1.sinaimg.cn/large/a9300052gy1fuwsab73zfj20ku112q6q.jpg" width="187px;" alt="列表页"><image src="https://ws1.sinaimg.cn/large/a9300052gy1fuws8qtibcj20ku112wgb.jpg" width="187px;" alt="播放页"><image src="https://ws1.sinaimg.cn/large/a9300052gy1fuwsaa9rdcj20ku1120vc.jpg" width="187px;" alt="个人中心页"><image src="https://ws1.sinaimg.cn/large/a9300052gy1fuwsaakjgvj20ku112wi4.jpg" width="187px;" alt="主题页">
> 设计文件的图标来自于[Iconfont](http://www.iconfont.cn/),在此致谢，如果侵犯到您的合法权益，请联系我，我将第一时间予以删除。
  
##  项目文件

### 项目采用小程序原生语法和组件，未采用其他的第三方框架，未使用小程序的Tabbar进行页面切换，大多数的业务逻辑均在page/player/player.js中完成，封装了一些基本的数据请求加载方法，提交用户数据需登录服务器验证token。

### [服务器API文档](https://shimo.im/docs/K5p50BheJtsnvEic/) 

#### 播放器组件的实现利用微信小程序API: wx.getBackgroundAudioManager()实现 [详情参考](https://developers.weixin.qq.com/miniprogram/dev/api/getBackgroundAudioManager.html)

#### 具体业务逻辑请参考page/player/player.js

### TODO
+ 评论功能
+ 分享卡片生成功能（需正式上线才能生成带有页面参数的二维码，目前暂时搁置）
