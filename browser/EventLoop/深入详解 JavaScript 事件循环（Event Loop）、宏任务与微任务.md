# **深入详解 JavaScript 事件循环（Event Loop）、宏任务与微任务**

## **1. 事件循环（Event Loop）的核心概念**
JavaScript 是**单线程**的，意味着它一次只能执行一个任务。为了处理异步操作（如 `setTimeout`、`fetch`、`Promise`），浏览器和 Node.js 使用 **事件循环** 机制来协调任务的执行顺序。

事件循环的核心是：
1. **执行同步代码**（调用栈 Call Stack）。
2. **处理异步任务**（交给 Web APIs 或 C++ APIs）。
3. **任务队列（Task Queue）** 存储回调：
   - **宏任务队列（MacroTask Queue）**
   - **微任务队列（MicroTask Queue）**
4. **循环检查任务队列**，按优先级执行任务。

---

## **2. 浏览器环境的事件循环流程**
### **完整执行顺序**
1. **执行当前宏任务（如 `<script>` 整体代码）**  
   - 同步代码直接执行。
   - 遇到异步任务（如 `setTimeout`、`Promise`）交给 Web API 处理。

2. **当前宏任务执行完毕后：**
   - **检查微任务队列**，依次执行所有微任务（如 `Promise.then`）。
   - **微任务执行期间新产生的微任务也会被立即执行**（直到队列清空）。

3. **执行 UI 渲染（如果需要）**  
   - 浏览器可能会在宏任务之间执行渲染（`requestAnimationFrame`）。

4. **从宏任务队列取出下一个任务执行**（如 `setTimeout` 回调）。
   - 重复上述流程。

---

## **3. 宏任务（MacroTask）详解**
### **定义**
宏任务是较大的、离散的任务单元，通常由宿主环境（浏览器/Node.js）调度。

### **常见宏任务**
| 任务类型 | 触发方式 | 备注 |
|----------|----------|------|
| `<script>` 整体代码 | 页面加载时 | 第一个宏任务 |
| `setTimeout` | `setTimeout(cb, delay)` | 即使 `delay=0`，也是宏任务 |
| `setInterval` | `setInterval(cb, delay)` | 周期性宏任务 |
| `I/O 操作` | `fetch`、`fs.readFile` | 网络/文件读取 |
| `UI 渲染` | 浏览器自动调度 | `requestAnimationFrame` |
| `DOM 事件回调` | `click`、`scroll` | 用户交互触发 |
| `MessageChannel` | `new MessageChannel()` | 跨文档通信 |

### **执行特点**
- **每次事件循环只执行一个宏任务**（然后检查微任务）。
- **宏任务队列按先进先出（FIFO）顺序执行**。
- **UI 渲染可能在宏任务之间执行**（但不是必须的）。

---

## **4. 微任务（MicroTask）详解**
### **定义**
微任务是高优先级的异步任务，通常用于**立即执行**的回调（如 `Promise`）。

### **常见微任务**
| 任务类型 | 触发方式 | 备注 |
|----------|----------|------|
| `Promise.then` | `Promise.resolve().then(cb)` | 最常见的微任务 |
| `MutationObserver` | 监听 DOM 变化 | 替代已废弃的 `Mutation Events` |
| `queueMicrotask` | `queueMicrotask(cb)` | 显式添加微任务 |
| `process.nextTick` | Node.js 特有 | 优先级高于 `Promise` |

### **执行特点**
- **微任务在当前宏任务结束后立即执行**。
- **必须清空整个微任务队列**，才会执行下一个宏任务。
- **微任务可以嵌套产生新的微任务**，浏览器会一直执行直到队列为空。

---

## **5. 事件循环的完整示例分析**
### **示例 1：基本执行顺序**
```javascript
console.log("Script start"); // 同步代码（宏任务）

setTimeout(() => {
  console.log("setTimeout"); // 宏任务
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1"); // 微任务
  })
  .then(() => {
    console.log("Promise 2"); // 微任务
  });

console.log("Script end"); // 同步代码（宏任务）
```
**输出顺序**：
```
Script start
Script end
Promise 1
Promise 2
setTimeout
```
**执行流程**：
1. 执行 `<script>` 宏任务（同步代码）。
2. `setTimeout` 回调进入宏任务队列。
3. `Promise.then` 回调进入微任务队列。
4. 同步代码执行完毕，检查微任务队列，执行 `Promise 1` 和 `Promise 2`。
5. 微任务执行完毕，执行下一个宏任务 `setTimeout`。

