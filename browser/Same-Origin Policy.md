# 什么是浏览器同源策略?

**同源**：如果两个 URL 的协议、域名（主机名）和端口都相同，我们就称这两个 URL 同源。  
这两个 URL 是同源的
```javascript
https://time.geekbang.org/?category=1
https://time.geekbang.org/?category=0
```

源：就是协议、域名和端口号

同源策略：**SOP（Same origin policy）是由Netscape公司1995年引入浏览器的一种约定**，是浏览器最核心、最基本的安全功能，**若缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击**。**所谓同源是指"协议+域名+端口"三者相同，若两个URL的协议、域名、端口号都相同**，则两者为同源，有一个不同则非同源，即便两个不同的域名指向同一个ip地址，也是非同源的

非同源的URL在没有明确授权的情况下，不能读写对方资源（不能相互通信）

具体来讲，同源策略主要表现在 **DOM、Web 数据和网络**这三个层面。

* 第一个，DOM 层面。同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。

* 第二个，数据层面。同源策略限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。由于同源策略，我们依然无法通过第二个页面的 opener 来访问第一个页面中的 Cookie、IndexDB 或者 LocalStorage 等内容。你可以自己试一下，这里我们就不做演示了。

* 第三个，网络层面。同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。你还记得在《17 | WebAPI：XMLHttpRequest 是怎么实现的？》这篇文章的末尾分析的 XMLHttpRequest 在使用过程中所遇到的坑吗？其中第一个坑就是在默认情况下不能访问跨域的资源。
