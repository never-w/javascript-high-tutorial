```js
function foo() {
  console.log(this)
}

foo() // 指向window

const obj = {
  name: "wyq",
  fn: foo,
}
obj.fn() // 指向obj

foo.call("wyq") // 指向 wyq字体串
```

#### this 指向有类型：

- 绑定一：默认绑定
- 绑定二：隐士绑定
- 绑定三：显示绑定
- 绑定四：new 绑定

#### 默认绑定

函数独立调用

```js
function foo() {
  console.log(this)
}
foo() // 这样就是 独立调用 this指向window

function foo() {
  console.log(this)
}
const obj = {
  fn: foo,
}
var bar = obj.fn()
bar() // 这种也是 函数独立调用 this指向window
```

#### 隐士绑定

```js
function foo() {
  console.log(this)
}
const obj = {
  fn: foo,
}

obj.fn() // 这种就是隐士绑定

(obj.fn)() = obj.fn() // 这样是js规定的他们this指向都是 obj
```

#### 显示绑定

使用 call 和 apply、bind 改变函数 this 的方法这样叫显示绑定方法

```js
function foo() {
  console.log(this)
}

foo.call("wyq") // this指向 “wyq”
foo.apply("abc") // this指向 “abc”
foo.bind("ddd")() // this指向 “ddd”
```

#### new 绑定

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
const p1 = new Person("wyq", 24) // 这样通过构造函数创造出来的方式，this指向 p1 这个 new出来的对象
const p2 = new Person("gyf", 24) // this指向 p2 对象
```
