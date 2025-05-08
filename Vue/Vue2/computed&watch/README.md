# Vue 中 computed 和 watch 的区别

## 核心区别

| 特性                | computed (计算属性)                     | watch (侦听器)                     |
|---------------------|----------------------------------------|-----------------------------------|
| **用途**           | 基于依赖的缓存计算值                    | 观察和响应数据变化                 |
| **缓存**           | 有缓存，依赖不变不重新计算              | 无缓存，变化就执行                |
| **异步**           | 不支持异步操作                         | 支持异步操作                      |
| **返回值**         | 必须返回一个值                         | 不需要返回值                      |
| **默认首次执行**   | 首次渲染时自动执行                     | 默认不立即执行(可配置 immediate)   |
| **适用场景**       | 模板中需要复杂逻辑计算的派生数据        | 数据变化时需要执行副作用操作       |

## 详细解析

### 1. computed (计算属性)

**特点**：
- 声明式：描述"应该计算什么"
- 基于它们的响应式依赖进行缓存
- 只有依赖发生变化才会重新计算
- 必须返回一个值

**适用场景**：
```javascript
data() {
  return {
    firstName: '张',
    lastName: '三'
  }
},
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
// 模板中使用：{{ fullName }}
```

**优势**：
- 避免在模板中放入太多逻辑，使模板更清晰
- 基于依赖缓存，避免不必要的计算

### 2. watch (侦听器)

**特点**：
- 命令式：描述"当某个数据变化时做什么"
- 更通用，可以执行任何代码
- 可以访问变化前后的值
- 适合执行异步或开销较大的操作

**适用场景**：
```javascript
data() {
  return {
    question: '',
    answer: '请提出问题...'
  }
},
watch: {
  question(newVal, oldVal) {
    if (newVal.includes('?')) {
      this.getAnswer()
    }
  }
},
methods: {
  async getAnswer() {
    this.answer = '思考中...'
    const res = await fetch('https://api.example.com/answer')
    this.answer = await res.json()
  }
}
```

**配置选项**：
```javascript
watch: {
  someData: {
    handler(newVal, oldVal) { /* ... */ },
    immediate: true,  // 立即执行
    deep: true       // 深度监听
  }
}
```

## 如何选择？

1. 用 **computed** 当：
   - 你需要派生/计算一个新值
   - 你希望结果被缓存
   - 你需要在模板中使用这个值

2. 用 **watch** 当：
   - 你需要监听数据变化执行副作用
   - 你需要执行异步操作
   - 你需要知道变化前后的值
   - 你需要更细粒度的控制(如 deep, immediate)

## 性能考虑

- 对于复杂的计算逻辑，优先使用 computed 因为有缓存
- 对于需要执行异步或开销大的操作，使用 watch
- 避免在 computed 中进行副作用操作，它应该是纯函数
