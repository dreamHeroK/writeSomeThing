#### JS 保留小数并四舍五入方法，默认保留两位

```
 const formatFloat = (num, bitNum = 2) => { // 默认两位
    const retainNum = Math.pow(10, bitNum);
    return Math.round(num * retainNum) / retainNum;
};
```

#### JS 数字转百分比保留两位小数并去掉多余 0

```
const getPercent = (decimal) => {
  let percent = decimal * 100;

  let percentStr = percent % 1 === 0 ? percent.toString() : percent.toFixed(2);

  if (percentStr.includes(".")) {
    percentStr = percentStr.replace(/\.?0+$/, "");
  }
  return percentStr + "%";
};
```
