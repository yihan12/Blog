### 说明

vue2.0 是利用`createElement`方法创建的 VNode。我们接下里分析`createElement`

### 代码

> /src/core/vdom/create-element.js

```javascript
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

createElement 方法实际上是对 \_createElement 方法的封装。让允许传入的参数更灵活。
