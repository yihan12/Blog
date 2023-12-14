# 对象

> 在JavaScript中，对象为王。如果你理解对象，你就理解了JavaScript。

在JavaScript中，几乎“一切”都是对象。
- Booleans
- Numbers
- Strings
- Dates 
- Maths
- RegExp
- Arrays
- Functions
- Objects  

### 创建对象
```javascript

```

### 对象删除
对象只能删除本身属性，不能删除继承的属性。

例1：
```javascript
let obj1 = { 
    propfirst : "Name"
}  
  
// Output : Name 
console.log(obj1.propfirst);  
delete obj1.propfirst 
  
// Output : undefined 
console.log(obj1.propfirst);
```

例2：
```javascript

```