---

### **示例 2：微任务嵌套宏任务**
```javascript
setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    setTimeout(() => console.log("Timeout 2"), 0);
  })
  .then(() => console.log("Promise 2"));

console.log("Script end");
```
**输出顺序**：
```
Script end
Promise 1
Promise 2
Timeout 1
Timeout 2
```
**执行流程**：
1. 执行 `<script>` 宏任务（输出 `Script end`）。
2. `Timeout 1` 进入宏任务队列。
3. `Promise.then` 进入微任务队列。
4. 执行微任务：
   - 输出 `Promise 1`，`Timeout 2` 进入宏任务队列。
   - 输出 `Promise 2`。
5. 微任务执行完毕，执行宏任务队列：
   - 先执行 `Timeout 1`（先进先出）。
   - 再执行 `Timeout 2`。

---

## **6. 宏任务与微任务的优先级对比**
| 特性 | 宏任务（MacroTask） | 微任务（MicroTask） |
|------|---------------------|---------------------|
| **执行时机** | 每次事件循环执行**一个** | 当前宏任务结束后**全部执行** |
| **优先级** | 低 | 高 |
| **典型 API** | `setTimeout`、`setInterval`、`I/O` | `Promise.then`、`MutationObserver` |
| **是否阻塞渲染** | 可能（长时间任务会阻塞） | 不会（但过多微任务会延迟渲染） |

---

## **7. 进阶：`requestAnimationFrame` 与事件循环**
`requestAnimationFrame`（RAF）是浏览器提供的动画 API，它的执行时机：
- **在渲染之前执行**（与宏任务类似，但优先级更高）。
- **适合做动画**，因为浏览器会优化它的调用频率（通常 60 FPS）。

### **示例：RAF 与宏任务、微任务的顺序**
```javascript
setTimeout(() => console.log("Timeout"), 0);

requestAnimationFrame(() => console.log("RAF"));

Promise.resolve().then(() => console.log("Promise"));

console.log("Script");
```
**可能的输出**：
```
Script
Promise
RAF
Timeout
```
**执行顺序**：
1. 同步代码 `Script`。
2. 微任务 `Promise`。
3. `requestAnimationFrame`（在渲染前执行）。
4. 宏任务 `Timeout`。

---

## **8. Node.js 事件循环 vs 浏览器事件循环**
| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| **宏任务** | `setTimeout`、`I/O`、`UI 事件` | `setTimeout`、`setImmediate`、`I/O` |
| **微任务** | `Promise.then`、`MutationObserver` | `Promise.then`、`process.nextTick` |
| **`process.nextTick`** | 不存在 | 优先级**高于微任务** |
| **`setImmediate`** | 不存在 | 在 `I/O` 回调后执行 |

### **Node.js 事件循环阶段**
Node.js 的事件循环分为多个阶段：
1. **Timers**（`setTimeout`、`setInterval`）。
2. **Pending I/O**（处理网络/文件回调）。
3. **Idle/Prepare**（内部使用）。
4. **Poll**（检索新 I/O 事件）。
5. **Check**（`setImmediate` 回调）。
6. **Close**（`socket.on('close')`）。

---

## **9. 常见面试题深度解析**
### **题目 1**
```javascript
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

console.log("End");
```
**答案**：
```
Start
End
Promise 1
Promise 2
Timeout
```

### **题目 2（嵌套微任务与宏任务）**
```javascript
setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    setTimeout(() => console.log("Timeout 2"), 0);
  })
  .then(() => console.log("Promise 2"));

console.log("Script");
```
**答案**：
```
Script
Promise 1
Promise 2
Timeout 1
Timeout 2
```

---

## **10. 总结**
1. **事件循环顺序**：
   - 同步代码 → 微任务 → UI 渲染（可选） → 宏任务 → ...
2. **微任务优先级高于宏任务**，且必须全部执行完。
3. **`Promise.then`、`queueMicrotask` 是微任务**，`setTimeout`、`setInterval` 是宏任务。
4. **Node.js 有 `process.nextTick` 和 `setImmediate`**，执行顺序与浏览器不同。

掌握事件循环机制，能让你更精准地控制代码执行顺序，避免异步编程中的常见问题（如 `setTimeout(fn, 0)` 不立即执行）。
