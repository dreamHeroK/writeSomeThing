#### 背景

在clone以前的项目时，安装依赖的情况下，经常会出现gyp的错误，导致安装失败。

比如：

1. python 未安装或python版本问题
2. visual studio 未安装或版本问题
3. 其他

#### 出现原因

1. 安装node-sass时，会自动安装node-gyp，而node-gyp会自动安装python，而python的安装需要安装visual studio，而visual studio的安装需要到官网下载。
2. 更加麻烦的是，node-sass需要和你的node版本对应，这一点需要去npm对应的页面查看依赖对应node版本.[传送门](https://www.npmjs.com/package/node-sass)
   

#### 解决方案

按照一下步骤安装

1. 安装[python](https://www.python.org/)
2. 安装[visual studio](https://visualstudio.microsoft.com/zh-hans/) 请确保你安装的是社区版，并且是C++的桌面开发环境
3. 安装node-sass `npm install node-sass` 下载对应node版本的node-sass版本
4. 安装完成


#### 完结撒花

❀❀❀                                          




