### 说明

### 代码剖析

>

```javascript
export function renderMixin(Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          )
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
```

### 总结

**下一章：**[【源码剖析】render 的实现](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91render%E7%9A%84%E5%AE%9E%E7%8E%B0.md)
**本章：** [【源码剖析】$mount 挂载](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91%24mount%E6%8C%82%E8%BD%BD.md)  
**上一章章：** [【源码剖析】initState 初始化](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E3%80%91initState%20%E5%88%9D%E5%A7%8B%E5%8C%96.md)
