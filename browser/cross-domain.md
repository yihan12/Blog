# 什么是跨域？（CORS、同源策略）

> **同源策略：限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。**（来自MDN官方的解释）
>
> **受浏览器同源策略的限制，非同源的两个URL间不能通信，非同源的脚本不能操作其他源下面的对象**，但在实际开发场景中， 这种情况经常出现， 此时需要通过跨域进行非同源通信

跨域问题的来源是浏览器为了请求安全而引入的基于**同源策略的安全特性**。当页面和请求的协议、主机名或端口不同时，浏览器判定两者不同源，即为跨域请求。需要注意的是跨域是浏览器的限制，服务端并不受此影响。

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
   
### 2. CORS（Cross-Origin Resource Sharing）
> **CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。**

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

**服务端设置 Access-Control-Allow-Origin 就可以开启 CORS**。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。


### 3. **nginx反向代理**

5. **WebSocket**

6. **postMessage**
