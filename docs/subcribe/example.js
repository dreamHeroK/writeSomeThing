const pubsub = require("./subcribe.js");

setTimeout(() => {
  pubsub.emit("1", "hello");
}, 1000);

pubsub.addListener("1", (data) => {
  setTimeout(() => {
    console.log("1", data);
    pubsub.emit("2", "world");
  }, 1000);
});

const listener2 = () => (data) => {
  setTimeout(() => {
    console.log("2", data);
    pubsub.emit("3", "!");
  }, 1000);
};
pubsub.addListener("2", listener2);

pubsub.addListener("2", (data) => {
  setTimeout(() => {
    console.log("3", data);
    console.log(pubsub.events,'events')
    pubsub.removeListener("2", listener2);
    console.log(pubsub.events,'events')
  }, 0);
});
