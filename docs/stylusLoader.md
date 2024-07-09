#### stylus-loader 在 create-react-app 中的使用

由于 create-react-app 默认使用的 css-loader，sass-loader，并没有使用到 stylus-loader，所以需要手动配置 stylus-loader。

##### 操作步骤

1. 暴露出 create-react-app 的 webpack 配置文件 `npm run eject`
2. 安装 stylus,stylus-loader `npm i stylus stylus-loader --save-dev`
3. 修改 `config/webpack.config.js` 中的 `rules` 配置，添加 `stylus-loader`
   这里可以模仿代码之前存在的 sass-loader 配置

   ```
   const stylusRegex = /\.styl$/;
   const stylusModuleRegex = /\.module\.styl$/;

   ...
   // 跟在sass-loader配置后面就行
               {
              test:stylusRegex,
              exclude:stylusModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'icss',
                  },
                },
                'stylus-loader'
              ),
              sideEffects: true,
            },
            {
              test: stylusModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction
                    ? shouldUseSourceMap
                    : isEnvDevelopment,
                  modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'stylus-loader'
              ),
            },
   ```

4. 重启项目 `npm start`
5. 新建 `page.modlue.styl`

```
.card{
    backgroud-color: #f00;
}
```

6. 项目使用 `app.js`

```
import page from './page.module.styl';

function App() {
  return (
    <div className="App">
      <header className={page.card}>
      </header>
    </div>
  );
}
```

OK, 大功告成。Done
