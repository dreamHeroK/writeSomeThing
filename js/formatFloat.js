const formatFloat = (num, bitNum = 2) => {
  // 默认两位
  const retainNum = Math.pow(10, bitNum);
  return Math.round(num * retainNum) / retainNum;
};

const getPercent = (decimal) => {
  let percent = decimal * 100;

  let percentStr = percent % 1 === 0 ? percent.toString() : percent.toFixed(2);

  if (percentStr.includes(".")) {
    percentStr = percentStr.replace(/\.?0+$/, "");
  }
  return percentStr + "%";
};

let reg = new RegExp(/^[0-9]+(.[0-9]{1,2})?$/); // 正则表达式 校验是否两位小数
console.log(reg.test(123.55211));
console.log(formatFloat(123.55211, 1));
