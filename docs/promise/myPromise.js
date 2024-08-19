// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  this.status = PENDING; // 初始状态为pending
  this.value = null; // 初始化value
  this.reason = null; // 初始化reason

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
    realOnFulfilled(this.value);
  }
  if (this.status === REJECTED) {
    realOnRejected(this.reason);
  }
};
