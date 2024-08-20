// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  this.status = PENDING; // 初始状态为pending
  this.value = null; // 初始化value
  this.reason = null; // 初始化reason
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

  try {
    fn(resolve, rejected);
  } catch (error) {
    rejected(error);
  }
}

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

MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

MyPromise.resolve = function (fn) {
  if (fn instanceof MyPromise) {
    return fn;
  }
  return new MyPromise((resolve) => {
    resolve(fn);
  });
};

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

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise) => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

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

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

module.exports = MyPromise;
