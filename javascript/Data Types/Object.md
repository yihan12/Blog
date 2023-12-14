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

### 创建对象四种方法
- 使用构造函数
- 使用对象字面量
- 使用Object.create()方法创建对象
- 使用es6 Class

#### 使用构造函数
```javascript
function vehicle(name,maker,engine){
    this.name = name;
    this.maker = maker;
    this.engine = engine;
}

let car  = new vehicle('GT','BMW','1998cc');
// OUTPUT: vehicle {name: 'GT', maker: 'BMW', engine: '1998cc'}
// GT
// BMW
// 1998cc
console.log(car); 
console.log(car.name);
console.log(car.maker);
console.log(car['engine']);
```

```javascript
const o = new Object(); 
o.foo = 42; 
  
console.log(o); 
// { foo: 42 } 
```

#### 使用对象字面量
```javascript
let car = {
    name : 'GT',
    maker : 'BMW',
    engine : '1998cc'
};
console.log(car.name); //dot notation
console.log(car['maker']); //bracket notation
```

#### 使用Object.create() 
```javascript
const coder = {
    isStudying : false,
    printIntroduction : function(){
        console.log(`My name is ${this.name}. Am I studying?: ${this.isStudying}`);
    }
};
const me = Object.create(coder);
me.name = 'Mukul';
me.isStudying = true;
me.printIntroduction(); // My name is Mukul. Am I studying?: true
```

#### 使用ES6 Class
```javascript
class Vehicle {
  constructor(name, maker, engine) {
    this.name = name;
    this.maker =  maker;
    this.engine = engine;
  }
}
 
let car1 = new Vehicle('GT', 'BMW', '1998cc');
 
console.log(car1.name);  // 'GT'
car1.name = '123'
console.log(car1); // Vehicle {name: '123', maker: 'BMW', engine: '1998cc'}
console.log(car1.name);  // '123'
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
let obj1 = { 
    propfirst : "Name"
}  
// Output : Name 
console.log(obj1.propfirst)  
let obj2 = Object.create(obj1); 

// Output : Name 
console.log(obj2.propfirst); 

// Output : true. 
console.log(delete obj2.propfirst);  

// Output : Name     
console.log(obj2.propfirst);  

// Output : true     
console.log(delete obj1.propfirst);  

// Output : undefined   
console.log(obj2.propfirst);  
```
对比例1和例2不难发现，delete能删除本身的属性，但是不能删除继承的属性。删除调obj1的propfirst属性后，会影响到obj2的继承属性。

### 遍历对象
遍历对象的所有键：要遍历对象的所有现有可枚举键，我们可以在构造中使用for…in。值得注意的是，这允许我们只访问对象的可枚举属性（回想一下，可枚举是数据属性的四个属性之一）。例如，从Object.prototype继承的属性是不可枚举的。但是，从某处继承的可枚举属性也可以使用for… in构造来访问
```javascript
let person = { 
    gender : "male"
} 
  
let person1 = Object.create(person); 
person1.name = "Adam"; 
person1.age = 45; 
person1.nationality = "Australian"; 
  
for (let key in person1) { 
// Output : name, age, nationality, gender
    console.log(key);  
}    
console.log(person1, person) // person1的原型上会继承person的gender属性
```

### 对象的setter和getter

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};

console.log(person.fullName()) // 'John Doe'
const person2 = {
  firstName: "John",
  lastName: "Doe",
  get fullName() {
    return this.firstName + " " + this.lastName;
  }
};

console.log(person2.fullName) // 'John Doe'
```

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",
  language: "",
  set lang(lang) {
    this.language = lang;
  }
};

person.lang = "en";

console.log(person.language) // 'en'
```


