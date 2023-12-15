# js的相等性判断
JavaScript 提供三种不同的值比较运算：

- ===——严格相等（三个等号）
- ==——宽松相等（两个等号）
- Object.is()

对应的四个相等算法：

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

// 对比NaN，+0，-0，{}
console.log('NaN' , NaN == NaN) // NaN false
console.log('+0,-0' , +0 == -0) // +0,-0 true
let a = {},b={},c=d={}
console.log('a,b' , a == b) // {} false
console.log('c,d' , c == d) // {} true
```

- 双等号（==）处理不同类型相同值时，返回true,例如（0,'0',0n,new String("0")）;
- 双等号（==）认为 +0等于-0
- 双等号（==）认为 NaN不等于NaN
- 双等号（==）认为{}不等于{}

# 三等号（===）

```javascript
const num = 0;
const big = 0n;
const str = "0";
const obj = new String("0");

console.log(num === str); // false
console.log(big === num); // false
console.log(str === big); // false

console.log(num === obj); // false
console.log(big === obj); // false
console.log(str === obj); // false

// 对比NaN，+0，-0，{}
console.log('NaN' , NaN === NaN) // NaN false
console.log('+0,-0' , +0 === -0) // +0,-0 true
let a = {},b={},c=d={}
console.log('a,b' , a === b) // {} false
console.log('c,d' , c === d) // {} true
```

- 三等号（===）处理不同类型相同值时，返回false,例如（0,'0',0n,new String("0")）;
- 三等号（===）认为 +0等于-0
- 三等号（===）认为 NaN不等于NaN
- 三等号（===）认为{}不等于{}

# Object.is()

```javascript
const num = 0;
const big = 0n;
const str = "0";
const obj = new String("0");

console.log(Object.is(num , str)); // false
console.log(Object.is(big , num)); // false
console.log(Object.is(str, big)); // false

console.log(Object.is(num , obj)); // false
console.log(Object.is(big , obj)); // false
console.log(Object.is(str , obj)); // false

// 对比NaN，+0，-0，{}
console.log('NaN' , Object.is(NaN , NaN)) // NaN true
console.log('+0,-0' , Object.is(+0 , -0)) // +0,-0 false
let a = {},b={},c=d={}
console.log('a,b' , Object.is(a , b)) // {} false
console.log('c,d' , Object.is(c ,d)) // {} true
```

- Object.is()处理不同类型相同值时，返回false,例如（0,'0',0n,new String("0")）;
- Object.is()认为 +0不等于-0
- Object.is()认为 NaN等于NaN
- Object.is()认为{}不等于{}

# sameValueZero

```javascript
function sameValueZero(x, y) {
  if (typeof x === "number" && typeof y === "number") {
    // x 和 y 相等（可能是 -0 和 0）或它们都是 NaN
    return x === y || (x !== x && y !== y);
  }
  return x === y;
}
const num = 0;
const big = 0n;
const str = "0";
const obj = new String("0");

console.log(sameValueZero(num , str)); // false
console.log(sameValueZero(big , num)); // false
console.log(sameValueZero(str, big)); // false

console.log(sameValueZero(num , obj)); // false
console.log(sameValueZero(big , obj)); // false
console.log(sameValueZero(str , obj)); // false

// 对比NaN，+0，-0，{}
console.log('NaN' , sameValueZero(NaN , NaN)) // NaN true
console.log('+0,-0' , sameValueZero(+0 , -0)) // +0,-0 true
let a = {},b={},c=d={}
console.log('a,b' , sameValueZero(a , b)) // {} false
console.log('c,d' , sameValueZero(c ,d)) // {} true
```

- sameValueZero处理不同类型相同值时，返回false,例如（0,'0',0n,new String("0")）;
- sameValueZero认为 +0等于-0
- sameValueZero认为 NaN等于NaN
- sameValueZero认为 {}不等于{}
