`Promise` 几乎是面试必考点，所以我们不能仅仅会用，还得知道他的底层原理，学习他原理的最好方法就是自己也实现一个 Promise。所以本文会自己实现一个遵循 `Promise/A+`规范的 `Promise`。实现之后，我们还要用 `Promise/A+`官方的测试工具来测试下我们的实现是否正确，这个工具总共有 872 个测试用例，全部通过才算是符合 `Promise/A+`规范，下面是他们的链接：

Promise/A+规范: [https://github.com/promises-aplus/promises-spec](https://github.com/promises-aplus/promises-spec)

Promise/A+测试工具: [https://github.com/promises-aplus/promises-tests](https://github.com/promises-aplus/promises-tests)

### Promise 用法

Promise 的基本用法，网上有很多，我这里简单提一下，我还是用三个相互依赖的网络请求做例子，假如我们有三个网络请求，请求 2 必须依赖请求 1 的结果，请求 3 必须依赖请求 2 的结果，如果用回调的话会有三层，会陷入“回调地狱”，用 Promise 就清晰多了:

```
const request = require("request");

// 我们先用 Promise 包装下三个网络请求
// 请求成功时 resolve 这个 Promise
const request1 = function() {
const promise = new Promise((resolve) => {
request('https://github.com/', function (error, response) {
if (!error && response.statusCode == 200) {
resolve('request1 success');
}
});
});

return promise;
}

const request2 = function() {
const promise = new Promise((resolve) => {
request('https://github.com/', function (error, response) {
if (!error && response.statusCode == 200) {
resolve('request2 success');
}
});
});

return promise;
}

const request3 = function() {
const promise = new Promise((resolve) => {
request('https://github.com/', function (error, response) {
if (!error && response.statusCode == 200) {
resolve('request3 success');
}
});
});

return promise;
}

// 先发起 request1，等他 resolve 后再发起 request2，
// 然后是 request3
request1().then((data) => {
console.log(data);
return request2();
})
.then((data) => {
console.log(data);
return request3();
})
.then((data) => {
console.log(data);
})

```

上面的例子里面，then 是可以链式调用的，后面的 then 可以拿到前面 resolve 出来的数据，我们控制台可以看到三个 success 依次打出来:
![图一](\images\promise\promise1.webp)

### Promises/A+规范

通过上面的例子，其实我们已经知道了一个 promise 长什么样子，Promises/A+规范其实就是对这个长相进一步进行了规范。下面我会对这个规范进行一些讲解。

#### 术语

1. `promise`：是一个拥有 `then` 方法的对象或函数，其行为符合本规范
2. `thenable`：是一个定义了 `then` 方法的对象或函数。这个主要是用来兼容一些老的 Promise 实现，只要一个 Promise 实现是 thenable，也就是拥有`then`方法的，就可以跟 Promises/A+兼容。
3. `value`：指`resolve`出来的值，可以是任何合法的 JS 值(包括 undefined , thenable 和 promise 等)
4. `exception`：异常，在 Promise 里面用`throw`抛出来的值
5. `reason`：拒绝原因，是`reject`里面传的参数，表示`reject`的原因

#### Promise 状态

1. `pending`: 一个 promise**在 resolve 或者 reject 前就处于这个状态**。
2. `fulfilled`: 一个 promise 被 resolve 后就处于`fulfilled`状态，这个状态不能再改变，而且必须拥有一个**不可变**的值(`value`)。
3. `rejected`: 一个 promise 被 reject 后就处于`rejected`状态，这个状态也不能再改变，而且必须拥有一个**不可变**的拒绝原因(reason)。

注意这里的**不可变**指的是`===`，也就是说，如果`value`或者`reason`是对象，只要保证引用不变就行，规范没有强制要求里面的属性也不变。Promise 状态其实很简单，画张图就是:
![图二](\images\promise\promise2.webp)

#### then 方法

一个 promise 必须拥有一个`then`方法来访问他的值或者拒绝原因。then 方法有两个参数：

```
promise.then(onFulfilled, onRejected)
```

##### 参数可选

`onFulfilled` 和 `onRejected` 都是可选参数。

- 如果 `onFulfilled` 不是一个函数，则内部会被替换为一个恒等函数`(x) => x`，它只是简单地将兑现值向前传递。
- 如果 `onRejected` 不是一个函数，则内部会被替换为一个抛出器函数`(x) => { throw x; }`，它会抛出它收到的拒绝原因。

##### `onFulfilled` 特性

如果 `onFulfilled` 是函数：

- 当 `promise` 执行结束后其必须被调用，其第一个参数为 `promise` 的终值 value
- 在 `promise` 执行结束前其不可被调用
- 其调用次数不可超过一次

##### `onRejected` 特性

如果 onRejected 是函数：

- 当 `promise` 被拒绝执行后其必须被调用，其第一个参数为 `promise` 的原因 reason
- 在 `promise` 被拒绝执行前其不可被调用
- 其调用次数不可超过一次

##### 多次调用

`then` 方法可以被同一个 promise 调用多次

- 当 `promise` 成功执行时，所有 `onFulfilled` 需按照其注册顺序依次回调
- 当 `promise` 被拒绝执行时，所有的 `onRejected` 需按照其注册顺序依次回调

##### 返回

`then` 方法必须返回一个 `promise` 对象。

```
promise2 = promise1.then(onFulfilled, onRejected);
```

- 如果 `onFulfilled` 或者 `onRejected` 返回一个值 x ，则运行 **Promise 解决过程**：[[Resolve]](promise2, x)
- 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常`e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
- 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值
- 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因

规范里面还有很大一部分是**讲解 Promise 解决过程**的，光看规范，很空洞，前面这些规范已经可以指导我们开始写一个自己的 Promise 了，**Promise 解决过程**会在我们后面写到了再详细讲解。

### 自己写一个 Promise

我们自己要写一个 Promise，肯定需要知道有哪些工作需要做，我们先从 Promise 的使用来窥探下需要做啥:

1. 新建 Promise 需要使用 `new `关键字，那他肯定是作为面向对象的方式调用的，Promise 是一个类。[关于 JS 的面向对象更详细的解释可以看这篇文章](https://juejin.cn/post/6844904069887164423)。
2. 我们 `new Promise(fn)`的时候需要传一个函数进去，说明 Promise 的参数是一个函数
3. 构造函数传进去的 `fn` 会收到 `resolve` 和 `reject` 两个函数，用来表示 Promise 成功和失败，说明构造函数里面还需要 `resolve` 和 `reject` 这两个函数，这两个 函数的作用是改变 Promise 的状态。
4. 根据规范，promise 有 `pending`，`fulfilled`，`rejected` 三个状态，初始状态为 `pending`，调用 `resolve` 会将其改为 `fulfilled`，调用 `reject` 会改为 `rejected`。
5. promise 实例对象建好后可以调用 `then` 方法，而且是可以链式调用 `then` 方法，说明 `then` 是一个实例方法。[链式调用的实现这篇有详细解释](https://juejin.cn/post/6844904084571439118#heading-7)简单的说就是 `then` 方法也必须返回一个带 `then` 方法的对象，可以是 `this` 或者新的 `promise` 实例。

#### 构造函数

```
// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  this.status = PENDING; // 初始状态为pending
  this.value = null; // 初始化value
  this.reason = null; // 初始化reason
}
```

#### `resolve`和`reject`方法

根据规范，`resolve`方法是将状态改为`fulfilled`，`reject`是将状态改为`rejected`。

```
// 这两个方法直接写在构造函数里面
function MyPromise(fn) {
  // ...省略前面代码...

  // 定义resolve和reject方法
  // 当状态为pending时，调用resolve和reject方法，改变状态
  const resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };
  const rejected = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
    }
  };
}
```

#### 调用构造函数参数

最后将`resolve`和`reject`作为参数调用传进来的参数，记得加上`try`，如果捕获到错误就`reject`。

```
function MyPromise(fn) {
  // ...省略前面代码...
    try {
    fn(resolve, rejected);
  } catch (error) {
    rejected(error);
  }
}
```

#### then 方法

根据我们前面的分析，`then`方法可以链式调用，所以他是实例方法，而且规范中的 API 是 promise.then(onFulfilled, onRejected)，我们先把架子搭出来：

```
MyPromise.prototype.then = function(onFulfilled, onRejected) {}
```

那 then 方法里面应该干什么呢，其实规范也告诉我们了，先检查 onFulfilled 和 onRejected 是不是函数，如果不是函数就忽略他们，所谓“忽略”并不是什么都不干，对于 onFulfilled 来说“忽略”就是简单地将兑现值向前传递。，对于 onRejected 来说就是返回 reason，onRejected 因为是错误分支，我们返回 reason 应该 throw 一个 Error:

```
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  let realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== "function") {
    realOnFulfilled = (value) => value;
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  let realOnRejected = onRejected;
  if (typeof realOnRejected !== "function") {
    realOnRejected = (reason) => {
      throw reason;
    };
  }
};
```

参数检查完后就该干点真正的事情了，想想我们使用 Promise 的时候，如果 promise 操作成功了就会调用`then`里面的`onFulfilled`，如果他失败了，就会调用`onRejected`。对应我们的代码就应该检查下 promise 的 status，如果是`FULFILLED`，就调用`onFulfilled`，如果是`REJECTED`，就调用`onRejected`:

```

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // ...省略前面代码...

  if (this.status === FULFILLED) {
    realOnFulfilled(this.value);
  }
  if (this.status === REJECTED) {
    realOnRejected(this.reason);
  }
};

```

再想一下，我们新建一个 promise 的时候可能是直接这样用的:

```
new Promise(fn).then(onFulfilled, onRejected);
```

上面代码`then`是在实例对象一创建好就调用了，这时候`fn`里面的异步操作可能还没结束呢，也就是说他的`status`还是`PENDING`，这怎么办呢，这时候我们肯定不能立即调`onFulfilled`或者`onRejected`的，因为`fn`到底成功还是失败还不知道呢。那什么时候知道`fn`成功还是失败呢？答案是 fn 里面主动调`resolve`或者`reject`的时候。所以如果这时候`status`状态还是`PENDING`，我们应该将`onFulfilled`和`onRejected`两个回调存起来，等到`fn`有了结论，`resolve`或者`reject`的时候再来调用对应的代码。因为后面`then`还有链式调用，会有多个`onFulfilled`和`onRejected`，我这里用两个数组将他们存起来，等`resolve`或者`reject`的时候将数组里面的全部方法拿出来执行一遍：
