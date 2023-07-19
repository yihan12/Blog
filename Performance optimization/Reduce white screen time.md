# 如何减少白屏的时间
资源优化 预加载 服务端渲染 性能监控指标 HTTP/2

### 1. 前端性能监控指标
性能优化的前置条件是性能有测量标准并可以被监控。常用的性能监控指标有以下几块。

Navigation Timing API：

* responseStart - fetchStart：收到首字节的耗时
* domContentLoadedEventEnd - fetchStart：HTML 加载完成耗时
* loadEventStart - fetchStart：页面完全加载耗时
* domainLookupEnd - domainLookupStart：DNS 解析耗时
* connectEnd - connectStart：TCP 连接耗时
* responseStart - requestStart：Time to First Byte（TTFB）
* responseEnd - responseStart：数据传输耗时
* domInteractive - responseEnd：DOM 解析耗时
* loadEventStart - domContentLoadedEventEnd：资源加载耗时（页面中同步加载的资源)


Lighthouse Performance：

* FP（First Paint）：首次绘制
* FCP（First Contentful Paint）：首次内容绘制
* FMP（First Meaningful Paint）：首次有效绘制
* LCP（Largest Contentful Paint）：最大可见元素绘制
* TTI（Time to Interactive）：可交互时间
* TTFB（Time to First Byte）：浏览器接收第一个字节的时间

除了上面之外，UC 内核也有一套性能监控指标：

* T0：Blink 收到 HTTP Head 的时间。
* T1：首屏有内容显示的时间。
* T2：首屏全部显示出来的时间。

### 2. DNS 解析优化
DNS 解析优化是性能优化重要的一环，DNS 的作用是根据域名获取对应的 IP 地址，获取之后后续的 HTTP 流程才能进行下去。

DNS 解析是一个开销较大的过程，一次 DNS 解析通常需要耗费几十到上百毫秒，而在移动端网络或其他弱网环境下 DNS 解析延迟会更加严重，对 DNS 解析优化则可以减少这一步骤的耗时。

#### 2.1 DNS 预解析
我们可以通过 DNS 预解析的方式提前获取 IP 地址，以缩短后续请求的响应时间。

前端可以通过 dns-prefetch 预解析，具体方式如下：

<link rel="dns-prefetch" href="https://hzfe.org/" />

#### 2.2 域名收敛
域名收敛的目的是减少页面中域名的数量，从而减少所需的 DNS 解析次数，最终减少页面的 DNS 解析过程的耗时，加快页面加载速度。

### 3. TCP 连接优化
前端可以通过 preconnect 在请求发送前预先执行一些操作，这些操作包括 DNS 解析，TCP 握手 和 TLS 协商。具体方式如下：
```
<link href="https://hzfe.org" rel="preconnect" />
```
### 4. 请求优化
通过使用 HTTP/2 协议，可以依赖 HTTP/2 的多路复用、首部压缩、二进制分帧和服务端推送等特性，从而加快整体请求的响应速度，加快页面的渲染展示。

### 5. 页面解析优化
浏览器获取 HTML 文件后，需要对 HTML 解析，然后才能开始渲染页面，这个过程中页面也是处于白屏状态。通过对这一过程进行优化可以加快页面的渲染展示。

#### 5.1 服务端渲染（Server-Side Rendering）
目前流行的前后端分离的开发模式，由于前端需要等待 JS 文件和接口加载完成之后才能渲染页面，导致白屏时间变长。服务端渲染是指在服务端将页面的渲染逻辑处理好，然后将处理好的 HTML 直接返回给前端展示。这样即可减少页面白屏的时间。

#### 5.2 预渲染
除了服务端渲染之外，还可以在前端打包时使用 prerender-spa-plugin 之类的插件进行简单的预渲染，减少页面白屏的时间。

### 6. 资源加载优化和页面渲染优化
浏览器解析 HTML 的同时会加载相关的资源，通过对资源的加载过程进行优化也可以减少页面的白屏时间。

#### 6.1 骨架屏
骨架屏是在需要等待加载内容的位置提供一些图形组合占位，提前给用户描述页面的基础结构，等待数据加载完成之后，再替换成实际的内容。

骨架屏可以在数据加载前，提前渲染页面，缩短白屏时间，提升用户体验。

#### 6.2 静态资源优化
静态资源的优化主要分为两个方向：减小资源大小，加快资源加载速度。

减小资源大小

* Gzip 压缩文件
* JS 文件拆分，动态加载
* 加快资源加载速度

* CDN（Content Delivery Network）
* HTTP/2
  
#### 6.3 资源预加载
prefetch

前端可以使用 prefetch 来指定提前获取之后需要使用到的资源，浏览器将会在空闲的时候加载资源，例如:
```
<link rel="prefetch" href="https://hzfe.org/index.js" as="script" />
```
preload

前端可以使用 preload 来指定提前获取之后需要使用到的资源，浏览器将会立即加载对应资源，在解析到对应资源时即可立即执行，例如:
```
<link rel="preload" href="https://hzfe.org/index.js" as="script" />
```
quicklink

quicklink 是 Google 开源的预加载库，quicklink 会判断链接进入视口之后，在闲时预加载。quicklink 实际上加速的是次级页面。

### 7. 接口请求优化
浏览器在加载完 HTML 和资源之后，一般需要请求接口获取数据之后才会完整渲染页面，对接口请求进行优化也可加快页面的展示。

接口合并

过多的接口请求会影响页面初始化时的渲染过程，可以通过增加一层中间层合并部分请求，达到加速页面展示的目的。

