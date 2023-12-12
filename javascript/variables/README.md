# 概述

> 一个变量，就是一个用于存放数值的容器。这个数值可能是一个用于累加计算的数字，或者是一个句子中的字符串。变量的独特之处在于它存放的数值是可以改变的。

# 声明

## let、const和var

* var 语句 用于声明一个函数范围或全局范围的变量，并可将其初始化为一个值（可选）。(var关键字只能在为旧浏览器编写的代码中使用。)
* let 声明用于声明可重新赋值的块级作用域局部变量，并且可以将每个变量初始化为一个值（可选）。
* const 常量是块级范围的，非常类似用 let 语句定义的变量。但常量的值是无法（通过重新赋值）改变的，也不能被重新声明。()

```javascript
const price1 = 5;
const price2 = 6;
let total = price1 + price2;
```

## let、var、const的区别

|区别|var|let|const|
|----|----|----|----|
| 能否被重复声明 | 能 | 否 | 否 |
| 能否被重新赋值 | 能 | 能 | 否 |
| 作用域 | 全局作用域和函数作用域 | 块级作用域 | 块级作用域 |
| 变量是否被提升| 能，会被提升到顶部，任意地方能访问| 否（必须在使用前声明） | 否 （必须在使用前声明）|
| 重新声明的位置| 程序任何地方|可以在块级作用域外重新声明|不能重新声明|
 
# var的变量提升（Hoisting）

> 变量提升（Hoisting）被认为是，Javascript 中执行上下文（特别是创建和执行阶段）工作方式的一种认识。
> JavaScript只提升声明，而不是初始化。

```javascript
function codeHoist() {
  a = 10;
  let b = 50;
}
codeHoist();
 
console.log(a); // 10
console.log(b); // ReferenceError : b is not defined
```

在上面的代码中，我们创建了一个名为codeHoist（）的函数，其中我们有一个变量，我们没有使用let/var/const和一个let变量b声明。未声明的变量由javascript分配全局范围，因此我们可以将其打印在函数之外，但在变量b的情况下，范围受到限制，它在外部不可用，我们得到一个引用错误。

让我们在看看下面几个例子：
```
console.log(name); // undefined
```
```javascript
console.log(name); // Uncaught ReferenceError: name is not defined
let name = 'yihan12'
```
```javascript
function fun() {
  console.log(name);
  var name = 'Mukul Latiyan';
}
fun(); // undefined
```
```javascript
function fun() {
  let name;
  console.log(name,1);
  name = 'Mukul Latiyan';
  console.log(name,2);
}
fun();
// undefined 1
// Mukul Latiyan 2
```
我们知道用let关键字声明的变量是块范围的，而不是函数范围的，因此在提升时没有问题。

下面是let声明函数变量的例子
```javascript
fun() // Uncaught ReferenceError: fun is not defined
 
let fun = () =>{ // Declaring
    let name = 'Mukul Latiyan';
    console.log(name);
}
```

```javascript
fun(); // "Function is hoisted"
 
function fun() { // Declaring
  console.log("Function is hoisted");
}

```


# 命名变量：规则和最佳实践

- 第一个字符必须是字母或下划线（_）。您不能使用数字作为第一个字符。
- 变量名的其余部分可以包括任何字母、任何数字或下划线。您不能使用任何其他字符，包括空格、符号和标点符号。
- 与JavaScript的其余部分一样，变量名区分大小写。也就是说，名为Interest_Rate的变量被视为与名为interest_rate的变量完全不同的变量。
- 变量名的长度没有限制。
- 不能使用JavaScript的保留字之一作为变量名。所有编程语言都有一系列由语言内部使用的单词，这些单词不能用于变量名，因为这样做会导致混淆（或更糟）。还要注意，JavaScript也有许多关键字应该避免。


# 变量的作用域

作用域决定了变量的可访问性（可见性）。

JavaScript有3种类型：
- 块级作用域
- 函数作用域
- 全局作用域
