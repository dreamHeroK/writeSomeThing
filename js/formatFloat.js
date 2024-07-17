const formatFloat = (num, bitNum = 2) => {
  // 默认两位
  const retainNum = Math.pow(10, bitNum);
  return Math.round(num * retainNum) / retainNum;
};


let reg = new RegExp(/^[0-9]+(.[0-9]{1,2})?$/); // 正则表达式 校验是否两位小数
console.log(reg.test(123.55211));
console.log(formatFloat(123.55211, 1));
