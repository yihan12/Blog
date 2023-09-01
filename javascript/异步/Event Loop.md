# JS 如何执行的？

- 从前到后一行一行执行；
- 如果某一行执行报错则停止下面代码执行
- 先把同步代码执行完，再执行异步

# 常见名词

Call Stack：执行栈

Web APIS: 浏览器 api setTimeout

Event Loop：事件循环/事件轮询

Callback Queue：回调队列

# DOM 事件和 Event Loop

例如 click 方法放到 浏览器缓存，直到用户点击，才会把方法推到 Callback Queue 队列中，然后由 js Event Loop 轮询的机制执行，把方法放到执行栈中执行。
