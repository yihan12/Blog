## 防抖原理

## 引用方法

now 方法：获取当前时间戳

```javascript
// A (possibly faster) way to get the current timestamp as an integer.
export default Date.now ||
  function () {
    return new Date().getTime()
  }
```

restArguments 方法：this 的指向和 arguments 参数处理

```javascript
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
export default function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex]
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest)
      case 1:
        return func.call(this, arguments[0], rest)
      case 2:
        return func.call(this, arguments[0], arguments[1], rest)
    }
    var args = Array(startIndex + 1)
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index]
    }
    args[startIndex] = rest
    return func.apply(this, args)
  }
}
```

## 代码分部剖析

## 代码源码

```javascript
// 处理传入函数的this指向以及arguments参数
import restArguments from './restArguments.js'
// 当前时间戳
import now from './now.js'

// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
export default function debounce(func, wait, immediate) {
  // 初始化这些数据
  // timeout 定时器初始变量
  // previous 出发前时间戳
  // result返回值
  // args 参数
  // context this
  var timeout, previous, args, result, context

  var later = function () {
    var passed = now() - previous
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed)
    } else {
      timeout = null
      if (!immediate) result = func.apply(context, args)
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null
    }
  }

  var debounced = restArguments(function (_args) {
    context = this
    args = _args
    previous = now()
    if (!timeout) {
      timeout = setTimeout(later, wait)
      if (immediate) result = func.apply(context, args)
    }
    return result
  })

  // 取消
  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = args = context = null
  }

  return debounced
}
```
