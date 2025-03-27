# Vue 中 v-if 和 v-show 的区别详解

`v-if` 和 `v-show` 都是 Vue 中用于条件性渲染元素的指令，但它们在实现机制和使用场景上有显著区别。以下是两者的全面对比：

## 1. 核心区别

| 特性                | v-if                      | v-show                    |
|---------------------|--------------------------|--------------------------|
| **DOM 操作**         | 动态添加/移除 DOM 元素     | 仅切换 CSS 的 display 属性 |
| **初始渲染成本**     | 惰性渲染，初始为 false 时不渲染 | 无论条件如何都会初始渲染    |
| **切换成本**         | 高（涉及 DOM 操作）        | 低（仅修改样式）           |
| **生命周期**         | 触发创建/销毁生命周期钩子   | 不触发生命周期钩子          |
| **编译阶段**         | 条件块内的指令会正常编译    | 无论条件如何都会编译        |
| **适用场景**         | 运行时条件很少改变的情况    | 需要频繁切换显示状态的情况  |

## 2. 实现原理

### v-if 实现机制
```javascript
// 编译后的代码大致结构
function render() {
  return (condition) 
    ? _c('div', [...])
    : _e() // 创建一个空节点
}
```
- 完全条件渲染，条件为 false 时：
  - 元素及其子组件从 DOM 中移除
  - 触发 `beforeDestroy` 和 `destroyed` 生命周期钩子
- 条件变为 true 时：
  - 重新创建元素和子组件
  - 触发 `beforeCreate` 和 `created` 生命周期钩子

### v-show 实现机制
```javascript
// 编译后的代码大致结构
function render() {
  return _c('div', {
    directives: [{
      name: "show",
      value: condition
    }],
    // ...
  })
}
```
- 始终渲染并保留在 DOM 中
- 通过内联样式 `display: none` 控制显示/隐藏
- 不会触发任何生命周期钩子

## 3. 性能考量

### 使用 v-if 更优的场景：
- 初始条件为 false 且后期很少变为 true
- 包含重量级组件（如复杂表单、图表等）
- 需要利用生命周期钩子进行资源管理的情况

**示例**：
```html
<!-- 只在用户登录时渲染仪表盘 -->
<Dashboard v-if="isLoggedIn" />
```

### 使用 v-show 更优的场景：
- 需要频繁切换显示状态（如选项卡切换）
- 元素/组件切换时的状态需要保留
- 初始渲染成本较低的元素

**示例**：
```html
<!-- 频繁切换的加载指示器 -->
<div v-show="isLoading" class="spinner"></div>
```

## 4. 特殊注意事项

### 4.1 与 v-for 一起使用
- `v-if` 与 `v-for` 同节点使用时：
  - Vue 2.x 中 `v-for` 优先级更高（不推荐这种用法）
  - Vue 3.x 中 `v-if` 优先级更高
- 推荐做法：使用 `<template>` 标签包裹

```html
<!-- 推荐写法 -->
<template v-for="item in items">
  <div v-if="item.isActive" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### 4.2 过渡动画效果
- `v-if` 可以配合 `<transition>` 实现进入/离开过渡
- `v-show` 只能实现显示/隐藏过渡（因为元素始终存在）

```html
<!-- v-if 的过渡示例 -->
<transition name="fade">
  <div v-if="show">会淡入淡出的内容</div>
</transition>

<!-- v-show 的过渡示例 -->
<transition name="fade">
  <div v-show="show">只会淡入的内容</div>
</transition>
```

## 5. 实际应用建议

### 选择 v-if 当：
- 条件在运行时很少改变
- 需要条件块内的组件完全初始化或销毁
- 涉及重量级组件或需要释放资源

### 选择 v-show 当：
- 需要非常频繁地切换（如动画、选项卡）
- 希望保持组件状态（如表单输入值）
- 预渲染内容对 SEO 很重要

## 6. 组合使用策略

在某些复杂场景下，可以组合使用两者：

```html
<!-- 初始不渲染，但一旦渲染后就保持DOM只切换显示 -->
<template v-if="initialized">
  <div v-show="isVisible">
    内容...
  </div>
</template>
```

这种组合：
1. 初始时 `initialized` 为 false 不渲染
2. 第一次变为 true 后渲染组件
3. 后续通过 `isVisible` 控制显示/隐藏

## 总结

理解 `v-if` 和 `v-show` 的核心区别在于：
- `v-if` 是"真正的"条件渲染，有更高的切换开销
- `v-show` 是简单的 CSS 切换，有更高的初始渲染开销

根据应用场景合理选择：
- **频繁切换** → `v-show`
- **运行时条件不变** → `v-if`
- **需要控制组件生命周期** → `v-if`
- **保持组件状态** → `v-show`
