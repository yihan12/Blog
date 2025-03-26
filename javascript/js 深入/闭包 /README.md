
# JavaScript 闭包详解

闭包是JavaScript中一个非常重要的概念，也是面试中经常被问到的主题。下面我将从多个角度详细解释闭包。

## 什么是闭包？

**闭包（Closure）**是指有权访问另一个函数作用域中的变量的函数。简单来说，当一个函数可以记住并访问其所在的词法作用域时，就产生了闭包，即使这个函数是在当前词法作用域之外执行。

## 闭包的形成条件

1. 函数嵌套
2. 内部函数引用了外部函数的变量
3. 内部函数在外部函数之外被调用

## 闭包的基本示例

```javascript
function outer() {
    var a = 10;
    function inner() {
        console.log(a); // 内部函数引用了外部函数的变量
    }
    return inner; // 返回内部函数
}

var closureFn = outer(); // outer执行完毕，理论上a应该被销毁
closureFn(); // 10 但仍然可以访问a
```

在这个例子中，`inner`函数就是一个闭包，它可以访问`outer`函数的变量`a`，即使`outer`已经执行完毕。

## 闭包的工作原理

JavaScript的作用域是词法作用域（静态作用域），函数的作用域在函数定义时就确定了。当函数执行时，它会创建一个执行环境（执行上下文），其中包含一个作用域链。闭包会保留对父函数作用域的引用，即使父函数已经执行完毕。

## 闭包的常见用途

### 1. 创建私有变量

```javascript
function createCounter() {
    let count = 0;
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
```

### 2. 实现函数柯里化

```javascript
function multiply(a) {
    return function(b) {
        return a * b;
    };
}

const double = multiply(2);
console.log(double(5)); // 10
console.log(double(10)); // 20
```

### 3. 模块模式

```javascript
var myModule = (function() {
    var privateVar = 'I am private';
    
    function privateMethod() {
        console.log(privateVar);
    }
    
    return {
        publicMethod: function() {
            privateMethod();
        },
        publicVar: 'I am public'
    };
})();

myModule.publicMethod(); // "I am private"
console.log(myModule.publicVar); // "I am public"
```

### 4. 事件处理和回调

```javascript
function setupButtons() {
    for (var i = 1; i <= 5; i++) {
        (function(index) {
            document.getElementById('btn-' + index)
                .addEventListener('click', function() {
                    console.log('Button ' + index + ' clicked');
                });
        })(i);
    }
}
```

## 闭包的优缺点

### 优点
1. 可以创建私有变量和方法，实现封装
2. 可以让变量长期驻留在内存中
3. 可以实现模块化编程

### 缺点
1. 内存消耗：闭包会使函数中的变量一直被引用，无法被垃圾回收机制回收，可能导致内存泄漏
2. 性能考量：闭包对脚本性能有负面影响，包括处理速度和内存消耗

## 闭包与内存泄漏

由于闭包会保留对作用域链的引用，因此如果不当使用可能会导致内存泄漏：

```javascript
function leakMemory() {
    var bigData = new Array(1000000).join('*');
    
    return function() {
        console.log('I have access to bigData');
    };
}

var leakyFn = leakMemory();
// 即使不再需要bigData，它也不会被回收
```

解决方法是在不需要时解除引用：

```javascript
leakyFn = null; // 释放内存
```

## 经典面试题

### 1. 循环中的闭包问题

```javascript
for (var i = 1; i <= 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, i * 1000);
}
// 输出六个6
```

解决方法：

1. 使用IIFE（立即执行函数表达式）：
```javascript
for (var i = 1; i <= 5; i++) {
    (function(index) {
        setTimeout(function() {
            console.log(index);
        }, index * 1000);
    })(i);
}
```

2. 使用let块级作用域：
```javascript
for (let i = 1; i <= 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, i * 1000);
}
```

## 总结

闭包是JavaScript中一个强大而有用的特性，它允许函数访问并记住其词法作用域，即使函数在其作用域之外执行。正确理解和使用闭包可以帮助我们编写更模块化、更安全的代码，但也要注意避免潜在的内存泄漏问题。

掌握闭包是成为JavaScript高级开发者的重要一步，它也是理解许多现代JavaScript框架和库的基础。
