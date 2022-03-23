### call 函数的实现

```js
Function.prototype.myCall = function (thisArg, ...arg) {
  thisArg = thisArg == null ? window : Object(thisArg)
  thisArg.fn = this
  const result = thisArg.fn(...arg)
  delete thisArg.fn
  return result
}
```

### apply 函数实现

```js
Function.prototype.myApply = function (thisArg, ...argArray) {
  thisArg = thisArg == null ? window : Object(thisArg)
  thisArg.fn = this
  // 判断是否传入参数，不这样做当你没有传入参数时会报错
  argArray = argArray ? argArray : []
  const result = thisArg.fn(argArray)
  delete thisArg.fn
  return result
}
```

### bind 函数实现

```js
Function.prototype.myBind = function (thisArg, ...argArray) {
  const _self = this
  return function (...arg) {
    return _self.myCall(thisArg, ...[...argArray, ...arg])
  }
}
```
