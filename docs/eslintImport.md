今天遇到一个奇怪的问题，导致了应用白屏
在于修改代码时,有一段分环境的 uniapp 引用被删除掉了。
eg:

```
// #ifdef H5
// h5端
import Fly from 'xxxx';
// #endif

// #ifdef APP-PLUS
// app端
import Fly from 'xxxx';
// #endif

// #ifdef MP-WEIXIN
import Fly from 'xxx';
// #endif
```

在保存后，发现其他引用消失了

```
// #ifdef H5
// h5端
import Fly from 'flyio/dist/npm/fly';
// #endif

// #ifdef APP-PLUS
// app端
// #endif

// #ifdef MP-WEIXIN
// #endif
```

另外一个同事保存是 ok 的，于是查询资料[eslint 自动删除无效引用](https://segmentfault.com/q/1010000043953631),在这里查了一下对应资料，打开自己的 vscode 配置，搜索`eslint.codeActionsOnSave`,发现我的默认配置为

```
    "editor.codeActionsOnSave": {
        "source.organizeImports": "explicit" 
    },
```

修改`"source.organizeImports"`为"never"后，保存发现可以保存成功，于是在这个uniapp项目下增加本地vscode配置就ok了
