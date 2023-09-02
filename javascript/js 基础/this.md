# this

- 在 class 方法中调用
- 箭头函数

**this 取什么值，是在函数执行的时候决定的**  
** 不是在定义的时候决定！！！！！！！！！！！！**

### demo1

```javascript
function fn1() {
  console.log(this)
}
fn1() // window
fn1.call({ x: 100 }) //{x:100}
const fn2 = fn1.bind({ x: 200 })
fn2() // {x:200}

// call和bind都可以改变this的执行，call的话可以直接改变，bind会返回新的函数，还需要重新执行这个函数
```

### demo2

```javascript
const zhangsan = {
    name:'张三',
    sayHi(){
        // this指向当前对象
        console.log(this)
    }
    await(){
        setTimeout(function(){
            // this指向全局变量 window
            console.log(this)

        })
    }
}
const lisi = {
    name:'李四',
    sayHi(){
        // this指向当前对象
        console.log(this)
    }
    await(){
        setTimeout(()=>{
            // this指向当前对象
            console.log(this)
        })
    }
}
```

### demo3

```javascript
class People {
  constructor(name) {
    this.name = name
    this.age = 10
  }
  sayHi() {
    console.log(this)
  }
}
const lisi = new People('李四')
lisi.sayHi() // 当前对象
```
