# Vue2 keep-alive 源码逐行解析

下面我将结合Vue 2.6.14版本的源码，逐行分析`keep-alive`的实现原理，并添加详细注释。

## 源码位置
`src/core/components/keep-alive.js`

## 完整源码解析

```javascript
// 导出一个组件选项对象
export default {
  name: 'keep-alive',
  // 标记为抽象组件，不会出现在父子关系链中，也不会渲染为DOM元素
  abstract: true,

  // 接受的props
  props: {
    // 匹配到的组件会被缓存，可以是字符串、正则或数组
    include: [String, RegExp, Array],
    // 匹配到的组件不会被缓存，可以是字符串、正则或数组
    exclude: [String, RegExp, Array],
    // 最大缓存组件实例数量
    max: [String, Number]
  },

  // 组件创建钩子
  created() {
    // 创建缓存对象，存储所有缓存的VNode
    this.cache = Object.create(null)
    // 存储缓存组件的key，用于实现LRU算法
    this.keys = []
  },

  // 组件销毁钩子
  destroyed() {
    // 遍历所有缓存，销毁组件实例
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  // 组件挂载钩子
  mounted() {
    // 监听include变化，更新缓存
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    // 监听exclude变化，更新缓存
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  // 渲染函数
  render() {
    // 获取默认插槽内容
    const slot = this.$slots.default
    // 获取第一个子组件的VNode（keep-alive只处理第一个子组件）
    const vnode = getFirstComponentChild(slot)
    
    // 获取组件配置选项
    const componentOptions = vnode && vnode.componentOptions
    
    if (componentOptions) {
      // 获取组件名称，优先使用name选项，否则使用标签名
      const name = getComponentName(componentOptions)
      
      const { include, exclude } = this
      // 检查是否需要缓存
      if (
        // 不在include中
        (include && (!name || !matches(include, name))) ||
        // 在exclude中
        (exclude && name && matches(exclude, name))
      ) {
        // 不满足缓存条件，直接返回原始VNode
        return vnode
      }
      
      const { cache, keys } = this
      // 生成缓存key：优先使用组件key，否则使用组件cid和tag组合
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      
      // 如果已有缓存
      if (cache[key]) {
        // 从缓存中获取组件实例
        vnode.componentInstance = cache[key].componentInstance
        // 调整key顺序：先删除再添加到末尾（LRU策略）
        remove(keys, key)
        keys.push(key)
      } else {
        // 没有缓存则添加新缓存
        cache[key] = vnode
        keys.push(key)
        // 如果超出max限制，删除最久未使用的缓存
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      
      // 标记该VNode是被keep-alive缓存的
      vnode.data.keepAlive = true
    }
    // 返回VNode（如果没有子组件则返回插槽第一个元素）
    return vnode || (slot && slot[0])
  }
}
```

## 工具函数解析

### getFirstComponentChild

```javascript
// 获取第一个子组件VNode
function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      // 找到第一个有componentOptions的VNode
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}
```

### getComponentName

```javascript
// 获取组件名称
function getComponentName(opts) {
  // 优先使用组件name选项
  return opts && (opts.Ctor.options.name || opts.tag)
}
```

### matches

```javascript
// 检查模式匹配
function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  return false
}
```

### pruneCacheEntry

```javascript
// 删除缓存条目
function pruneCacheEntry(
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  // 如果缓存存在且不是当前激活的组件
  if (cached && (!current || cached.tag !== current.tag)) {
    // 销毁组件实例
    cached.componentInstance.$destroy()
  }
  // 清除缓存
  cache[key] = null
  // 从keys数组中移除
  remove(keys, key)
}
```

### pruneCache

```javascript
// 条件性清理缓存
function pruneCache(keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      // 如果名称存在且不满足过滤条件
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```

## 核心实现原理

1. **缓存机制**：
   - 使用`this.cache`对象存储VNode，key由组件cid和tag组成
   - 使用`this.keys`数组维护缓存key的访问顺序

2. **LRU算法**：
   - 每次访问缓存时，将对应key移到`keys`数组末尾
   - 当缓存数量超过`max`时，删除`keys[0]`对应的最久未使用缓存

3. **组件复用**：
   - 命中缓存时，直接使用缓存的`componentInstance`
   - 避免重复创建组件实例，保留组件状态

4. **生命周期管理**：
   - 通过`vnode.data.keepAlive`标记缓存组件
   - 在patch过程中触发`activated`和`deactivated`钩子

5. **动态缓存控制**：
   - 通过`include`和`exclude`props控制哪些组件需要缓存
   - 使用`$watch`监听变化动态更新缓存

## 与Vue核心的交互

1. **在patch过程中**：
   - 当检测到`vnode.data.keepAlive`时，会复用缓存的组件实例
   - 触发相应的激活/停用生命周期钩子

2. **组件销毁时**：
   - 会递归销毁所有缓存的组件实例
   - 确保不会内存泄漏

这种实现方式使得`keep-alive`能够高效地管理组件缓存，在保持组件状态的同时，通过LRU算法控制内存使用，是Vue性能优化的重要手段。
