1. 在 ios 系统内，浏览器时间校验比较严格，只有 YYYY/MM/DD 的格式才会被认为是正常日期，否则是不正常日期，使用 momentjs 会报错

解决方案 替换 YYYY-MM-DD 的格式为 YYYY/MM/DD

```
date.replace(/-/g,'/')
```

2. 在 android 系统内，项目代码 str.replaceAll("-","/") 会报错，not a funciton, 解决方案 使用 str.replace(/-/g,"/")正则实现
