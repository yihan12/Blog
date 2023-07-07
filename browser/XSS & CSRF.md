# 概览

- **XSS**：XSS 全称是 Cross Site Scripting，为了与“CSS”区分开来，故简称 XSS，翻译过来就是“跨站脚本”。XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。
- **CSRF**: CSRF 英文全称是 Cross-site request forgery，所以又称为“跨站请求伪造”，是指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。简单来讲，CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事
- **中间人攻击**：是指攻击者与通讯的两端分别创建独立的联系，在通讯中充当一个中间人角色对数据进行监听、拦截甚至篡改。

### Cross-site request forgery(CSRF)

#### 案例
一个真实的案例：用户 David 在自己邮箱内点击了黑客恶意伪装的链接。黑客在点击的链接里冒充用户(cookie)向 Gmail 服务器发送邮件自动转发请求，导致 David 的邮件都被自动转发到了黑客的邮箱，从而被黑客利用盗取了用户数据。

#### CSRF 常见的攻击方式与防护策略
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
