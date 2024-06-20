### gitbook 从入门到放弃

开始想搭建个本地浏览 md 的电子书，选择了 gitbook。

按照[官网文档](https://developer.gitbook.com/getting-started/development)，安装`@gitbook/cli`，然后`gitbook auth`，到`app.gitbook.com`登录账号。
结果网站被墙了，小问题，翻墙登录，拿到 token

`gitbook auth yourToken`

`gitbook new yourProject` 创建个文件夹。

`gitbook dev yourSpaceId` 在这一步，一直报错npm error Node.js v20.14.0

折腾好久，去github也只看到对应node版本 18以上。

还是个企业版，操作要翻墙。

直接放弃，转为使用[honkit](https://github.com/honkit/honkit)
