const request = require("request");
// 我们先用 Promise 包装下三个网络请求
// 请求成功时 resolve 这个 Promise
const request1 = function () {
  const promise = new Promise((resolve) => {
    request("https://github.com/", function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve("request1 success");
      }
    });
  });

  return promise;
};

const request2 = function () {
  const promise = new Promise((resolve) => {
    request("https://github.com/", function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve("request2 success");
      }
    });
  });

  return promise;
};

const request3 = function () {
  const promise = new Promise((resolve) => {
    request("https://github.com/", function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve("request3 success");
      }
    });
  });

  return promise;
};

// 先发起 request1，等他 resolve 后再发起 request2，
// 然后是 request3
request1()
  .then((data) => {
    console.log(data);
    return request2();
  })
  .then((data) => {
    console.log(data);
    return request3();
  })
  .then((data) => {
    console.log(data);
  });
