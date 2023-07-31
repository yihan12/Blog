# new运算符

> new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

### new 操作符做了什么
1. 在内存中**创建一个新对象**。
2. **将新对象内部的 __proto__ 赋值为构造函数的 prototype 属性**。
3. **将构造函数内部的 this 被赋值为新对象**（即 this 指向新对象）。
4. **执行构造函数内部的代码**（给新对象添加属性）。
5. **如果构造函数返回非空对象，则返回该对象。否则返回 this**。

### new 操作符的模拟实现
```javascript
function fakeNew() {
  // 创建新对象
  var obj = Object.create(null);
  var Constructor = [].shift.call(arguments);
  // 将对象的 __proto__ 赋值为构造函数的 prototype 属性
  obj.__proto__ = Constructor.prototype;
  // 将构造函数内部的 this 赋值为新对象
  var ret = Constructor.apply(obj, arguments);
  // 返回新对象
  return typeof ret === "object" && ret !== null ? ret : obj;
}

function Group(name, member) {
  this.name = name;
  this.member = member;
}

var group = fakeNew(Group, "hzfe", 17);
```
