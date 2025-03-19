JavaScript 模块化的发展经历了多个阶段，从最初的简单脚本到如今的模块化标准，以下是主要的发展过程：

### 1. **无模块化阶段**
   - **特点**：所有代码都写在全局作用域中，容易导致命名冲突和代码混乱。
   - **问题**：随着项目规模增大，代码难以维护和复用。

### 2. **命名空间模式**
   - **特点**：通过对象封装变量和函数，减少全局污染。
   - **示例**：
     ```javascript
     var MyApp = {
         module1: {
             foo: function() { /* ... */ }
         },
         module2: {
             bar: function() { /* ... */ }
         }
     };
     ```
   - **问题**：依然无法解决依赖管理和私有变量的问题。

### 3. **IIFE（立即执行函数表达式）**
   - **特点**：通过闭包实现私有作用域，避免全局污染。
   - **示例**：
     ```javascript
     var Module = (function() {
         var privateVar = 'private';
         return {
             publicMethod: function() {
                 console.log(privateVar);
             }
         };
     })();
     ```
   - **问题**：依赖管理依然不完善，模块间的依赖关系不清晰。

### 4. **CommonJS**
   - **特点**：Node.js 采用的模块化标准，使用 `require` 和 `module.exports`。
   - **示例**：
     ```javascript
     // moduleA.js
     module.exports = {
         foo: function() { /* ... */ }
     };

     // main.js
     var moduleA = require('./moduleA');
     moduleA.foo();
     ```
   - **优点**：适合服务器端，同步加载模块。
   - **缺点**：不适合浏览器环境，因为同步加载会阻塞页面渲染。

### 5. **AMD（Asynchronous Module Definition）**
   - **特点**：异步加载模块，适合浏览器环境，RequireJS 是其代表。
   - **示例**：
     ```javascript
     // moduleA.js
     define(function() {
         return {
             foo: function() { /* ... */ }
         };
     });

     // main.js
     require(['moduleA'], function(moduleA) {
         moduleA.foo();
     });
     ```
   - **优点**：异步加载，适合浏览器环境。
   - **缺点**：语法复杂，配置繁琐。

### 6. **CMD（Common Module Definition）**
   - **特点**：Sea.js 提出的模块化标准，与 AMD 类似，但更接近 CommonJS 的写法。
   - **示例**：
     ```javascript
     // moduleA.js
     define(function(require, exports, module) {
         var foo = require('./foo');
         exports.bar = function() {
             foo.doSomething();
         };
     });
     ```
   - **优点**：依赖就近，延迟执行。
   - **缺点**：与 AMD 相比，社区支持较少。

### 7. **UMD（Universal Module Definition）**
   - **特点**：兼容 AMD 和 CommonJS，适合多种环境。
   - **示例**：
     ```javascript
     (function (root, factory) {
         if (typeof define === 'function' && define.amd) {
             define(['moduleA'], factory);
         } else if (typeof module === 'object' && module.exports) {
             module.exports = factory(require('moduleA'));
         } else {
             root.returnExports = factory(root.moduleA);
         }
     }(this, function (moduleA) {
         return {
             foo: function() { /* ... */ }
         };
     }));
     ```
   - **优点**：兼容性强。
   - **缺点**：代码冗余，配置复杂。

### 8. **ES6 Modules**
   - **特点**：ECMAScript 2015（ES6）引入的官方模块化标准，使用 `import` 和 `export`。
   - **示例**：
     ```javascript
     // moduleA.js
     export function foo() { /* ... */ }

     // main.js
     import { foo } from './moduleA';
     foo();
     ```
   - **优点**：语法简洁，支持静态分析，适合现代 JavaScript 开发。
   - **缺点**：需要现代浏览器或构建工具（如 Babel、Webpack）支持。

### 9. **现代构建工具**
   - **特点**：结合 ES6 Modules 和构建工具（如 Webpack、Rollup、Parcel）实现模块化开发。
   - **优点**：支持代码分割、懒加载、Tree Shaking 等高级特性。
   - **示例**：
     ```javascript
     // webpack.config.js
     module.exports = {
         entry: './src/index.js',
         output: {
             filename: 'bundle.js',
             path: __dirname + '/dist'
         }
     };
     ```

### 总结
JavaScript 模块化的发展从最初的全局变量到如今的 ES6 Modules，经历了多个阶段。现代开发中，ES6 Modules 结合构建工具已成为主流，提供了强大的模块化支持，使得代码更易于维护和复用。
