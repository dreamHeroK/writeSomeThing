const request = require("request");
const MyPromise = require("./myPromise");
// 我们先用 Promise 包装下三个网络请求
// 请求成功时 resolve 这个 Promise
// const request1 = function () {
//   const promise = new Promise((resolve) => {
//     request("https://github.com/", function (error, response) {
//       if (!error && response.statusCode == 200) {
//         resolve("request1 success");
//       }
//     });
//   });

//   return promise;
// };

// const request2 = function () {
//   const promise = new Promise((resolve) => {
//     request("https://github.com/", function (error, response) {
//       if (!error && response.statusCode == 200) {
//         resolve("request2 success");
//       }
//     });
//   });

//   return promise;
// };

// const request3 = function () {
//   const promise = new Promise((resolve) => {
//     request("https://github.com/", function (error, response) {
//       if (!error && response.statusCode == 200) {
//         resolve("request3 success");
//       }
//     });
//   });

//   return promise;
// };

// // 先发起 request1，等他 resolve 后再发起 request2，
// // 然后是 request3
// request1()
//   .then((data) => {
//     console.log(data);
//     return request2();
//   })
//   .then((data) => {
//     console.log(data);
//     return request3();
//   })
//   .then((data) => {
//     console.log(data);
//   });

let myPromise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("myPromise1 success");
  }, 1000);
});

// myPromise1.then((data) => {
//   console.log(data);
// });

let myPromise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("myPromise2 reject");
  }, 2000);
});

// myPromise2.then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.log(err, "err");
//   }
// );

let myPromise3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("myPromise3 success");
  }, 2000);
});
let myPromise4 = new MyPromise((resolve, reject) => {
  request("https://github.com/", function (error, response) {
    if (!error && response.statusCode == 200) {
      resolve("myPromise4 success");
    }
  });
});
let myPromiseAll = MyPromise.all([myPromise3, myPromise4]);
myPromiseAll.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err, "err");
  }
);

MyPromise.race([myPromise1, myPromise2]).then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason);
  }
);

myPromise2.catch((err) => {
  console.log("myPromise2 catch", err);
});

let myPromise5 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("myPromise5 success");
  }, 2000);
});

let myPromise6 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("myPromise6 reject");
  }, 1000);
});

let myPromise7 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("myPromise7 success");
  }, 2000);
});

MyPromise.allSettled([myPromise5, myPromise6, myPromise7]).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err, "err");
  }
);
