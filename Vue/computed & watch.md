# 关键点
`响应变化` `属性` `侦听`

computed 是模板表达式的声明式描述，会创建新的响应式数据。  
而 watch 是响应式数据的自定义侦听器，用于响应数据的变化。  
除此之外，computed 还具有可缓存，可依赖多个属性，getter 函数无副作用等特点。  
watch 则更适用于异步或开销大的操作。

![image](https://github.com/yihan12/Blog/assets/44987698/bdf57f04-a270-4e7d-9971-a5aa2054975d)

1. 初始化：为 computed 属性创建 lazy watcher（此处 watcher 指双向绑定中的监听器，下同）。
2. 首次模板渲染：渲染 watcher 检测到 computed 属性时，会调用 computed 属性的 getter 方法，而 computed 属性的 getter 方法会调用依赖属性的 getter，从而形成链式调用，同时保存引用关系用于更新。取得计算结果后 lazy watcher 会将结果缓存，并返回给渲染 watcher 进行模板渲染。
3. 多次模板渲染：直接取 lazy watcher 中的缓存值给到渲染 watcher 进行渲染。
4. 依赖属性更新：根据首次模板渲染阶段构建的依赖关系向上通知 lazy watcher 进行重新计算，缓存计算结果并通知渲染 watcher 重新渲染更新页面。

#
