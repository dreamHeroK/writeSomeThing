### 发布订阅模式

发布-订阅模式（Publish-Subscribe Pattern）是一种软件架构设计模式，属于行为型设计模式，用于解耦生产者（发布者）和消费者（订阅者）之间的关系。在这种模式中，发布者负责发布消息，而订阅者则可以选择订阅他们感兴趣的消息类型。当有新消息发布时，订阅者将收到通知并执行相应的操作。

### 发布订阅模式的关键概念

1. 发布者（Publisher）：负责发布消息的组件。它们通常不知道谁会接收到消息，只是将消息发送给与之连接的消息队列或主题。
2. 订阅者（Subscriber）：订阅特定类型的消息，并在该类型的消息被发布时接收到通知。订阅者可以根据自己的需求选择订阅的消息类型。
3. 消息（Message）：由发布者发布并由订阅者接收的信息单元。消息可以是任何形式的数据，例如文本、JSON、XML 等。
4. 主题（Topic）：定义消息类型的逻辑通道或分类。发布者将消息发布到特定的主题，而订阅者则根据需要订阅特定的主题。
5. 消息队列（Message Queue）：用于在发布者和订阅者之间传递消息的中介服务。它可以确保消息的异步传输，并提供缓冲和路由消息的功能。
6. 事件总线（Event Bus）：类似于消息队列，用于在组件之间传递消息，但通常更为轻量级，通常在单个应用程序内部使用。

### 为什么要用发布订阅模式

1. 解耦性（Decoupling）： 发布-订阅模式实现了生产者和消费者之间的解耦，发布者和订阅者之间的通信通过中介（例如消息队列、事件总线）进行，彼此不直接依赖或知晓对方的存在，从而提高了系统的灵活性和可维护性。
2. 扩展性（Scalability）： 由于发布者和订阅者之间的解耦，系统可以更容易地扩展。新的发布者或订阅者可以被添加而不影响现有的组件。
3. 灵活性（Flexibility）： 发布-订阅模式允许任意数量的发布者和订阅者存在，并且支持多对多的通信。发布者和订阅者可以根据需求动态地添加、删除或修改，而不影响整个系统的运行。
4. 异步通信（Asynchronous Communication）： 由于发布者和订阅者之间的通信通常是通过消息队列或事件总线进行的，因此支持异步通信。这使得系统能够更高效地处理大量消息，并提高了响应性。
5. 松散耦合（Loose Coupling）： 发布-订阅模式降低了组件之间的耦合度，因为它们不需要直接知道彼此的存在或实现细节。这使得系统更容易理解、维护和扩展。

### 简单代码实现

```
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

```

### 使用示例

```
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

```

### Node.js 的 EventEmitter

