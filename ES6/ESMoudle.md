### js模块化所解决问题（ESModule）：

- 命名冲突：一些变量和函数命名可能相同

- 文件依赖：一些需要从外部引入的文件数目、顺序

- js模块化将按照功能将一个软件切分成许多单独部分，每个部分为一个模块，然后再组装起来。分模块进行使用与维护，提高开发效率。

### js模块化发展过程(ESModule)：

**（1）script标签**

最早期的js文件加载方式，把每个文件看做一个模块，接口通常直接暴露在全局作用域（定义在window对象中）

缺点：  
* 加载顺序取决于script标签书写顺序
* 易污染全局作用域
* 各文件间的依赖关系较繁琐

**（2）CommonJS(主要)**

> 每个文件就是一个模块，有自己的作用域，
> 在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
> 在服务器端，模块的加载是运行时同步加载，
> 在浏览器端，模块需要提前编译打包处理。

```
//暴露模块:
module.exports = value 或 exports.xxx = value
//引入模块：
require(xxx)
//如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径
```
```
// module add.js
module.exports = function add (a, b) { return a + b; }
// main.js
var {add} = require('./math');
console.log('1 + 2 = ' + add(1,2);
```
**CommonJS加载模块是同步的，只有加载完成，才能执行后面的操作，造成一个重大的局限：不适用于浏览器**

同步加载对服务器端影响不大，可把所有的模块都存在本地硬盘，同步加载，等待时间就是读取硬盘时间。**但对于浏览器，因为模块都放在服务器端，等待时间取决于网速的快慢，长时间等待会造成浏览器处于”假死”状态**

浏览器端的模块不能采用同步加载，只能采用异步加载，便有了AMD

**（3）AMD**

> 非同步加载模块，允许指定回调函数，浏览器端一般采用AMD

优点： 

* （1）适合在浏览器环境中异步加载模块 
* （2）可以并行加载多个模块
```
//定义没有依赖的模块
define(function(){
    return 模块
})
```
```
//定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return 模块
})
```
```
//引入使用模块
require(['module1', 'module2'], function(m1, m2){
   //使用m1/m2
})
```
**（4）CMD**

专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行（延迟执行）
```
//定义没有依赖的模块
define(function(require, exports, module){
    exports.xxx = value
    module.exports = value
})
```
```
//定义有依赖的模块
define(function(require, exports, module){
    //引入依赖模块(同步)
    var module2 = require('./module2')
    //引入依赖模块(异步)
    require.async('./module3', function (m3) {
    })
    //暴露模块
    exports.xxx = value
})
```
```
//引入使用模块
define(function (require) {
    var m1 = require('./module1')
    var m4 = require('./module4')
    m1.show()
    m4.show()
})
```
CMD与AMD区别：

* 最大的区别是对依赖模块的执行时机处理不同，二者皆为异步加载模块

* AMD依赖前置，js可以方便知道依赖模块是谁，立即加载

* CMD就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块，延迟执行

**（4）UMD**

> 严格上说，UMD不能算是一种模块规范，它主要用来处理CommonJS、AMD、CMD的差异兼容，使模块代码能在不同的模块环境下都能正常运行，是模块定义的跨平台解决方案

**（5）ES6模块化(ESModule)**

> 设计思想：尽可能静态化，使得**编译时就能确定模块的依赖关系、输入和输出变量**，**CommonJS 和 AMD 模块，都只能在运行时确定**
```
//导出模块方式
var a = 0;
export { a }; //第一种
export const b = 1; //第二种 
let c = 2;
export default { c }//第三种 
let d = 2;
export default { d as e }//第四种，别名
```
```
//导入模块方式
import { a } from './a.js' //针对export导出方式，.js后缀可省略
import main from './c' //针对export default导出方式,使用时用 main.c
import 'lodash' //仅仅执行lodash模块，但是不输入任何值
```
**主要由export和import两个命令构成，export用于规定模块的对外接口，import用于输入其他模块提供的功能**

### CommonJS、AMD、ESMoudle的区别

#### CommonJS：主要用于服务端，同步加载模块，并不适合在浏览器环境  
**CommonJS加载模块是同步的，只有加载完成，才能执行后面的操作，造成一个重大的局限：不适用于浏览器**

同步加载对服务器端影响不大，可把所有的模块都存在本地硬盘，同步加载，等待时间就是读取硬盘时间。**但对于浏览器，因为模块都放在服务器端，等待时间取决于网速的快慢，长时间等待会造成浏览器处于”假死”状态**

浏览器端的模块不能采用同步加载，只能采用异步加载，便有了AMD

#### AMD：在浏览器中异步加载模块，且可并行加载多个模块，但开发成本相对高，代码阅读和书写较困难，模块定义方式语义不顺畅

#### CMD：与AMD相似，都用于浏览器，依赖就近，延迟执行，很容易在Node.js中运行

#### ES6模块化：异步加载，有一个独立的模块依赖的解析阶段，实现相对简单，浏览器和服务器通用模块解决方案

**编译时就能确定模块的依赖关系、输入和输出变量**


