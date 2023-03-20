### 说明

- 从上一章 new Vue 发生了什么，我们可以清除了解到 new Vue 做的一系列初始化。这一章我们具体看看,其中的 initState 初始化具体做了什么。

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

从该函数不难看出：

1. `initProps` 初始化 props
2. `initMethods` 初始化 methods
3. `initData` 初始化 data
4. `initComputed` 初始化 computed
5. `initWatch` 初始化 watch

那么我们接着具体分析`initData`具体做了什么？

> /src/core/instance/state.js

```javascript
function initData(vm: Component) {
  let data = vm.$options.data
  // 判断是否合法data,是否function
  // vm._data,我们也可以通过这个方式访问我们.vue文件的data属性。但是不建议这样去获取。
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  // 判断如果不是对象
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' &&
      warn(
        'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  // 循环对比data与props、methods，确保它们不能重名
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(`Method "${key}" has already been defined as a data property.`, vm)
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        )
    } else if (!isReserved(key)) {
      // 判断key不是 _或者$ 开头的属性,则把该key挂到vm._data上。
      proxy(vm, `_data`, key)
    }
  }
  // 处理完上述后，通过 observe 方法对数据进行响应式处理
  // observe data
  observe(data, true /* asRootData */)
}
```

上述代码主要执行了：

1. 判断是否合法 data，并将其赋给`data`，`vm._data`
2. 循化对比`data`和`props`、`methods`的属性,确保它们不与`data`重名。
3. 判断 key 不是 \_或者$ 开头的属性,则把其代理到`vm._data`上。

> /src/core/instance/state.js

```javascript
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

从这个`proxy`方法我们不难看出，我们平时通过`this.message`访问 data 的属性时。实际上是执行了`vm._data.message`。然后通过`proxy`函数，(vm 即 target,\_data 即 sourceKey,message 即 key)。`this[sourceKey][Key]`即执行`this._data.message`，从而取到我们在 data 中设置的 message 参数的值。

### 总结

### 总结

**全文从函数`initState()`开始，依次处理：**

- **`initProps` 初始化 props**
- **`initMethods` 初始化 methods**
- **`initData` 初始化 data**
- **`initComputed` 初始化 computed**
- **`initWatch` 初始化 watch**

**然后单独介绍`initData()`做了什么**

- **判断是否合法 data，并将其赋给`data`，`vm._data`**
- **循化对比`data`和`props`、`methods`的属性,确保它们不与`data`重名。**
- **判断 key 不是 \_或者$ 开头的属性,则把其代理到`vm._data`上。**

**最后，我们分析了`proxy`函数。平时的`this.message`即`this._data.message`**

下一章节，先去分析其中比较简单的一部分`initState(vm)`，这部分主要是 props,methods,data,computed,watch 初始化。
**下一章：** [【源码剖析】$mount 挂载](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E3%80%91%24mount%E6%8C%82%E8%BD%BD.md)  
**本章：** [【源码剖析】initState 初始化](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E3%80%91initState%20%E5%88%9D%E5%A7%8B%E5%8C%96.md)  
**上一章：**[【源码剖析】new Vue 发生了什么](https://github.com/yihan12/Blog/blob/main/vue2.6-analysis/%E3%80%90%E6%BA%90%E7%A0%81%E5%89%96%E6%9E%90%E3%80%91new%20Vue%20%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88.md)
