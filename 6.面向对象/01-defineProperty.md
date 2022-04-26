```js
const obj = {
  name: "wyq",
}

Object.defineProperty(obj, "height", {
  value: 1.8,
})
```

### 属性描述符两种类型

- 数据属性描述符：`configurable`、`enumerable`、`value`、`writable`
- 访问器属性描述符：`configurable`、`enumerable`、`get`、`set`

### 数据属性描述符

- [[Configurable]]：表示属性是否可以通过 `delete` 删除属性，是否可以修改它的特性，或者是否可以将它修改为存取属性描述符。如果旧描述符将其 configurable 属性设置为 false，则该属性被认为是“不可配置的”，并且没有属性可以被改变（除了单向改变 writable 为 false）。当属性不可配置时，不能在数据和访问器属性类型之间切换。当试图改变不可配置属性（除了 value 和 writable 属性之外）的值时，会抛出 TypeError，除非当前值和新值相同。

> 当我们直接在一个对象上定义某个属性时，这个属性的[[Configurable]]为 `true`
> 当我们通过属性描述符定义属性时，这个属性的[[Configurable]]默认为 `false`

- [[Enumerable]]：表示属性是否可以通过 `for-in` 或者 `Object.keys()` 返回该属性。

  > 当我们直接在一个对象上定义某个属性时，这个属性的[[Enumerable]]为 `true`
  > 当我们通过属性描述符定义属性时，这个属性的[[Enumerable]]默认为 `false`

- [[Writable]]：表示是否可以修改属性的值。
  > 当我们直接在一个对象上定义某个属性时，这个属性的[[Writable]]为 `true`
  > 当我们通过属性描述符定义属性时，这个属性的[[Writable]]默认为 `false`
- [[value]]：属性的 `value` 值，读取属性时会返回该值，修改属性时，会对其进行修改。
  > 默认情况下这个值是 `undefined`

```js
const obj = {
  name: "wyq",
  age: 24,
}

Object.defineProperty(obj, "address", {
  value: "重庆市",
  configurable: false, // 这样设置它为false时，不能被 delete删除该属性，且后面再也不能设置其他属性和它为true
  enumerable: true, // 是否可以枚举的
  writable: true, // 该属性的值是否可以被修改
})
```

### 访问器属性描述符

```js
// 隐藏某一个私有属性不希望直接被外界使用和赋值
// 如果我们希望截获某一个属性它访问和设置值的过程时，也会使用访问器属性描述符
const obj = {
  name: "wyq",
  age: 24,
  _address: "重庆市",
}

Object.defineProperty(obj, "address", {
  enumerable: true,
  configurable: true,
  get() {
    return this._address
  },
  set(value) {
    this._address = value
  },
})
```
