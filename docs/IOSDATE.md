在ios系统内，浏览器时间校验比较严格，只有YYYY/MM/DD 的格式才会被认为是正常日期，否则是不正常日期，使用momentjs会报错

解决方案 替换YYYY-MM-DD 的格式为YYYY/MM/DD
```
date.replace(/-/g,'/')
```