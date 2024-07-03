####  vue 自定义hover指令

由于项目迭代更新，产品要求页面全局增加一个hover效果，可点击区域文字hover透明度调整以及点击区域背景色调整。

由于页面元素过多，一个一个实现费时费力，修改起来也费劲，直接就想到了使用vue directive 自定义指令实现。

实现方式：

`textHover.js` 指令核心代码

```
export default {
    bind(el, binding, vnode) {
        el.onmouseover = () => {
            el.style.opacity = '0.6';
        };
        el.onmouseout = () => {
            el.style.opacity = '1';
        };
    }
};
```

在使用到的页面内注册指令,注册代码：
```
import textHover from './textHover';
export default {
    ...
    directives: {
        textHover
    }
}
```

done！到这里文字颜色的指令就完成了，再到需要使用的地方直接使用即可。eg:
```
<template>
    <div>
        <div v-text-hover>
            我是hover效果
        </div>
    </div>
</template>
```