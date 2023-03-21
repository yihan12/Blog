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

>

```javascript
Vue.prototype.$mount = function (
  el?: string | Element, //el可以是string，也可以是Element
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined // 这里el就已经是DOM对象（query(el)处理后）
  return mountComponent(this, el, hydrating)
}
```

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
