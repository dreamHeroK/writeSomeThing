##### 小程序包体压缩

众所周知，微信小程序上传版本是有对包体大小进行检测的，当主包内容大于2M 即2048k的情况，会上传失败。

如果进行包体压缩呢

1. 公司如果有cdn文件资源服务，把图片、音频、视频等资源直接上传到cdn，链接引用。
2. 没有cdn的情况下，对图片格式进行压缩，或者转为webp格式
3. 耗时比较大的改动，根据[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)，进行分包操作。
4. 使用[包分析器插件](https://www.npmjs.com/package/webpack-bundle-analyzer)或者微信开发者工具自带的包分析，分析分件大小，进行拆分


#### 欢迎补充 靴靴