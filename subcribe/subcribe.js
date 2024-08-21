class Event {
  constructor() {
    this.events = {};
  }
  addListener(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  emit(eventName, ...args) {
    let callbacks = this.events[eventName];
    if (!callbacks || !callbacks.length) {
      return;
    }
    this.events[eventName].forEach((callback) => {
      callback(...args);
    });
  }
  removeListener(eventName, callback) {
    let callbacks = this.events[eventName];
    if (!callbacks || !callbacks.length) {
      return;
    }
    this.events[eventName] = callbacks.filter((item) => {
      return item !== callback;
    });
  }
}

module.exports = new Event();
