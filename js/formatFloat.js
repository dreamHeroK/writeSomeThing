const formatFloat = (num, bitNum = 2) => {
  // 默认两位
  const retainNum = Math.pow(10, bitNum);
  return Math.round(num * retainNum) / retainNum;
};

console.log(formatFloat(123.55211, 1));
