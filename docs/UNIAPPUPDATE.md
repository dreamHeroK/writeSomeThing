### uniapp基座版本升级

##### 背景

这个uniapp之间使用的android离线sdk打包方案，套了个android应用的壳。
最近需要升级基座版本，但是这个壳的基座版本是3.2.6，需要升级基座版本到4.0.8。


##### 操作步骤

1. 下载4.0.8的android sdk，部署到对应的libs目录下
2. 使用[@dcloudio/uvm](https://www.npmjs.com/package/@dcloudio/uvm)到对应的uniapp项目进行cli工具升级,执行命令 `npx @dcloudio/uvm@latest 4.08.2024040127 // 版本自行选择`
3. ok，依赖更新完成，执行打包操作
4. 上传到服务器


##### 遇到的问题

1. 下载完依赖后打包遇到一个`Syntax Error: Error: Node Sass version 6.0.1 is incompatible with ^4.0.0.`错误，确认了一下流水线配置的node版本为12，到[node-sass](https://github.com/sass/node-sass)查询了一下和node版本的对应关系，修改版本为4.14，重新下载依赖打包项目，OK，打包成功。

2. 更新完项目遇到语法错误,`Syntax Error: Error: PostCSS plugin postcss-uniapp-plugin requires PostCSS 8.`,通过 `npm ls postcss`查看 目前的`postcss`版本，都是 7.0.39,除了vue目录下的升级到了8版本，直接固定postcss版本 `npm i -D postcss@7`,再执行项目，正常启动无问题