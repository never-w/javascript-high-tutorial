const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }

  status = PENDING
  value = null
  reason = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
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

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise #<Promise>"))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
