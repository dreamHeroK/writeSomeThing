###  Baseline 2023 Newly available
#### 排序方法

[toSorted()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
语法

```
// 传入比较函数
toSorted(compareFn)
```

作用:根据 compareFn,排序数组元素，返回一个<font color=red>新的排好序的数组,不修改原数组</font>。

eg:

```
const numbers = [22, 11, 23, 31, 21];
const sortedNums = numbers.toSorted((a, b) => a - b);
console.log(sortedNums); // [11, 21, 22, 23, 31]
console.log(numbres); // [22, 11, 23, 31, 21]
```

此例按数值从小到大升序排列数组元素，<font color=red>返回新数组而不改变原数组 numbers</font>。

#### 反转数组

[toReversed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed)
语法

```
arr.toReversed()
```

作用:反转数组元素顺序,返回一个新的反转数组。
eg:

```
const arr = ['a', 'b', 'c'];
const reversedArr = arr.toReversed();
console.log(reversedArr); // ['c', 'b', 'a']
console.log(arr); // ['a', 'b', 'c']
```

反转数组而不修改原数组 arr。

#### 替换指定索引位置元素

[with()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/with)
语法

```
arr.with(index, newValue)
```

作用:用新值替换指定索引位置的元素，<font color=red>返回一个新的数组</font>。

eg:

```
const colors = ['red', 'blue', 'green'];
const newColors = colors.with(1, 'yellow');
console.log(newColors); // ['red', 'yellow', 'green'];
console.log(colors); // ['red', 'blue', 'green']
```

#### 查询符合条件的最后一个元素

[findLast()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)
语法:

```
arr.findLast(callback[, thisArg])
```

作用:从后向前查询符合条件的最后一个元素。
示例:

```
const nums=[11,22,33,45,22]
const num = nums.findLast(n => n>22);
console.log(num); // 45
```

支持传递 thisArg 参数，用于改变 this 指向。

```
// 定义一个对象
const obj = {
  testValue: 10
};

const nums = [5, 15, 10, 20];

// 使用对象作为thisArg
const lastMatch = nums.findLast(function(num){
    console.log(this,'this') // {testValue: 10}
  return num % this.testValue === 0;
}, obj);

console.log(lastMatch); // 20
```

#### 查询符合条件的最后一个元素索引

[findLastIndex()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)

语法：

```
arr.findLastIndex(callback[, thisArg])
```

作用:从后向前查找匹配元素的索引，而不是元素本身。

eg:

```
const nums = [1, 5, 3, 4, 2];

const num = nums.findLastIndex(n => n>2);

console.log(num); // 3-->4
```

#### 拼接方法

[toSpliced()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced)

toSpliced() 方法是 splice() 方法的复制版本。它返回一个新数组，并在给定的索引处删除和/或替换了一些元素。

语法：

```
arr.toSpliced(start, deleteCount, ...items)
```

eg:

```
const nums = [1, 2, 3];

// 在索引1位置插入'22','33'
const newNums = nums.toSpliced(1, 0, 22, 33);

console.log(newNums); // [1, 22, 33, 2, 3]
```
