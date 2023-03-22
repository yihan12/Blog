### 说明

- 从`new Vue`这个过程最后，`vm.$mount(vm.$options.el)`可以看到 el 挂载。这一章将研究这一过程。具体分析 vue 如何将组件挂载到页面成为真实 Dom 的。

这是`new Vue`过程的代码

```javascript
if (vm.$options.el) {
  // 挂载el
  vm.$mount(vm.$options.el)
}
```

### 代码剖析

> /src/platforms/web/runtime/index.js

```javascript
Vue.prototype.$mount = function (
  el?: string | Element, //el可以是string，也可以是Element
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined // 这里el就已经是DOM对象（query(el)处理后）
  return mountComponent(this, el, hydrating)
}
```

其实这一段很简单，

1. 主要是确定了`Vue.prototype.$mount`传参的类型，el 可以传字符串，比如我们平时的"app"。或者直接传 DOM 对象。
2. 然后则是将 el 通过`query(el)`将字符串形式的 el 返回成 DOM 对象。
3. 其中的`inBrower`主要是判断是否浏览器环境，判断是否有`window`对象：`export const inBrowser = typeof window !== 'undefined'`
4. 最后就是最重要的`mountComponent(this, el, hydrating)`执行

接下来先分析`query(el)`做了些什么

> /src/platforms/web/util/index.js

```javascript
export function query(el: string | Element): Element {
  if (typeof el === 'string') {
    // 如果el是string形式，我们就去找document是否能找到el命名的元素，未找到就会报错提示，如果找到，返回的就是找到的DOM对象
    const selected = document.querySelector(el)
    if (!selected) {
      process.env.NODE_ENV !== 'production' &&
        warn('Cannot find element: ' + el)
      return document.createElement('div')
    }
    return selected
  } else {
    // 如果是Element对象（Dom对象），就直接返回
    return el
  }
}
```

这段代码比较简单：

1. 判断`el`是字符串，就从页面中找到该 DOM 对象。
2. 如果未找到就报错。
3. 如果`el`不是字符串就直接返回 el DOM 对象。

最后我们来分析最重要的这部分代码

> /src/core/instance/lifecycle.js

```javascript
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el // 把el用vm.$el做缓存
  if (!vm.$options.render) {
    // 判断是否有render函数，如果没有写render函数，并且template未转换成render函数。就创建一个空的VNode
    vm.$options.render = createEmptyVNode
    // 下面这部分分是：如果你没有用template，又没写render函数，在开发环境就会报此警告
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      ) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount') //beforeMount

  let updateComponent
  //  和性能埋点相关的
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      // 主要是执行渲染Watcher
      // vm._render()生成VNode，然后调_update,把它传入
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 渲染Watcher
  new Watcher(
    vm,
    updateComponent,
    noop, // 空function
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate')
        }
      },
    },
    true /* isRenderWatcher */
  )
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
