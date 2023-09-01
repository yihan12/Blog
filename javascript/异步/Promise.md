# Promise 的三种状态,有什么区别？

- pending
- resolved
- rejected

pending->resolved 或者 pending->rejected

变化时不可逆的

1. pending 状态不会触发 then 和 catch
2. resolved 状态会触发后面的 then 回调函数
3. rejected 状态会触发后面的 catch 回调函数

# then 和 catch 改变状态

then 正常回调返回 resolved，如果有报错则返回 rejected
catch 正常回调返回 resolved,如果有报错返回 rejected

#
