##### 最简单的方式

使用`gh-pages`

操作流程
1. `npm install gh-pages --save-dev`
2. 新建`publish.js`
```
const ghPages = require("gh-pages");

ghPages.publish("_book", function (err) { // 设置发布内容为_book 文件夹，可自行调整发布目录
  console.log(err, "errr");
});

```
3. `package.json`配置
```
  "scripts": {
    "publish": "node publish.js"
  },
```
4. 执行`npm run publish`

5. github 仓库配置，打开仓库页面-->Settings-->Pages-->Branch-->选择gh-pages /(root) 文件夹-->save

6. 刷新页面 `Your site is live at https://yourGithubAccount.github.io/yourGitProjectName/` OK 完成了