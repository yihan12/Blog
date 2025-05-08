# Vue Router 中 history 模式和 hash 模式的区别

## 核心区别概述

| 特性                | hash 模式                         | history 模式                      |
|---------------------|----------------------------------|----------------------------------|
| **URL 表现形式**     | 带 `#`，如 `http://example.com/#/home` | 普通 URL，如 `http://example.com/home` |
| **服务器配置**       | 不需要特殊配置                    | 需要服务器端支持                  |
| **兼容性**          | 支持所有浏览器                    | 需要 HTML5 History API 支持        |
| **SEO 友好性**       | 较差                              | 较好                              |
| **部署要求**         | 任意服务器均可                    | 需要服务器重定向配置              |
| **前端路由实现原理** | 监听 `hashchange` 事件            | 使用 `history.pushState` API       |

## 深入解析

### 1. Hash 模式

**实现原理**：
- 基于浏览器 `location.hash` 属性
- 利用 `onhashchange` 事件监听路由变化
- URL 中 `#` 后面的内容不会发送到服务器

**示例代码**：
```javascript
const router = new VueRouter({
  mode: 'hash', // 默认模式，可不写
  routes: [...]
})
```

**特点**：
- 兼容性好，支持 IE8+
- 不需要服务器端配合
- URL 中带有 `#`，美观度较差
- 不能利用 `history.state` 传递复杂数据

**实现机制**：
```javascript
// 简化的hash路由实现原理
window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1) // 获取#后的路径
  // 根据path匹配组件并渲染
})
```

### 2. History 模式

**实现原理**：
- 基于 HTML5 History API (`pushState`, `replaceState`)
- 利用 `popstate` 事件监听路由变化
- 需要服务器支持，避免 404 错误

**示例代码**：
```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

**特点**：
- URL 更美观，不带 `#`
- 需要服务器额外配置
- 支持 `history.state` 传递状态对象
- 兼容性要求 IE10+

**实现机制**：
```javascript
// 简化的history路由实现原理
window.addEventListener('popstate', () => {
  const path = window.location.pathname // 获取路径
  // 根据path匹配组件并渲染
})

// 路由跳转
history.pushState({}, '', '/new-path') // 不会触发页面刷新
```

## 服务器配置要求

### History 模式必需的服务器配置

**Nginx 配置**：
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache 配置**：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Node.js Express 配置**：
```javascript
const express = require('express')
const history = require('connect-history-api-fallback')

const app = express()
app.use(history()) // 必须在静态文件中间件前使用
app.use(express.static('dist'))
```

## 选择建议

### 使用 Hash 模式当：
- 项目需要兼容旧浏览器（如 IE9 及以下）
- 没有后端支持或无法配置服务器
- 项目对 URL 美观度要求不高
- 开发简单的静态站点

### 使用 History 模式当：
- 项目需要干净的 URL 结构
- 需要更好的 SEO 支持
- 可以控制服务器配置
- 主要面向现代浏览器用户

## 常见问题解决方案

### History 模式下的 404 问题
**问题**：刷新非首页路由时返回 404  
**解决**：确保服务器已正确配置回退到 `index.html`

### 获取路由路径差异
```javascript
// hash模式
const hashPath = window.location.hash.slice(1) // "/home"

// history模式 
const historyPath = window.location.pathname // "/home"
```

### 路由跳转方式
```javascript
// hash模式
window.location.hash = '/new-path'

// history模式
history.pushState({}, '', '/new-path')
router.push('/new-path') // Vue Router推荐方式
```

## 高级技巧

### 混合模式（根据环境自动选择）
```javascript
const isProduction = process.env.NODE_ENV === 'production'
const router = new VueRouter({
  mode: isProduction && 'pushState' in window.history 
    ? 'history' 
    : 'hash',
  routes: [...]
})
```

### 自定义路由模式
可以实现自定义的 `mode` 选项，继承 `HashHistory` 或 `HTML5History` 类：
```javascript
class CustomHistory extends History {
  // 实现抽象方法
}

const router = new VueRouter({
  mode: 'custom',
  customHistory: new CustomHistory()
})
```

## 性能考量

- **Hash 模式**：由于只改变 URL 的 hash 部分，页面不会重新加载
- **History 模式**：`pushState` 比直接修改 `location.hash` 稍慢，但差异可以忽略

## SEO 影响

- **Hash 模式**：传统搜索引擎不会索引 `#` 后面的内容
- **History 模式**：可以被搜索引擎正确索引，但需要确保服务器能正确处理动态路由

对于需要 SEO 的 hash 模式项目，可以使用 `_escaped_fragment_` 技术或考虑服务端渲染(SSR)
