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

```
function MyPromise(fn) {
  // ...省略前面代码...
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  // 定义resolve和reject方法
  // 当状态为pending时，调用resolve和reject方法，改变状态
  const resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => callback(this.value));
    }
  };
  const rejected = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((callback) => callback(this.reason));
    }
  };

  // ...省略前面代码...
  MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // ...省略前面代码...
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(() => realOnFulfilled(this.value));
    this.onRejectedCallbacks.push(() => realOnRejected(this.reason));
  }
};

}
```

上面这种暂时将回调保存下来，等条件满足的时候再拿出来运行让我想起了一种模式：订阅发布模式。我们往回调数组里面 push 回调函数，其实就相当于往事件中心注册事件了，resolve 就相当于发布了一个成功事件，所有注册了的事件，即 onFulfilledCallbacks 里面的所有方法都会拿出来执行，同理 reject 就相当于发布了一个失败事件。[更多订阅发布模式的原理可以看这里](https://dreamherok.github.io/writeSomeThing/subcribe/subcribe.html)。

#### 完成了一小步

到这里为止，其实我们已经可以实现异步调用了，只是 then 的返回值还没实现，还不能实现链式调用，我们先来玩一下：

```

const MyPromise = require("./myPromise");

let myPromise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("myPromise1 success");
  }, 1000);
});

myPromise1.then((data) => {
  console.log(data);
});

let myPromise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("myPromise2 reject");
  }, 2000);
});

myPromise2.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err,'err');
  }
);

```

上述代码输出如下图，符合我们的预期，说明到目前为止，我们的代码都没问题:

![图三](\images\promise\promise3.webp)

#### then 的返回值

根据规范 then 的返回值必须是一个 promise，规范还定义了不同情况应该怎么处理，我们先来处理几种比较简单的情况:

1. 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回原因 e。

```
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 省略其他代码
  if (this.status === FULFILLED) {
    let promise = new MyPromise((resolve, reject) => {
      try {
        realOnFulfilled(this.value);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  if (this.status === REJECTED) {
    let promise = new MyPromise((resolve, reject) => {
      try {
        realOnRejected(this.reason);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  if (this.status === PENDING) {
    let promise = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        try {
          realOnFulfilled(this.value);
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedCallbacks.push(() => {
        try {
          realOnRejected(this.reason);
        } catch (error) {
          reject(error);
        }
      });
    });
    return promise;
  }
};
```

2. 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值

```
// 这是个例子，每个realOnFulfilled后面都要这样写
  if (this.status === FULFILLED) {
    let promise = new MyPromise((resolve, reject) => {
      try {
        realOnFulfilled(this.value);
        resolve(this.value);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
```

3. 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因。需要注意的是，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve。改造代码如下:

```
  if (this.status === REJECTED) {
    let promise = new MyPromise((resolve, reject) => {
      try {
        realOnRejected(this.reason);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
```

4. 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 **Promise 解决过程**：`[[Resolve]](promise2, x)`。这条其实才是规范的第一条，因为他比较麻烦，所以我将它放到了最后。前面我们代码的实现，其实只要`onRejected`或者`onFulfilled`成功执行了，我们都要`resolve promise`。多了这条，我们还需要对`onRejected`或者`onFulfilled`的返回值进行判断，如果有返回值就要进行 **Promise 解决过程**。我们专门写一个方法来进行 Promise 解决过程。前面我们代码的实现，其实只要`onRejected`或者`onFulfilled`成功执行了，我们都要`resolve promise`，这个过程我们也放到这个方法里面去吧，所以代码变为下面这样，其他地方类似：

```
  if (this.status === FULFILLED) {
    let promise = new MyPromise((resolve, reject) => {
      try {
        let x = realOnFulfilled(this.value);
        resolvePromise(promise, x, resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
```

#### Promise 解决过程

现在我们该来实现 resolvePromise 方法了

```
function resolvePromise(promise, x, resolve, reject) {
  // 防止死循环
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 如果x是一个promise
  // 则将x的状态和值传递给promise
  if (x instanceof MyPromise) {
    x.then((y) => {
      resolvePromise(promise, y, resolve, reject);
    }, reject);
  }
  // 如果x是一个对象或者函数
  // 则将x的then方法赋值给then
  else if (typeof x === "object" || typeof x === "function") {
    if (x === null) {
      return resolve(x);
    }
    let then;
    try {
      then = x.then;
    } catch (error) {
      return reject(error);
    }
    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;
        // called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } // 否则直接将x的值传递给promise
  else {
    resolve(x);
  }
}
```

#### onFulfilled 和 onRejected 的执行时机

在规范中还有一条：`onFulfilled` 和 `onRejected` 只有在执行环境堆栈仅包含平台代码时才可被调用。这一条的意思是实践中要确保 `onFulfilled` 和 `onRejected` 方法异步执行，且应该在 `then` 方法被调用的那一轮事件循环之后的新执行栈中执行。所以在我们执行`onFulfilled` 和 `onRejected`的时候都应该包到 setTimeout 里面去。

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
  if (this.status === FULFILLED) {
    let promise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = realOnFulfilled(this.value);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return promise;
  }
  if (this.status === REJECTED) {
    let promise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = realOnRejected(this.reason);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return promise;
  }
  if (this.status === PENDING) {
    let promise = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = realOnFulfilled(this.value);
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            let x = realOnRejected(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });
    return promise;
  }
};
```

#### 测试我们的 Promise

我们使用 Promise/A+官方的测试工具[promises-aplus-tests](https://github.com/promises-aplus/promises-tests)来对我们的 `MyPromise` 进行测试，要使用这个工具我们必须实现一个静态方法 `deferred`，官方对这个方法的定义如下:

- deferred: 返回一个包含{ promise, resolve, reject }的对象
- promise 是一个处于 pending 状态的 promise
- resolve(value) 用 value 解决上面那个 promise
- reject(reason) 用 reason 拒绝上面那个 promise

我们实现代码如下：

```
MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
```

然后用 npm 将 promises-aplus-tests 下载下来，再配置下 package.json 就可以跑测试了:

```
  "scripts": {
    "test": "promises-aplus-tests myPromise"
  },
    "dependencies": {
    "promises-aplus-tests": "^2.1.2"
  }
