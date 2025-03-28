# 关键点
`响应变化` `属性` `侦听`

computed 是模板表达式的声明式描述，会创建新的响应式数据。  
而 watch 是响应式数据的自定义侦听器，用于响应数据的变化。  
除此之外，computed 还具有可缓存，可依赖多个属性，getter 函数无副作用等特点。  
watch 则更适用于异步或开销大的操作。

# computed原理

![image](https://github.com/yihan12/Blog/assets/44987698/bdf57f04-a270-4e7d-9971-a5aa2054975d)

1. 初始化：为 computed 属性创建 lazy watcher（此处 watcher 指双向绑定中的监听器，下同）。
2. 首次模板渲染：渲染 watcher 检测到 computed 属性时，会调用 computed 属性的 getter 方法，而 computed 属性的 getter 方法会调用依赖属性的 getter，从而形成链式调用，同时保存引用关系用于更新。取得计算结果后 lazy watcher 会将结果缓存，并返回给渲染 watcher 进行模板渲染。
3. 多次模板渲染：直接取 lazy watcher 中的缓存值给到渲染 watcher 进行渲染。
4. 依赖属性更新：根据首次模板渲染阶段构建的依赖关系向上通知 lazy watcher 进行重新计算，缓存计算结果并通知渲染 watcher 重新渲染更新页面。

# watch

### 原理

watch 本质上是为每个监听属性 setter 创建了一个 watcher，当被监听的属性更新时，调用传入的回调函数。常见的配置选项有 deep 和 immediate，对应原理如下：

deep：深度监听对象，为对象的每一个属性创建一个 watcher，从而确保对象的每一个属性更新时都会触发传入的回调函数。主要原因在于对象属于引用类型，单个属性的更新并不会触发对象 setter，因此引入 deep 能够很好地解决监听对象的问题。同时也会引入判断机制，确保在多个属性更新时回调函数仅触发一次，避免性能浪费。
immediate：在初始化时直接调用回调函数，可以通过在 created 阶段手动调用回调函数实现相同的效果。

### 适用场景

computed：需要处理复杂逻辑的模板表达式。
watch：需要执行异步或开销较大的操作。
从表现上看，computed 会创建新的属性，而 watch 可以通过将属性设置在 data 中，再监听依赖属性变化，调用 handler 方法更新属性的方式达到同样的效果。因此不难得出 computed 的使用场景可以被 watch 覆盖这一结论。但在具体的使用上还是优先考虑 computed，因为相同场景下 watch 所需的代码量和性能开销一般来说会比 computed 大，具体可以参照 computed vs watched。在 computed 无法满足需求的情况下再考虑使用 watch，也可以有效避免 watch 滥用，提升性能。

