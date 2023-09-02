# demo

```javascript
class Student {
  constructor(name, number) {
    this.name = name
    this.number = number
  }
  sayHi() {
    console.log(`
        姓名${this.name},学号${this.number}
    `)
  }
  study() {}
}

// 通过类 new 对象/实例
const xialuo = new Student('夏洛', 100)

console.log(xialuo.name)
console.log(xialuo.number)
xialuo.sayHi()
```

# 继承

- extends
- super

# demo2

```javascript
// 父类
class People {
  constructor(name) {
    this.name = name
  }
  eat() {
    console.log(`${this.name}eat something`)
  }
}
// 子类
class Student extends People {
  constructor(name, number) {
    super(name)
    this.number = number
  }
  sayHi() {
    console.log(`
        姓名${this.name},学号${this.number}
    `)
  }
}
// 子类
class Teacher extends People {
  constructor(name, major) {
    super(name)
    this.major = major
  }
  teach() {
    console.log(`
            ${this.name} teach ${this.major} 
        `)
  }
  eat() {
    console.log(`
            ${this.name} eat something
        `)
  }
}
// 通过类 new 对象/实例
const xialuo = new Student('夏洛', 100)

console.log(xialuo.name)
console.log(xialuo.number)
xialuo.sayHi()

// 通过类 new 对象/实例
const madongmei = new Teacher('马冬梅', '语文')

console.log(madongmei.name)
console.log(madongmei.major)
madongmei.teach()
madongmei.eat()
```
