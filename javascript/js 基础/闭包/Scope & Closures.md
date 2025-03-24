# this 的不同应用场景，如何取值

1. 当做普通函数调用 （执行的上级作用域）
2. 使用 call、apply、bind（根据绑定的值）
3. 使用对象方法 （当前对象，延时（指向 window））
4. 在 class 方法中调用 （当前对象）
5. 箭头函数 （当前对象）

# 手写 bind 函数

```javascript
function fn1(a, b, c) {
  console.log(this)
  console.log(a, b, c)
  return 'this i fn1'
}
const fn2 = fn1.bind({ x: 100 }, 10, 20, 30)
const res = fn2()
// {x: 100}
// 10 20 30
console.log(res) // 'this i fn1'

Function.prototype.bind1 = function () {
  // 把参数拆解为数组
  const args = Array.prototype.slice.call(arguments)

  // 获取this(数组第一项)
  const t = args.shift()

  // fn1.bind(...)中的fn1
  const self = this
  // 返回一个函数
  return function () {
    return self.apply(t, args)
  }
}
const fn3 = fn1.bind1({ x: 100 }, 10, 20, 30)
const res3 = fn3()
// {x: 100}
// 10 20 30
console.log(res3) // 'this i fn1'
```

# 实际闭包场景

- 隐藏数据
- 做一个简单的 cache 工具

```javascript
function createCache() {
  const data = {}
  return {
    set: function (key, val) {
      data[key] = val
    },
    get: function (key) {
      return data[key]
    },
  }
}

const c = createCache()
c.set('a', 100)
console.log(c.get('a'))
```

# 作用域和自由变量

- 全局作用域
- 函数作用域
- 块级作用域

### 自由变量

1. 一个变量在当前作用域没有声明，但被使用的话
2. 向上级作用域，一层一层的向上查找，直到找到为止
3. 如果全局作用域都没找到则报错 xx is not defined

# 闭包

### demo1

函数作为返回值

```javascript
function create() {
  const a = 100
  return function () {
    console.log(a)
  }
}
const fn = create()
const a = 200
fn() //100
```

### demo2

函数作为参数传递

```javascript
function print(fn) {
  const a = 200
  fn()
}
const a = 100
function fn() {
  console.log(a)
}
print(fn) //100
```

**闭包：自由变量的查找，还在函数定义的地方，向上级作用域查找。**  
** 不是在执行的地方！！！！！**

# this
