# 类型转换

### 强制类型转换

强制类型转换是将值从一种数据类型自动或隐式地转换为另一种数据类型（例如字符串转换为数字）。类型转换类似于强制类型转换，因为它们都将值从一种数据类型转换为另一种数据类型，只有一个关键的区别——强制类型转换是隐式的，而类型转换可以是隐式的，也可以是显式的。

```javascript
console.log(String(2 - true));  // '1'
console.log('56' === String(56));  // true

console.log(Number(prompt()));  // converts prompt value into a Number
console.log(Number('2350e-2'));  // '23.5'
console.log(Number('23') + 7);  // 30

console.log(Boolean('')); // false
console.log(Boolean(2) == true);  //true
```

### 隐式类型转换

隐式类型转换是将一种数据类型转换为另一种数据类型（确保在相同的数据类型之间完成操作），以便运算符或函数正常工作。

```javascript
// 隐式字符串转换
console.log('25' + 15); // '2515'

// 隐式Number转换
console.log(23 * '2');   // 46
console.log(23 - true);  // 22  // true is converted into 1
console.log(true - null); // 1
console.log(false + undefined);  // NaN  // undefined into NaN

const arr = [];
if(arr) { console.log('Hello World') };  // 'Hello World' 
```
