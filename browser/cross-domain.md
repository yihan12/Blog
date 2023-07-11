# 什么是跨域？（CORS、同源策略）

> **同源策略：限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。**（来自MDN官方的解释）
>
> **受浏览器同源策略的限制，非同源的两个URL间不能通信，非同源的脚本不能操作其他源下面的对象**，但在实际开发场景中， 这种情况经常出现， 此时需要通过跨域进行非同源通信

跨域问题的来源是浏览器为了请求安全而引入的基于**同源策略的安全特性**。当页面和请求的协议、主机名或端口不同时，浏览器判定两者不同源，即为跨域请求。需要注意的是跨域是浏览器的限制，服务端并不受此影响。

出于安全性，浏览器限制脚本内发起的跨源 HTTP 请求。例如，XMLHttpRequest 和 Fetch API 遵循同源策略。这意味着使用这些 API 的 Web 应用程序只能从加载应用程序的同一个域请求 HTTP 资源，除非响应报文包含了正确 CORS 响应头。

当产生跨域时，我们可以通过 JSONP、CORS、postMessage 等方式解决。

# 同源策略有什么限制

* 源包括三个部分：**协议、域名、端口（http协议的默认端口是80）**。如果有任何一个部分不同，则源不同，那就是跨域了。
* 限制：这个源的文档没有权利去操作另一个源的文档。这个限制体现在：（要记住）
  * **Cookie、LocalStorage和IndexDB无法获取。**
  * **无法获取和操作DOM。**
  * **不能发送Ajax请求。我们要注意，Ajax只适合同源的通信。**
 
但是有三个标签是允许跨域加载资源：

* `<img src=XXX>`
* `<link href=XXX>`
* `<script src=XXX>`

 特别说明两点：

第一：如果是协议和端口造成的跨域问题“前台”是无能为力的。

第二：在跨域问题上，仅仅是通过“URL的首部”来识别而不会根据域名对应的IP地址是否相同来判断。“URL的首部”可以理解为“协议, 域名和端口必须匹配”。

这里你或许有个疑问：请求跨域了，那么请求到底发出去没有？

跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会?因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。

# 常见通信方式
* **ajax:不支持跨域。**
* **WebSocket:不受同源策略的限制，支持跨域**
* **跨域资源共享(CORS):不受同源策略的限制，支持跨域。一种新的通信协议标准。可以理解成是：同时支持同源和跨域的Ajax。**

# 常见的跨域方式

### 1.jsonp
> **利用 <script> 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。**

原理：  
**利用<script>标签进行跨域 只能实现GET请求**  

优缺点：  
JSONP优点是**简单兼容性好**，可用于解决主流浏览器的跨域数据访问的问题。缺点是**仅支持get方法**具有局限性,不安全可能会遭受XSS攻击。

JSONP的实现流程:  
* 声明一个回调函数，其函数名(如show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的data)。
* 创建一个<script>标签，把那个跨域的API数据接口地址，赋值给script的src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
* 服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是show，它准备好的数据是show('我不爱你')。
* 最后服务器把准备的数据通过HTTP协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。

示例：  
```javascript
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: 'Iloveyou' },
  callback: 'show'
}).then(data => {
  console.log(data)
})
```
   
### 2. CORS（Cross-Origin Resource Sharing）跨域资源共享
> **CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。**
>
> CORS为什么支持跨域：**跨域时，浏览器会拦截Ajax请求，并在http头中加Origin**。跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。**跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了**。

**跨域实际上是浏览器拦截了响应，实际的请求已经发送成功。**  

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。后端允许CORS跨域，前端设置代理链接和允许带上cookie。  
> 后端header设置
Access-Control-Allow-Origin不可以为 *，因为 *会和 Access-Control-Allow-Credentials:true 冲突，需配置指定的地址。如：
```javascript
access-control-allow-credentials: true
access-control-allow-origin: http://localhost:9123
```
> 前端设置，以vue+axios举个例子

```javascript
// 此处是允许带上cookie
axios.defaults.withCredentials = true;
```

**我们在开发环境，不需要代理，是因为现在前后端分离的潮流，都是node服务器起的代理proxyTable**
```javascript
proxy: {
  "/fd": {
    target:
      process.env.NODE_ENV === "production"
        ? "http://m.domian1.com"
        : "http://test.domain.com",
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      "/fd": "/"
    }
  }
},
```

**服务端设置 Access-Control-Allow-Origin 就可以开启 CORS**。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。只要服务器返回的相应中包含头部信息**Access-Control-Allow-Origin: domain-name，domain-name为允许跨域的域名，也可以设置成***，浏览器就会允许本次跨域请求。

跨源资源共享标准新增了一组 HTTP 标头字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 **OPTIONS 方法发起一个预检请求（preflight request）**，从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（例如 Cookie 和 HTTP 认证相关数据）。

**简单请求**  
不会触发预检请求的称为简单请求（**某些请求不会触发 CORS 预检请求**）。当请求满足以下条件时就是一个简单请求：
- 请求方法：GET、HEAD、POST。
- 请求头：Accept、Accept-Language、Content-Language、Content-Type（需要注意额外的限制）、Range（只允许简单的范围标头值 如 bytes=256- 或 bytes=127-255）。
- Content-Type 仅支持：application/x-www-form-urlencoded、multipart/form-data、text/plain
- 如果请求是使用 XMLHttpRequest 对象发出的，在返回的 XMLHttpRequest.upload 对象属性上没有注册任何事件监听器；也就是说，给定一个 XMLHttpRequest 实例 xhr，没有调用 xhr.upload.addEventListener()，以监听该上传请求。
- 请求中没有使用 ReadableStream 对象。

**需预检请求**  
当一个请求不满足以上简单请求的条件时，浏览器会自动向服务端发送一个**OPTIONS 请求**，通过**服务端返回的 Access-Control-Allow-* 判定请求是否被允许**。

CORS 引入了以下几个  
- Access-Control-Allow-* ：开头：
- Access-Control-Allow-Origin 表示允许的来源
- Access-Control-Allow-Methods 表示允许的请求方法
- Access-Control-Allow-Headers 表示允许的请求头
- Access-Control-Allow-Credentials 表示允许携带认证信息

当请求符合响应头的这些条件时，浏览器才会发送并响应正式的请求。



### 3. **nginx反向代理**

5. **WebSocket**

6. **postMessage**
