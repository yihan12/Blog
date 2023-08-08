# Vue 是如何实现数据劫持的

> Dep：实现发布订阅模式的模块。
> Watcher：订阅更新和触发视图更新的模块。

![image](https://github.com/yihan12/Blog/assets/44987698/97a041c8-8abb-40f1-97ff-1356c7b21650)


Vue2 通过 Object.defineProperty，Vue3 通过 Proxy 来劫持 state 中各个属性的 setter、getter，通过 getter 收集依赖。当 state 中的数据发生变动之后发布通知给订阅者更新数据。

# Vue 是如何实现双向绑定的

# MVVM 是什么

# Vue2 与 Vue3 的差异
Vue2 与 Vue3 数据绑定机制的主要差异是劫持方式。Vue2 使用的是 Object.defineProperty 而 Vue3 使用的是 Proxy。Proxy 可以创建一个对象的代理，从而实现对这个对象基本操作的拦截和自定义。

| 特性 | defineProperty |	Proxy |
|劫持新创建属性	|否	|是|
|劫持数组变化	|否	|是|
|劫持索引修改数组元素	|否|	是|
|兼容性	|IE8及以上	|不支持IE|

由于 Vue 3 中改用 Proxy 实现数据劫持，Vue 2 中的 Vue.set/vm.$set 在 Vue 3 中被移除。
