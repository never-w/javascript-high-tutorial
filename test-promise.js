import MyPromise from "./promise.js"

const promise = new MyPromise((resolve, reject) => {
  resolve("success")
})

// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then((value) => {
  console.log(1)
  console.log("resolve", value)
  return p1
})

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
