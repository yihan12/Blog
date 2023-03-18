### 说明
* vue业务代码写了几年，对其痛点有了相应了解，想更深入理解其痛点原因。
* 学习源码中的思路，了解其api输出的原理。
* vue2.6已经到终版，对比大佬之前版本的源码分析，可以看其最后某些代码优化。

### 代码剖析

`new` 关键字在 Javascript 语言中代表实例化是一个对象，而 `Vue` 实际上是一个类，类在 Javascript 中是用 Function 来实现的。所以我们得找到`Vue`函数，从而去分析其函数执行究竟做了些什么

> /src/core/instance/index.js

```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
可以看到 `Vue` 只能通过 `new` 关键字初始化，然后会调用 `this._init` 方法

> src/core/instance/init.js

```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    /*初始化生命周期*/
    initLifecycle(vm)
    /*初始化事件*/
    initEvents(vm)
    /*初始化render*/
    initRender(vm)
    /*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    /*初始化props、methods、data、computed与watch*/
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    /*调用created钩子函数并且触发created钩子事件*/
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

上述代码只是在Vue的原型上增加`_init`方法，构造Vue实例的时候会调用这个`_init`方法来初始化Vue实例。

接下来我们逐段分析`Vue.prototype._init`方法中的代码：
```javascript
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
}
```

这段主要是**对 Vue 提供的 props、data、methods等选项进行合并处理**。

跳过内部函数，接着往下执行可以看到：
```javascript
/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  initProxy(vm)
} else {
  vm._renderProxy = vm
}
```
这里主要是**设置渲染函数的作用域代理，其目的是提供更好的提示信息**（如：在模板内访问实例不存在的属性，则会在非生产环境下提供准确的报错信息）

再往下执行可以发现，`new Vue`最重要的部分。

```javascript
/*初始化生命周期*/
initLifecycle(vm)
/*初始化事件*/
initEvents(vm)
/*初始化render*/
initRender(vm)
/*调用beforeCreate钩子函数并且触发beforeCreate钩子事件*/
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
/*初始化props、methods、data、computed与watch*/
initState(vm)
initProvide(vm) // resolve provide after data/props
/*调用created钩子函数并且触发created钩子事件*/
callHook(vm, 'created')
```
从上述代码，不难看出：Vue 初始化主要执行了：**初始化生命周期`initLifecycle`、初始化事件中心`initEvents`、初始化渲染`initEvents`、初始化 data、props、methods、computed、watch； 调用beforeCreate钩子函数并且触发beforeCreate钩子事件；调用created钩子函数并且触发created钩子事件**。

在初始化的最后的代码
```javascript
if (vm.$options.el) {
  // 挂载el
  vm.$mount(vm.$options.el)
}
```

判断是否有了属性，如果有 `el` 属性，则调用 `vm.$mount` 方法挂载 vm，挂载的目标就是把模板渲染成最终的 DOM。

### 总结
**全文从构造函数`Vue`开始，执行 `new Vue()` 调用Vue的原型方法`Vue.prototype._init()` 方法，依次处理：**
* **合并配置**
* **设置渲染函数的作用域代理**
* **初始化生命周期`initLifecycle(vm)`**
* **初始化事件`initEvents(vm)`**
* **初始化渲染（render）`initRender(vm)`**
* **调用beforeCreate钩子函数并且触发beforeCreate钩子事件`callHook(vm, 'beforeCreate')`**
* **初始化 data、props、methods、computed、watch等`initInjections(vm);initState(vm);initProvide(vm)`**
* **调用created钩子函数并且触发created钩子事件`callHook(vm, 'created')`**
* **挂载el`vm.$mount(vm.$options.el)`**

后续，分析 Vue 的挂载过程。。。。
