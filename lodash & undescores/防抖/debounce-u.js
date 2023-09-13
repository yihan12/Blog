// 处理传入函数的this指向以及arguments参数
import restArguments from './restArguments.js';
// 当前时间戳
import now from './now.js';

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
    var timeout, previous, args, result, context;

    var later = function () {
        var passed = now() - previous; // 当前触发时间减去前面设置timeout的时间
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            // This check is needed because `func` can recursively invoke `debounced`.
            if (!timeout) args = context = null;
        }
    };

    var debounced = restArguments(function (_args) {
        context = this;
        args = _args;
        previous = now(); // 重新触发debounced会重新定义previous
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);  //如果需要立即执行，则直接执行当前函数
        }
        return result;
    });

    // 取消
    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}