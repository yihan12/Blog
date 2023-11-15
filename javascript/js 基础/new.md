### new 运算符
● new 是一个运算符
● new 的作用，就是执行构造函数，返回一个实例对象
### new 的功能：
● 访问到 Function 构造函数里的函数
● 访问到 Function.prototype 中的属性
### new 做了什么：
1. 创建了一个全新的对象。
2. 这个对象会被执行[[Prototype]]（也就是__proto__）链接。
3. 生成的新对象会绑定到函数调用的this。
4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
5. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象。
### new 实现原理
使用 new 命令时，它后面的构造函数会执行以下操作：
1. 创建一个空的简单的 JavaScript 对象
2. 将空对象的原型，指向构造函数的 prototype 属性
3. 将当前函数内部的 this 绑定到空对象
4. 执行构造函数，如果没有返回对象，则返回 this，即新创建的对象
步骤 3 中，将新创建的对象作为了当前函数 this 的上下文，这也是为什么通过 new 创建实例时，构造函数内部的 this 指向创建的实例对象的原因。
### new 手写
```javascript
function objectFactory() {

  var obj = new Object(),//从Object.prototype上克隆一个对象

    Constructor = [].shift.call(arguments);//取得外部传入的构造器

  var F=function(){};
  F.prototype= Constructor.prototype;
  obj=new F();//指向正确的原型

  var result = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性

  return typeof result === 'object' ? result : obj;//确保构造器总是返回一个对象
};
```
● 用 new Object() 的方式新建了一个对象 obj
● 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
● 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
● 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
● 如果构造函数返回一个对象，那么我们也返回这个对象；否则，就返回默认值
### chatGpt
### 一
在 JavaScript 中，使用 new 关键字可以创建一个新的对象实例。new 的原理是通过调用构造函数来创建一个新的对象，并将该对象作为 this 绑定到构造函数中。然后，构造函数可以在该对象上添加属性和方法，最后返回该对象作为实例。
实现 new 的基本步骤如下：
1. 创建一个新的空对象
2. 将该空对象的原型指向构造函数的原型
3. 将构造函数的 this 绑定到新创建的对象
4. 执行构造函数中的代码，为新对象添加属性和方法
5. 如果构造函数有返回值且返回值是一个对象，则返回该对象；否则返回新创建的对象
以下是一个简单的实现 new 的例子：
```javascript
function myNew(constructor, ...args) {
  // 创建一个新的空对象
  const obj = {};
  // 将空对象的原型指向构造函数的原型
  Object.setPrototypeOf(obj, constructor.prototype);
  // 将构造函数的 this 绑定到新的对象
  const result = constructor.apply(obj, args);
  // 如果构造函数有返回值且返回值是一个对象，则返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

// 使用示例
function Person(name) {
  this.name = name;
}

const person = myNew(Person, 'Alice');
console.log(person.name); // 输出 "Alice"
```
通过以上实现，我们可以自己手动实现 new 的功能，从而更好地理解 new 的原理。

### 二
当然，还有其他方式来实现 new 的功能。下面是另一种实现方式：
```javascript
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// 使用示例
function Person(name) {
  this.name = name;
}

const person = myNew(Person, 'Alice');
console.log(person.name); // 输出 "Alice"
```
在这个实现中，我们使用 Object.create 方法来创建一个新对象，并将构造函数的原型指向该对象的原型。然后，我们再次将构造函数的 this 绑定到新的对象上，并执行构造函数中的代码。最后，根据构造函数的返回值返回相应的对象。
