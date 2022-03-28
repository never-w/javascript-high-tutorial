### es5 的时候作用域

在 `es5` 的时候，一般情况下只有全局和函数会产生。

### with 语句可以形成作用域

```js
var obj = { name: "wyq" }

with (obj) {
  console.log(name) //
}
```