`Node.js`的 `EventEmitter`设计模式跟我们前面的例子是一样的，不过他有更多的错误处理和更多的 API，源码在 GitHub 上都有：[https://github.com/nodejs/node/blob/main/lib/events.js](https://github.com/nodejs/node/blob/main/lib/events.js)。我们挑几个 API 看一下：

```
/**
 * Creates a new `EventEmitter` instance.
 * @param {{ captureRejections?: boolean; }} [opts]
 * @constructs {EventEmitter}
 */
function EventEmitter(opts) {
  EventEmitter.init.call(this, opts); // 构造函数
}
```

```
// If you're updating this function definition, please also update any
// re-definitions, such as the one in the Domain module (lib/domain.js).
EventEmitter.init = function(opts) {

  if (this._events === undefined ||
      this._events === ObjectGetPrototypeOf(this)._events) {
    this._events = { __proto__: null }; // 初始化事件
    this._eventsCount = 0;
    this[kShapeMode] = false;
  } else {
    this[kShapeMode] = true;
  }

  this._maxListeners = this._maxListeners || undefined;


  if (opts?.captureRejections) {
    validateBoolean(opts.captureRejections, 'options.captureRejections');
    this[kCapture] = Boolean(opts.captureRejections);
  } else {
    // Assigning the kCapture property directly saves an expensive
    // prototype lookup in a very sensitive hot path.
    this[kCapture] = EventEmitter.prototype[kCapture];
  }
};

```

`EventEmitter.init`里面也是做了一些初始化的工作，`this._events`跟我们自己写的 this.events 功能是一样的，用来存储订阅的事件。。这里需要注意一点，如果一个类型的事件只有一个订阅,`this._events`就直接是那个函数了，而不是一个数组，在源码里面我们会多次看到对这个进行判断，这样写是为了提高性能。

#### 订阅事件

EventEmitter 订阅事件的 API 是`on`和`addListener`，从源码中我们可以看出这两个方法是完全一样的：

[代码传送门](https://github.com/nodejs/node/blob/main/lib/events.js#L548)


```
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;
function _addListener(target, type, listener, prepend) {
  let m;
  let events;
  let existing;

  checkListener(listener);

  events = target._events; // 指向EventEmitter._events
  if (events === undefined) {
    events = target._events = { __proto__: null }; // 和init方法一样进行判断，提高性能
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ?? listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    events[type] = listener; // 单个listener直接注册,不使用数组对象
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener]; // 第二次判断，转成数组
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener); // 数组添加事件监听
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      const w = genericNodeError(
        `Possible EventEmitter memory leak detected. ${existing.length} ${String(type)} listeners ` +
        `added to ${inspect(target, { depth: -1 })}. MaxListeners is ${m}. Use emitter.setMaxListeners() to increase limit`,
        { name: 'MaxListenersExceededWarning', emitter: target, type: type, count: existing.length });
      process.emitWarning(w);
    }
  }

  return target;
}
```

#### 发布事件

[代码传送门](https://github.com/nodejs/node/blob/main/lib/events.js#L467)


`entEmitter`发布事件的 API 是`emit`，这个 API 里面会对"error"类型的事件进行特殊处理，也就是抛出错误：

```
EventEmitter.prototype.emit = function emit(type, ...args) {
  let doError = (type === 'error');

  const events = this._events; // 指向EventEmitter._events
  if (events !== undefined) {
    if (doError && events[kErrorMonitor] !== undefined)
      this.emit(kErrorMonitor, ...args);
    doError = (doError && events.error === undefined);
  } else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    let er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      try {
        const capture = {};
        ErrorCaptureStackTrace(capture, EventEmitter.prototype.emit);
        ObjectDefineProperty(er, kEnhanceStackBeforeInspector, {
          __proto__: null,
          value: FunctionPrototypeBind(enhanceStackTrace, this, er, capture),
          configurable: true,
        });
      } catch {
        // Continue regardless of error.
      }

      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event 错误类型事件处理，抛出错误
    }

    let stringifiedEr;
    try {
      stringifiedEr = inspect(er);
    } catch {
      stringifiedEr = er;
    }

    // At least give some kind of context to the user
    const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  const handler = events[type]; // 指向EventEmitter._events[type]

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    const result = handler.apply(this, args); // 单个事件监听 直接执行

    // We check if result is undefined first because that
    // is the most common case so we do not pay any perf
    // penalty
    if (result !== undefined && result !== null) {
      addCatch(this, result, type, args);
    }
  } else {
    const len = handler.length;
    const listeners = arrayClone(handler);
    for (let i = 0; i < len; ++i) {
      const result = listeners[i].apply(this, args); // 数组事件监听 遍历执行

      // We check if result is undefined first because that
      // is the most common case so we do not pay any perf
      // penalty.
      // This code is duplicated because extracting it away
      // would make it non-inlineable.
      if (result !== undefined && result !== null) {
        addCatch(this, result, type, args);
      }
    }
  }

  return true;
};
```

#### 取消订阅

[代码传送门](https://github.com/nodejs/node/blob/main/lib/events.js#L681)

`EventEmitter`里面取消订阅的 API 是`removeListener`和`off`，这两个是完全一样的。`EventEmitter`的取消订阅 API 不仅仅会删除对应的订阅，在删除后还会 emit 一个 r`emoveListener`事件来通知外界。这里也会对`this._events`里面对应的 type 进行判断，如果只有一个，也就是说这个`type`的类型是`function`，会直接删除这个键，如果有多个订阅，就会找出这个订阅，然后删掉他。如果所有订阅都删完了，就直接将`this._events`置空：

```
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      checkListener(listener);

      const events = this._events; // 指向EventEmitter._events
      if (events === undefined)
        return this;

      const list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        this._eventsCount -= 1;

        if (this[kShapeMode]) {
          events[type] = undefined; // 如果是shape模式，直接置空
        } else if (this._eventsCount === 0) {
          this._events = { __proto__: null }; //_events内不存在任何type，直接置空
        } else {
          delete events[type]; // 删除指定的type
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        let position = -1;

        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift(); // 如果是第一个，使用shift直接删除
        else {
          if (spliceOne === undefined)
            spliceOne = require('internal/util').spliceOne;
          spliceOne(list, position); // 如果不是第一个，使用splice删除
        }

        if (list.length === 1)
          events[type] = list[0];   // 只有一个订阅，数组转成函数

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
```

### 缺点：

- 消息传递顺序性难以保证（Ordering of Message Delivery）： 在某些情况下，由于消息传递是异步的，发布者发布消息的顺序与订阅者接收消息的顺序可能会不一致。这可能导致一些潜在的问题，特别是对于依赖于消息顺序的场景。
- 调试复杂性（Debugging Complexity）： 由于发布-订阅模式中的组件之间是松散耦合的，因此在调试时可能会更加复杂。当出现问题时，需要跟踪消息的传递路径以找到问题所在。
- 消息处理延迟（Message Processing Latency）： 由于发布-订阅模式通常是异步的，消息的传递和处理可能会引入一定程度的延迟。在某些实时性要求高的应用场景中，这可能会成为一个问题。
- 可能引入过多的订阅者（Potential Overuse of Subscribers）： 如果不加限制地使用发布-订阅模式，可能会导致系统中存在过多的订阅者，这可能会降低系统的性能和可维护性。因此，需要在设计时仔细考虑订阅者的数量和范围。

虽然发布-订阅模式具有一些缺点，但它的优点通常能够满足许多实际应用场景的需求，并且在大多数情况下，其优势远远超过了缺点。因此，在选择使用发布-订阅模式时，需要根据具体的需求和场景来权衡利弊。