修改屎山代码遇到个问题。

通过`v-if`设置组件条件渲染在设置了一次后，第二次再触发时间，提示node节点不存在

看了半天代码页也没发现什么原因造成的。

后面一条条属性删除，删除了一个没用到的`ref`属性解决了。
后面增加一个随机`ref`又可以成功渲染。
查看gitlog，还原到之前的代码,发现是这个哥们把`ref`名和组件名一致了。
问题代码
```
<componentName ref="slideVerification" />

import componentName from './componentName.vue'
```

解决方案，修改ref属性或修改组件名