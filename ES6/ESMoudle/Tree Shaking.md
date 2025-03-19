**Tree Shaking** 是一种用于移除 JavaScript 项目中未使用代码的优化技术。它的名字来源于“摇树”的比喻：通过摇动树，将不需要的果实（未使用的代码）抖落，从而减少最终打包文件的体积。

---

### **Tree Shaking 的原理**
Tree Shaking 依赖于 ES6 Modules 的**静态结构特性**：
1. **静态分析**：ES6 Modules 的 `import` 和 `export` 是静态的，意味着它们在代码运行之前就可以确定依赖关系。
2. **未引用检测**：构建工具（如 Webpack、Rollup）可以分析代码，识别出哪些 `export` 未被 `import`，并将其标记为“未使用”。
3. **移除未使用代码**：在打包时，这些未使用的代码会被移除，从而减少最终文件的体积。

---

### **Tree Shaking 的条件**
1. **使用 ES6 Modules**：
   - Tree Shaking 只对 ES6 Modules（`import`/`export`）有效，对 CommonJS（`require`/`module.exports`）无效。
   - 因为 CommonJS 是动态加载的，无法在编译时确定依赖关系。
   
2. **模块必须是纯函数或无副作用**：
   - 如果模块有副作用（例如修改全局变量、执行某些操作），构建工具无法安全地移除它。
   - 可以通过 `package.json` 中的 `"sideEffects": false` 标记模块为无副作用。

3. **构建工具支持**：
   - Webpack（2+ 版本）、Rollup、Vite 等现代构建工具都支持 Tree Shaking。

---

### **Tree Shaking 的示例**
假设有以下模块：

```javascript
// math.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}
```

在另一个文件中只使用了 `add` 函数：

```javascript
// main.js
import { add } from './math';

console.log(add(1, 2));
```

经过 Tree Shaking 后，打包结果会移除未使用的 `subtract` 函数，从而减少文件体积。

---

### **如何启用 Tree Shaking**
1. **使用 ES6 Modules**：
   - 确保代码使用 `import` 和 `export`。

2. **配置构建工具**：
   - **Webpack**：
     - 在 `webpack.config.js` 中设置 `mode: 'production'`，Webpack 会自动启用 Tree Shaking。
     - 示例：
       ```javascript
       module.exports = {
           mode: 'production',
           entry: './src/index.js',
           output: {
               filename: 'bundle.js',
               path: __dirname + '/dist'
           }
       };
       ```

   - **Rollup**：
     - Rollup 默认支持 Tree Shaking，无需额外配置。

   - **Vite**：
     - Vite 基于 Rollup，默认支持 Tree Shaking。

3. **标记无副作用**：
   - 在 `package.json` 中标记模块为无副作用：
     ```json
     {
       "sideEffects": false
     }
     ```
   - 如果某些文件有副作用，可以单独列出：
     ```json
     {
       "sideEffects": [
         "*.css",
         "*.global.js"
       ]
     }
     ```

---

### **Tree Shaking 的注意事项**
1. **避免副作用**：
   - 如果模块有副作用（例如修改全局变量、执行某些操作），Tree Shaking 可能无法正常工作。
   - 示例：
     ```javascript
     // 有副作用的代码
     let count = 0;
     export function increment() {
         count++;
     }
     ```

2. **Babel 配置**：
   - 确保 Babel 不会将 ES6 Modules 转换为 CommonJS。
   - 在 `.babelrc` 或 `babel.config.js` 中设置：
     ```json
     {
       "presets": [
         ["@babel/preset-env", { "modules": false }]
       ]
     }
     ```

3. **第三方库的支持**：
   - 一些第三方库可能没有正确配置 `sideEffects`，导致 Tree Shaking 失效。
   - 选择支持 Tree Shaking 的库（如 Lodash ES 版本）。

---

### **Tree Shaking 的实际应用**
1. **减少打包体积**：
   - 移除未使用的代码，显著减少最终文件的体积，提升加载性能。

2. **优化库开发**：
   - 如果开发的是一个库，确保使用 ES6 Modules 并正确配置 `sideEffects`，以便用户能够通过 Tree Shaking 优化代码。

3. **结合代码分割和懒加载**：
   - Tree Shaking 可以与代码分割（Code Splitting）和懒加载（Lazy Loading）结合，进一步提升性能。

---

### **总结**
Tree Shaking 是现代 JavaScript 开发中非常重要的优化技术，能够有效减少打包体积，提升应用性能。要充分发挥 Tree Shaking 的作用，需要：
1. 使用 ES6 Modules。
2. 配置构建工具（如 Webpack、Rollup）。
3. 避免副作用，正确标记模块。
4. 选择支持 Tree Shaking 的第三方库。

通过合理使用 Tree Shaking，可以显著优化项目的性能和用户体验。
