### 禁止对象继续添加属性（Object.preventExtensions）

```js
var obj = {
  name: "wyq",
  age: 24,
}
Object.preventExtensions(obj)
obj.height = 180
console.log(obj) // height没有添加进去，打印出来还是 name 和 age
```

### 禁止对象属性配置和删除（Object.seal）

```js
var obj = {
  name: "wyq",
  age: 24,
}

for (let k in obj) {
  Object.defineProperty(obj, k, {
    configurable: false,
    enumerable: true,
    writable: true,
    value: obj[k],
  })
}
// 等价下面的
Object.seal(obj)
```

### 禁止对象属性被修改（Object.freeze）

```js
var obj = {
  name: "wyq",
  age: 24,
}

for (let k in obj) {
  Object.defineProperty(obj, k, {
    configurable: false,
    enumerable: true,
    writable: false,
    value: obj[k],
  })
}
// 等价下面的
Object.freeze(obj)
```
