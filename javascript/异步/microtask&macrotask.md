# DOM 渲染和 Event Loop

1. Call Stack 空闲
2. 尝试 DOM 渲染
3. 触发 Event Loop

- 每次 Call Stack 清空（即每次轮询结束），即同步任务执行完
- 都是 DOM 渲染的机会，DOM 结构如果有任何改变则重新渲染。
- 然后再次触发 Event Loop

# 宏任务

DOM 渲染后触发：如 setTimeout

# 微任务

DOM 渲染前触发： 如 Promise

# 从 Event Loop 解释，为什么微任务执行更早

1. 执行 Promise
2. 但是不会经过 Web APIs。因为 Promise 是 ES 规范，不是 W3C 规范
3. 不像 setTimeout 在 Web APIs 等待实际，在 DOM 渲染后放到 CallBack queue（宏任务队列） 中。
4. Promise 会在 micro task queue(微任务队列)

整个执行步骤：

1. Call Stack 清空
2. 放在微任务队列中（micro task queue），执行当前微任务
3. 尝试 DOM 渲染。
4. 触发 Event Loop

# 宏任务有哪些？微任务有哪些？为什么微任务触发时间更早

宏任务： setTimeout、 setInteral、Ajax、DOM 事件

微任务： Promise、async/await

微任务比宏任务执行时间更早

# 宏任务、微任务和 DOM 渲染的关系

# 宏任务、微任务和 DOM 渲染，在 Event Loop 的过程
