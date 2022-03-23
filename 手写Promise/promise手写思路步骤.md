### 思路步骤

- 先实现最基本的 `promise`

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
```

- 在 `promise` 加入异步实现

```js
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
```

- 多个同层级的 `then` 实现，一视同仁嘛

```js
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
```

- 实现 `then` 方法的链式调用

```js
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

- `then` 方法链式调用返回的 promise 不能是它自己，和必须在返回的 `promise` 初始化完成，所以加入 `queueMicrotask` 微任务

```js
const promise = new Promise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then((value) => {
  console.log(value)
  return p1
})

// 等待初始化完成
function resolvePromise(promise2, x, resolve, reject) {} // resolvePromise(promise2, x, resolve, reject); ReferenceError: Cannot access 'promise2' before initialization
```

- 执行器加入错误捕获 和 then 执行的错误捕获 和 fulfilled 状态下的处理以及错误处理

- then 中的参数变为可选参数

```js
const promise = new Promise((resolve, reject) => {
  resolve(100)
})

promise
  .then()
  .then()
  .then()
  .then((value) => console.log(value))
```

- resolve 和 reject 的静态方法的调用实现

```js
MyPromise.resolve()
  .then(() => {
    console.log(0)
    return MyPromise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })
```
