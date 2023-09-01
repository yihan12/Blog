# async/await

- 异步回调 callback hell
- Promise then catch 链式调用，但也是基于回调函数
- async/await 是同步的写法，彻底消除回调函数。

# async/await 和 Promise 的关系

- async/await 消除异步的终极武器
- 但和 Promise 并不互斥
- 反而，两者相辅相成
- 执行 async 函数，返回的是 Promise 对象
- await 相当于 Promise 的 then
- try...catch 捕获异常，相当于 Promise 的 catch
