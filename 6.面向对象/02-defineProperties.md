### 定义对象多个属性

```js
var o = {
  _age: 24,
}

Object.defineProperties(o, {
  name: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "wyq",
  },
  age: {
    configurable: false,
    enumerable: false,
    get() {
      return this._age
    },
    set(v) {
      this._age = v
    },
  },
})
```

```js
var o = {
  _age: 24,
  //   get age() {
  //     return this._age
  //   },
  //   set age(v) {
  //     this._age = v
  //   },
}

Object.defineProperties(o, {
  name: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "wyq",
  },
  age: {
    configurable: true,
    enumerable: true,
    get() {
      return this._age
    },
    set(v) {
      this._age = v
    },
  },
})

// age: {
//     configurable: true,
//     enumerable: true,
//     get() {
//       return this._age
//     },
//     set(v) {
//       this._age = v
//     },
//   },
// 两者等价
//   get age() {  等价下面的 defineProperties里面的age
//     return this._age
//   },
//   set age(v) {
//     this._age = v
//   },
```
