### 说明

1. 虚拟 DOM 这个概念相信大家并不陌生。它是因为浏览器中的 DOM 是很昂贵的。真正的 DOM 元素是非常庞大的。浏览器的标准就把 DOM 设计的非常复杂。频繁的去更新 DOM，会产生一定的性能问题。
2. 而 `Virtual DOM` 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多

### vue1.0 和 vue2.0 对比

Vue 在 1.0+版本还没有引入虚拟 DOM 的时候，当某一个状态发生变化时，它在一定程度上是知道哪些节点使用到了这个状态，从而可以准确的针对这些节点进行更新操作，不需要进行对比。但这种做法是有一定的代价的，因为更新的粒度太细，每一次节点的绑定都需要一个 Watcher 去观察状态的变化，这样会增加更多的内存开销。当一个状态被越多的节点使用，它的内存开销就越大。

因此在 Vue 的 2.0+版本中，引入了虚拟 DOM 将更新粒度调整为组件级别，当状态发生变化的时候，只派发更新到组件级别，然后组件内部再进行对比和渲染。这样做以后，当一个状态在同一个组件内被引用多次的时候，它们只需要一个 render watcher 去观察状态的变化即可。

### vue2.0 版本的虚拟 DOM

虚拟 DOM 解决 DOM 更新的方式：通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染。在渲染之前会使用新生成的虚拟节点树和上一次细腻节点树做对比，然后只渲染其不相同的部分(包括新增和删除的)。

根实例就是虚拟节点树的根节点，各种组件就是 children 孩子节点，树节点使用 VNode 类来表示。它使用 template 模板来描述状态与 DOM 之间的映射关系，然后通过 parse 编译将 template 模板转换成渲染函数 render，执行渲染函数 render 就可以得到一个虚拟节点树，最后使用这个虚拟节点树渲染到视图上。

虚拟 DOM 流程：**开始->模板 template->通过 parse 编译->渲染函数->执行 VNode->生成视图->结束**

### 代码分析

> /src/core/vdom/vnode.js

```javascript
/* @flow */

export default class VNode {
  tag: string | void
  data: VNodeData | void
  children: ?Array<VNode>
  text: string | void
  elm: Node | void
  ns: string | void
  context: Component | void // rendered in this component's scope
  key: string | number | void
  componentOptions: VNodeComponentOptions | void
  componentInstance: Component | void // component instance
  parent: VNode | void // component placeholder node

  // strictly internal
  raw: boolean // contains raw HTML? (server only)
  isStatic: boolean // hoisted static node
  isRootInsert: boolean // necessary for enter transition check
  isComment: boolean // empty comment placeholder?
  isCloned: boolean // is a cloned node?
  isOnce: boolean // is a v-once node?
  asyncFactory: Function | void // async component factory function
  asyncMeta: Object | void
  isAsyncPlaceholder: boolean
  ssrContext: Object | void
  fnContext: Component | void // real context vm for functional nodes
  fnOptions: ?ComponentOptions // for SSR caching
  devtoolsMeta: ?Object // used to store functional render context for devtools
  fnScopeId: ?string // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance
  }
}
```

### 总结

**下一章：**[【源码分析】 createElement](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91createElement.md)  
**本章：**[【源码分析】 Virtual Dom](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91%20Virtual%20Dom.md)  
**上一章：**[【源码剖析】render 的实现](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91render%E7%9A%84%E5%AE%9E%E7%8E%B0.md)
