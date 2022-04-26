function createObj(name, age) {
  var o = {}
  o.name = name
  o.age = age
  o.eating = function () {
    console.log("吃东西")
  }

  return o
}
const person = createObj("wyq", 24)
console.log(person.__proto__.constructor.name)
