### arguments 是传递给函数的参数的一个类数组对象(array-like)

```js
function foo() {
  console.log(arguments.length)
  console.log(arguments[0], arguments[1])
  console.log(arguments.callee) // 获取当前arguments所在的函数
}
foo(1, 2, 3, 4)
```

arguments 他是一个类数组，所以什么 forEach 和 map 都不能在它身上调用
