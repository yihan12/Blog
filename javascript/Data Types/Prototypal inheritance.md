# 原型继承

> 原型继承是javascript中用于在对象中添加方法和属性的功能。它是一个对象可以继承另一个对象的属性和方法的方法。传统上，为了获取和设置对象的原型，我们使用Object.getPrototypeOf 和 Object.setPrototypeOf.

当谈到继承时，JavaScript 只有一种结构：对象。每个对象（object）都有一个私有属性指向另一个名为原型（prototype）的对象。原型对象也有一个自己的原型，层层向上直到一个对象的原型为 null。根据定义，null 没有原型，并作为这个原型链（prototype chain）中的最后一个环节。