```

这个测试总共 872 用例，我们写的 Promise 完美通过了所有用例:

![图四](\images\promise\promise4.webp)

#### 其他 Promise 方法

在 ES6 的官方 Promise 还有很多 API，比如：

- Promise.resolve

- Promise.reject

- Promise.all

- Promise.race

- Promise.prototype.catch

- Promise.prototype.finally

- Promise.allSettled

虽然这些都不在 Promise/A+里面，但是我们也来实现一下吧，加深理解。其实我们前面实现了 Promise/A+再来实现这些已经是小菜一碟了，因为这些 API 全部是前面的封装而已。

##### Promise.resolve

将现有对象转为 Promise 对象，如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为 fulfilled。

```
MyPromise.resolve = function (fn) {
  if (fn instanceof MyPromise) {
    return fn;
  }
  return new MyPromise((resolve) => {
    resolve(fn);
  });
};
```

##### Promise.reject

返回一个新的 Promise 实例，该实例的状态为 rejected。Promise.reject 方法的参数 reason，会被传递给实例的回调函数。

```
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};
```

##### Promise.all

该方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```
const p = Promise.all([p1, p2, p3]);
```

Promise.all()方法接受一个数组作为参数，p1、p2、p3 都是 Promise 实例，如果不是，就会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再进一步处理。当 p1, p2, p3 全部 resolve，大的 promise 才 resolve，有任何一个 reject，大的 promise 都 reject。

```
MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    let arr = [];
    let index = 0;
    let len = promises.length;
    function processData(i, data) {
      arr[i] = data;
      index++;
      if (index === len) {
        resolve(arr);
      }
    }
    promises.forEach((promise, i) => {
      MyPromise.resolve(promise).then(
        (data) => {
          processData(i, data);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};
```

##### Promise.race

用法：

```
const p = Promise.race([p1, p2, p3]);
```

该方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。上面代码中，只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

```
MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise) => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
};
```

##### Promise.prototype.catch

`Promise.prototype.catch`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

```

##### Promise.prototype.finally

`finally`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

```
MyPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => value);
    },
    (reason) => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason;
      });
    }
  );
};
```

##### Promise.allSettled

该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是 `fulfilled`还是`rejected`，包装实例才会结束。该方法由 ES2020 引入。该方法返回的新的 Promise 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。状态变成 fulfilled 后，Promise 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 Promise 实例的执行结果。

```
MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve, reject) => {
    let arr = [];
    let index = 0;
    let len = promises.length;
    function processData(i, data) {
      arr[i] = data;
      index++;
      if (index === len) {
        resolve(arr);
      }
    }
    promises.forEach((promise, i) => {
      MyPromise.resolve(promise).then(
        (data) => {
          processData(i, { status: FULFILLED, value: data });
        },
        (reason) => {
          processData(i, { status: REJECTED, reason: reason });
        }
      );
    });
  });
};
```

##### 完整代码
[https://github.com/dreamHeroK/writeSomeThing/blob/main/docs/promise/myPromise.js](https://github.com/dreamHeroK/writeSomeThing/blob/main/docs/promise/myPromise.js)

#### 总结

至此，我们的Promise就简单实现了，只是我们不是原生代码，使用的`setTimeout`模拟，不能做成微任务，如果一定要做成微任务的话，只能用其他微任务API模拟，比如`MutaionObserver`或者`process.nextTick`。下面再回顾下几个要点:

- Promise其实是一个发布订阅模式
- then方法对于还在pending的任务，其实是将回调函数`onFilfilled`和`onRejected`塞入了两个数组
- Promise构造函数里面的resolve方法会将数组`onFilfilledCallbacks`里面的方法全部拿出来执行，这里面是之前then方法塞进去的成功回调
- 同理，Promise构造函数里面的`reject`方法会将数组`onRejectedCallbacks`里面的方法全部拿出来执行，这里面是之前then方法塞进去的失败回调
- `then`方法会返回一个新的Promise以便执行链式调用
- `catch`和`finally`这些实例方法都必须返回一个新的Promise实例以便实现链式调用