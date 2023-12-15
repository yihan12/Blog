# js的相等性判断
JavaScript 提供三种不同的值比较运算：

- ===——严格相等（三个等号）
- ==——宽松相等（两个等号）
- Object.is()

- IsLooselyEqual：==
- IsStrictlyEqual：===
- SameValue：Object.is()
- SameValueZero：被许多内置运算使用


# 双等号（==）

```javascript
const num = 0;
const big = 0n;
const str = "0";
const obj = new String("0");

console.log(num == str); // true
console.log(big == num); // true
console.log(str == big); // true

console.log(num == obj); // true
console.log(big == obj); // true
console.log(str == obj); // true
```

# 三等号（===）

# Object.is()
