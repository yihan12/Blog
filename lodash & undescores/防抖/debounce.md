## 前言

在前端开发中会遇到一些频繁的事件触发，比如：

1. window 的 resize、scroll
2. mousedown、mousemove、mousewheel(鼠标滚轮)
3. keyup(弹起键盘)、keydown(按下键盘)、keypress(按下字符键盘)  
   ……

想象一下窗口的 resize 事件或者是一个元素的 onmouseover 事件 - 他们触发时，执行的非常迅速，并且触发很多次。如果你的回调过重，你可能使浏览器死掉。

这就是为什么要使用防抖。

## 原理

> **防抖的原理**：在 wait 时间内，持续触发某个事件。第一种情况：如果某个事件触发 wait 秒内又触发了该事件，就应该以新的事件 wait 等待时间为准，wait 秒后再执行此事件；第二种情况：如果某个事件触发 wait 秒后，未再触发该事件，则在 wait 秒后直接执行该事件。

通俗一点：定义 wait=2000，持续点击按钮，前后点击间隔都在 2 秒内，则在最后一次点击按钮后，等待 2 秒再执行 func 方法。如果点击完按钮，2 秒后未再次点击按钮，则 2 秒后直接执行 func 方法。

## 示例代码

### 代码一(根据原理)

定义函数 debounce  
根据表述，我们可以知道需要传入参数：func、wait  
实现代码：

```
function debounce(func, wait = 500) {
    let timeout; // 定义定时器，wait秒后需要清除定时器
    return function () {
      // 如果再次触发函数时，已有timeout，则清空销毁当前timeout，再以新的事件重新设置定时器
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(function () {
        func();
        clearTimeout(timeout)
      }, wait);
    };
}
```

### 代码二(解决函数 this 指向)

我们之前的原函数指向哪，如果使用我们的 debounce 函数包裹后，也要将 this 指向正确的对象。

```
function debounce(func, wait = 500) {
    let timeout, context;
    return function () {
          context = this;
          // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(function () {
                func.apply(context);
                clearTimeout(timeout);
          }, wait);
    };
}
```

### 代码三(解决函数 event 对象)

JavaScript 在事件处理函数中会提供事件对象 event；  
因此，也要考虑到保持原函数的 event 对象相同

式一：

```
function debounce(func, wait = 500) {
    let timeout, context, args;
    return function () {
          context = this;
          args = arguments;
          // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(function () {
                func.apply(context, args);
                clearTimeout(timeout);
          }, wait);
    };
}
```

式二：

```
function debounce(func, wait = 500) {
    let timeout, context;
    return function (...args) {
          context = this;
          // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(function () {
                func.apply(context, args);
                clearTimeout(timeout);
          }, wait);
    };
}
```

### 代码四(函数返回值)

此时需要注意一个问题，就是我们在执行原函数时可能有返回值，我们需要处理 debounce 函数，在最后也要有相同返回值。

这里做出的处理，是将`func.apply(context, args)`单独拿出来，输出原函数的`result`。

```
function debounce(func, wait = 500) {
    let timeout, context, result;

    function showResult(e1, e2) {
        result = func.apply(e1, e2); // 绑定e1,e2的同时，输出result
        return result;
    }

    return function (...args) {
        context = this;
        // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
        if (timeout) clearTimeout(timeout);

        // 这里是不立即执行的原代码
        timeout = setTimeout(function () {
            clearTimeout(timeout);
            return showResult(context, args); // 将this，arguments代入函数
        }, wait);
        return result;
    };
}
```

### 代码五(立刻执行)

因为原理中，每次触发完后还需要等待 wait 秒执行。  
但是某些场景，比如按钮点击后调用接口，会使整个时间变长，这时候就需要定义 immediate，点击按钮，立即执行调用接口，还要达到 wait 秒内防抖的效果。

```
function debounce(func, wait = 500, immediate = false) {
    let timeout, context, result, callNow;

    function showResult(e1, e2) {
        result = func.apply(e1, e2); // 绑定e1,e2的同时，输出result
        return result;
    }

    return function (...args) {
        context = this;
        // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 这里是立即执行的判断代码
            callNow = !timeout; // timeout最开始定义为undefined，如果未设置定时器，则!timeout返回true;否则返回false
            timeout = setTimeout(function () {
                timeout = null; // 这里时定时器走完，让timeout为null，则上一步!timeout依然返回true;
            }, wait);
            if (callNow) return showResult(context, args); //刚进入timeout=undefined以及，wait时间走完timeout = null，两种情况都会立即执行函数
        } else {
        // 这里是不立即执行的原代码
            timeout = setTimeout(function () {
                clearTimeout(timeout);
                return showResult(context, args); // 将this，arguments代入函数
            }, wait);
        }
        return result
    };
}
```

### 代码六(取消)

增加取消防抖的方法：只需要定义 cancel 方法，去除定时器，将初始变量全部设置为 undefined。

```
function debounce(func, wait = 500, immediate = false) {
    let timeout, context, result, callNow;

    function showResult(e1, e2) {
        result = func.apply(e1, e2); // 绑定e1,e2的同时，输出result
        return result;
    }

    const debounced = function (...args) {
        context = this;
        // 如果再次触发函数时，已有timeout，则清空销毁timeout，在往下执行
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 这里是立即执行的判断代码
            callNow = !timeout; // timeout最开始定义为undefined，如果未设置定时器，则!timeout返回true;否则返回false
            timeout = setTimeout(function () {
                timeout = null; // 这里时定时器走完，让timeout为null，则上一步!timeout依然返回true;
            }, wait);
            if (callNow) return showResult(context, args); //刚进入timeout=undefined以及，wait时间走完timeout = null，两种情况都会立即执行函数
        } else {
            // 这里是不立即执行的原代码
                timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    return showResult(context, args); // 将this，arguments代入函数
                }, wait);
        }
        return result
    };

    debounced.cancel = function () {
        // 去除定时器，
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        // 将初始变量全部设置为undefined
        timeout = context = result = callNow = undefined;
    };
    return debounced;
}
```

## 演示地址

可以去[Github 仓库](https://github.com/yihan12/Blog/tree/main/demos/debounce)查看演示代码

## 跟着大佬学系列

主要是日常对每个进阶知识点的摸透，跟着大佬一起去深入了解 JavaScript 的语言艺术。

后续会一直更新，希望各位看官不要吝啬手中的赞。

❤️ **感谢各位的支持！！！**

❤️ **如果有错误或者不严谨的地方，请务必给予指正，十分感谢！！！**

❤️ **喜欢或者有所启发，欢迎 star！！！**

## 参考

- [JavaScript 专题之跟着 underscore 学防抖](https://github.com/mqyqingfeng/Blog/issues/22)
- [underscore.js](https://underscorejs.net/docs/underscore.html)
- [深入浅出防抖函数 debounce](https://github.com/yygmind/blog/issues/39)
