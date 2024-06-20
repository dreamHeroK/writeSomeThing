JS 保留小数并四舍五入方法，默认保留两位

```
 const formatFloat = (num, bitNum = 2) => { // 默认两位
    const retainNum = Math.pow(10, bitNum);
    return Math.round(num * retainNum) / retainNum;
};
```
