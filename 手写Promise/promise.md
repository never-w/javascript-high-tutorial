# Promise 主题

首先我们先看一个面试题：

```js
Promise.resolve()
  .then(() => {
    console.log(0)
    return Promise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  })
// 该面试题打印结果是 0，1，2，3，4，5，6
```

上面面试题为什么打印出来的顺序是这样的呢，让我们来实现源码探索。

### 实现 Promise

- 我们先简单的实现一下 Promise 的基础功能：

```js
const promise = new Promise((resolve, reject) => {
  resolve("success")
  reject("err")
})

promise.then(
  (value) => {
    console.log("resolve", value)
  },
  (reason) => {
    console.log("reject", reason)
  }
)
// 输出 resolve success
```

- 分析一下基本原理：
  > 1. Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
  > 2. Promise 会有三种状态:`pending`,`fulfilled`,`rejected`
  > 3. 状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改
  > 4. Promise 中使用 resolve 和 reject 两个函数来更改状态；
  > 5. then 方法内部做但事情就是状态判断:如果状态是成功，调用成功回调函数,如果状态是失败，调用失败回调函数

#### 1.简易基础实现

```js
// 先定义三个常量表示状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
    }
  }

  then(onFulfilled, onRejected) {
    // 判断状态
    if (this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason)
    }
  }
}

// ------------------------------------------
//---------根据上面的实现跑demo----------------
const promise = new MyPromise((resolve, reject) => {
  resolve("success")
  reject("err")
})

promise.then(
  (value) => {
    console.log("resolve", value)
  },
  (reason) => {
    console.log("reject", reason)
  }
)
```

#### 2. 在 Promise 加入异步逻辑

```js
// 先定义三个常量表示状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // MyPromise 类中新增
  // 存储成功回调函数
  onFulfilledCallback = null
  // 存储失败回调函数
  onRejectedCallback = null

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
      // ==== 新增 ====
      // 判断成功回调是否存在，如果存在就调用
      this.onFulfilledCallback && this.onFulfilledCallback(value)
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
      // ==== 新增 ====
      // 判断失败回调是否存在，如果存在就调用
      this.onRejectedCallback && this.onRejectedCallback(reason)
    }
  }

  then(onFulfilled, onRejected) {
    // 判断状态
    if (this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason)
    } else if (this.status === PENDING) {
      // ==== 新增 ====
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallback = onFulfilled
      this.onRejectedCallback = onRejected
    }
  }
}

// ------------------------------------------
//---------根据上面的实现跑demo----------------
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success")
  }, 2000)
})

promise.then(
  (value) => {
    console.log("resolve", value)
  },
  (reason) => {
    console.log("reject", reason)
  }
)
// 等待 2s 输出 resolve success
```

#### 3. 实现 then 方法多次调用添加多个处理函数

```js
// 先定义三个常量表示状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 存储成功回调函数
  // onFulfilledCallback = null;
  onFulfilledCallbacks = []
  // 存储失败回调函数
  // onRejectedCallback = null;
  onRejectedCallbacks = []

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
      // ==== 新增 ====
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
      // ==== 新增 ====
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    // 判断状态
    if (this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason)
    } else if (this.status === PENDING) {
      // ==== 新增 ====
      // 因为不知道后面状态的变化，这里先将成功回调和失败回调存储起来
      // 等待后续调用
      this.onFulfilledCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
    }
  }
}

// ------------------------------------------
//---------根据上面的实现跑demo----------------
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success")
  }, 2000)
})

promise.then((value) => {
  console.log(1)
  console.log("resolve", value)
})

promise.then((value) => {
  console.log(2)
  console.log("resolve", value)
})

promise.then((value) => {
  console.log(3)
  console.log("resolve", value)
})
// 3
// resolve success
```

#### 4. 实现 then 链式调用

```js
// 先定义三个常量表示状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 存储成功回调函数
  // onFulfilledCallback = null;
  onFulfilledCallbacks = []
  // 存储失败回调函数
  // onRejectedCallback = null;
  onRejectedCallbacks = []

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
      // ==== 新增 ====
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
      // ==== 新增 ====
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    // ==== 新增 ====
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        // 获取成功回调函数的执行结果
        const x = onFulfilled(this.value)
        // 传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        onRejected(this.reason)
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })

    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if (x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

// ------------------------------------------
//---------根据上面的实现跑demo----------------
const promise = new MyPromise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve("success")
})

function other() {
  return new MyPromise((resolve, reject) => {
    resolve("other")
  })
}
promise
  .then((value) => {
    console.log(1)
    console.log("resolve", value)
    return other()
  })
  .then((value) => {
    console.log(2)
    console.log("resolve", value)
  })
```

#### 5. 链式调用是否返回自己

```js
// 先定义三个常量表示状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 存储成功回调函数
  // onFulfilledCallback = null;
  onFulfilledCallbacks = []
  // 存储失败回调函数
  // onRejectedCallback = null;
  onRejectedCallbacks = []

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
      // ==== 新增 ====
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
      // ==== 新增 ====
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value)
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject)
        })
      } else if (this.status === REJECTED) {
        onRejected(this.reason)
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })

    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    )
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

// ------------------------------------------
//---------根据上面的实现跑demo----------------
const promise = new MyPromise((resolve, reject) => {
  resolve("success")
})

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then((value) => {
  console.log(1)
  console.log("resolve", value)
  return p1
})

// 运行的时候会走reject
p1.then(
  (value) => {
    console.log(2)
    console.log("resolve", value)
  },
  (reason) => {
    console.log(3)
    console.log(reason.message)
  }
)
// 1
// resolve success
// 3
// Chaining cycle detected for promise #<Promise>
```
