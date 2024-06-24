##### vue3 中设置 ref.value.style 失败

在uniapp中使用 vue3 时，通过 ref 访问 dom，再修改 dom 样式


```
<div ref="some"></div>

const some=ref(null)

mounted(){
    some.value.style.background='#f1f1f1';
}
```

发现这样始终修改不了，代码提示some.value.style is notdefined

改为内联样式修改

```
<div ref="some" :style="someStyle"></div>

const someStyle=ref({})

update(){
    someStyle.value={background:'#f1f1f1'};
}
```