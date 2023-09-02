# typeof 运算符

- 识别所有的值类型 （如：undefined\string\number\boolean\symbol）
- 识别函数 function
- 判断是否是引用类型（不可再细分）(null、object、array 等引用类型都返回 object)

# 深拷贝

```javascript
const obj1 = {
  name: '易函123',
  age: 28,
  address: {
    city: 'changsha',
  },
  arr: [1, 2, 3],
}
const obj2 = deepClone(obj1)
obj2.address.city = 'shenzhen'
obj2.arr[1] = 'shenzhen'
console.log(obj1.address.city)
console.log(obj1.arr[1])

function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) return obj
  let result
  if (obj instanceof Array) {
    result = []
  } else {
    result = {}
  }

  for (let key in obj) {
    // 保证key不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 递归
      result[key] = deepClone(obj[key])
    }
  }

  return result
}
```
