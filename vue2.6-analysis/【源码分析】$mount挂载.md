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

看了很多相关文章，大部分文章并没有讲述为啥要先分析 compiler 版本代码`$mount`，再去分析 runtime-only 版本的代码上的`$mount`。所有一开始就会有点懵，为啥要这么去分析。

> /src/platforms/web/entry-runtime-with-compiler.js

```javascript
// 最开始通过mount获取并缓存了Vue原型上的$mount方法，然后又重新定义了Vue.prototype.$mount
// 执行到到最后，通过return mount.call(this, el, hydrating) 重新调用mount缓存下来的原型方法。
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 使用query来获取要挂载DOM元素节点
  el = el && query(el)

  /* istanbul ignore if */
  // 判断el是否为body，或者document，如果是则返回，因为本身index.html已经含有html,body元素
  // 如果el是body或者文档标签，会替换原本的html和body.
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  /*处理模板templete，编译成render函数，render不存在的时候才会编译template，否则优先使用render*/
  // 判断options中是否有render方法，有则直接调用mount方法，
  // 如果没有render，则需要调用compileToFunctions生成render再调用mount方法
  if (!options.render) {
    /*template存在的时候取template，不存在的时候取el的outerHTML*/
    let template = options.template
    // 会判断有没有写template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        /*当template为DOM节点的时候*/
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      //
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== 'production',
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 执行runtime-only版本的$mounted
  return mount.call(this, el, hydrating)
}
```

通过这部分代码可以看出：

1. 一开始通过定义`mount`缓存了 Vue 原型上原始的`$mount`方法`const mount = Vue.prototype.$mount`；
2. 然后又重新定义了`Vue.prototype.$mount`方法。
3. 执行到最后，又重新调用缓存的原始`Vue.prototype.$mount`方法`return mount.call(this, el, hydrating)`,这时候就会执行到`runtime/index`的`$mount`方法。
4. 其中有一部分是判断内部有无`render`函数，若无则通过`compileToFunctions`方法生成 render 再调用 mount 方法.若无则直接执行`return mount.call(this, el, hydrating)`

那么 entry-runtime-with-compiler.js 文件中的`$mount`到底干了些什么呢。

先分析`query(el)`做了些什么

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
3. 如果`el`不是字符串就直接返回 el DOM 对象，因为`$mount`可以直接接收一个 DOM 元素,可以像这么写：

```javascript
import Vue from 'vue'
import App from './App.vue'
new Vue({
  render: (h) => h(App),
}).$mount(document.querySelector('#app'))
```

我们平时在 main.js 入口文件中，也会这么去写

```javascript
import Vue from 'vue'
import App from './App.vue'
new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

`el = el&&query(el)`就是处理上述两种写法。

`query`方法获取到 DOM 元素后，往下走，判断 el 元素如果是 body 或者 document,就报错 并且 return。
因为 index.html 里已经有了 html 和 body。

```javascript
if (el === document.body || el === document.documentElement) {
  process.env.NODE_ENV !== 'production' &&
    warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
  return this
}
```

1. `el = el&&query(el)`,此操作是获取到我们定义的 DOM 节点，`'#app'`或`document.querySelector('#app')`;
2. 判断`options`中是否含有 `render` 方法。如果我们直接手写`render`函数,就会直接执行`return mount.call(this, el, hydrating)`然后就回去执行之前缓存的原型方法。
3. 如果没有`render`方法.会将`template`做为参数，运行时调用`compileToFunctions`方法，转化为`render`函数，再去调用`mount.call`方法。

然后执行到 mount 变量缓存的 runtime-only 版本的`$mount`方法

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

  // 如果此时还是没有render方法，那就要抛出错误提示
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

  let updateComponent //构建updateComponent方法，更新组件需要用到
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
  // 手动挂载实例
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

1. 首先判断`render`函数是否已经构建好，如果为构建好久报错;
2. 如果为报错就构建`updateComponent`方法，这个方法每次更新组件的时候就会调这个方法；
3. 然后 new Watch 是 Vue 响应式处理中的依赖收集过程，其原理采用了观察者模式
4. 最后手动挂载实例。
