### 如何减少白屏的时间
资源优化 预加载 服务端渲染 性能监控指标 HTTP/2

#### 1. 前端性能监控指标
性能优化的前置条件是性能有测量标准并可以被监控。常用的性能监控指标有以下几块。

Navigation Timing API：

responseStart - fetchStart：收到首字节的耗时
domContentLoadedEventEnd - fetchStart：HTML 加载完成耗时
loadEventStart - fetchStart：页面完全加载耗时
domainLookupEnd - domainLookupStart：DNS 解析耗时
connectEnd - connectStart：TCP 连接耗时
responseStart - requestStart：Time to First Byte（TTFB）
responseEnd - responseStart：数据传输耗时
domInteractive - responseEnd：DOM 解析耗时
loadEventStart - domContentLoadedEventEnd：资源加载耗时（页面中同步加载的资源)
Lighthouse Performance：

FP（First Paint）：首次绘制
FCP（First Contentful Paint）：首次内容绘制
FMP（First Meaningful Paint）：首次有效绘制
LCP（Largest Contentful Paint）：最大可见元素绘制
TTI（Time to Interactive）：可交互时间
TTFB（Time to First Byte）：浏览器接收第一个字节的时间
除了上面之外，UC 内核也有一套性能监控指标：

T0：Blink 收到 HTTP Head 的时间。
T1：首屏有内容显示的时间。
T2：首屏全部显示出来的时间。
2. DNS 解析优化
DNS 解析优化是性能优化重要的一环，DNS 的作用是根据域名获取对应的 IP 地址，获取之后后续的 HTTP 流程才能进行下去。

DNS 解析是一个开销较大的过程，一次 DNS 解析通常需要耗费几十到上百毫秒，而在移动端网络或其他弱网环境下 DNS 解析延迟会更加严重，对 DNS 解析优化则可以减少这一步骤的耗时。
