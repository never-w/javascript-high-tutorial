```js
var str = "var message = "wyq";console.log(message);"
eval(str)
```

eval 语句执行字符串代码。

### eval 的缺点：

- 可读性比较差
- eval 是执行字符串，很容易被拿到篡改，被攻击服务器
- eval 不能被 v8 引擎优化的
