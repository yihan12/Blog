### 前端模块化历程

> CommonJS: 主要是 Node.js 使用，通过 require 同步加载模块，exports 导出内容。  
> AMD: 主要是浏览器端使用，通过 define 定义模块和依赖，require 异步加载模块，推崇依赖前置。  
> CMD: 和 AMD 比较类似，主要是浏览器端使用，通过 require 异步加载模块，exports 导出内容，推崇依赖就近。  
> UMD: 通用模块规范，是 CommonJS、AMD 两个规范的大融合，是跨平台的解决方案。  
> ES Moudle: 官方模块化规范，现代浏览器原生支持，通过 import 异步加载模块，export 导出内容。（兼容性）

ES Moudle优点：
- 支持同步/异步加载
- 语法简单
- 支持模块静态分析
- 支持循环引用



### 模块化及模块化规范

- 模块化可以解决代码之间的变量、函数、对象等命名的冲突/污染问题，良好的模块化设计可以**降低代码之间的耦合关系**，**提高代码的可维护性、可扩展性以及复用性。**

- 模块化规范的作用是为了规范 JavaScript 模块的定义和加载机制，以统一的方式导出和加载模块，降低学习使用成本，提高开发效率。

### 静态分析
> 静态程序分析（Static program analysis）是指在不运行程序的条件下，进行程序分析的方法。
简而言之，前文里提到的静态分析就是指在运行代码之前就可判断出代码内有哪些代码使用到了，哪些没有使用到。

### 模块化工程化：webpack
> webpack 同时支持 CommonJS、AMD 和 ESM 三种模块化规范的打包。根据不同规范 webpack 会将模块处理成不同的产物。

### 模块化工程化：Tree Shaking

> Tree Shaking 是一个通常用于描述移除 JavaScript 上下文中的未引用代码（dead-code）行为的术语。它依赖于 ES2015 中的 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。 Tree Shaking - MDN

简单来说，Tree Shaking 是一种依赖 ESM 模块静态分析实现的功能，它可以在编译时安全的移除代码中未使用的部分（webpack 5 对 CommonJS 也进行了支持，在此不详细展开）。

