### 说明

- 从上一章 new Vue 发生了什么，我们可以清除了解到 new Vue 到底做了那些事情，这一章我们具体看看 其中的 initState 初始化，具体做了什么。
-

### 代码剖析

> /src/core/instance/state.js

```javascript
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  /*初始化props*/
  if (opts.props) initProps(vm, opts.props)
  /*初始化methods*/
  if (opts.methods) initMethods(vm, opts.methods)
  /*初始化data*/
  if (opts.data) {
    initData(vm)
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
  /*初始化computed*/
  if (opts.computed) initComputed(vm, opts.computed)
  /*初始化watch*/
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
