# HTTP 协议

### 含义

> HTTP（Hyper Text Transfer Protocol）协议是超文本传输协议的缩写，它是从 WEB 服务器传输超文本标记语言(HTML)到本地浏览器的传送协议，位于 OSI 网络模型中的应用层。
>
> HTTP 是一个基于 TCP/IP 通信协议来传递数据的协议，传输的数据类型为 HTML 文件、图片文件、查询结果等。
>
> HTTP 协议一般用于 B/S 架构。浏览器作为 HTTP 客户端通过 URL 向 HTTP 服务端即 WEB 服务器发送所有请求。

HTTP 是一个属于应用层的面向对象的协议，由于其简捷、快速的方式，适用于分布式超媒体信息系统。

### HTTP 协议的主要特点可概括如下：

- 支持客户/服务器模式，也是一种请求/响应模式的协议。

- 简单快速：**客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有 GET、HEAD、POST**。每种方法规定了客户与服务器联系的类型不同。由于 HTTP 协议简单，使得 HTTP 服务器的程序规模小，因而通信速度很快。

- 灵活：HTTP 允许传输任意类型的数据对象。正在传输的类型由 Content-Type 加以标记。

- 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。但是却不利于客户端与服务器保持会话连接，为了弥补这种不足，产生了两项记录 http 状态的技术，一个叫做 Cookie,一个叫做 Session。

- 无状态：HTTP 协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

### HTTP 中间人攻击

HTTP 协议使用起来确实非常的方便，但是它存在一个致命的缺点：不安全。

我们知道 HTTP 协议中的报文都是以明文的方式进行传输，不做任何加密，这样会导致中间人攻击

#### 如何防止中间人攻击

既然 HTTP 是明文传输，那我们家加密不就好了

- 对称加密  
  对称加密 很好理解，即加密和解密使用的同一个密钥，是 对称 的。只要保证了密钥的安全，那整个通信过程就可以说具有了机密性。
  缺点： 这种加密方式固然很好，但是问题就在于如何让双方知道秘钥，术语叫“密钥交换”。因为传输数据都是走的网络，如果将秘钥通过网络的方式传递的话，一旦秘钥被截获就没有加密的意义的。
- 非对称加密
  也叫公钥加密算法，它有两个密钥，一个叫 公钥（public key），一个叫 私钥（private key）。两个密钥是不同的，不对称，公钥可以公开给任何人使用，而私钥必须严格保密。

公钥和私钥有个特别的 单向 性，虽然都可以用来加密解密，但公钥加密后只能用私钥解密，反过来，私钥加密后也只能用公钥解密。

**非对称加密可以解决 密钥交换 的问题。网站秘密保管私钥，在网上任意分发公钥，你想要登录网站只要用公钥加密就行了，密文只能由私钥持有者才能解密。而黑客因为没有私钥，所以就无法破解密文。**

这种加密方式就可以完美解决对称加密存在的问题。假设现在两端需要使用对称加密，那么在这之前，可以先使用非对称加密交换秘钥。

简单流程如下：首先服务端将公钥公布出去，那么客户端也就知道公钥了。接下来客户端创建一个秘钥，然后通过公钥加密并发送给服务端，服务端接收到密文以后通过私钥解密出正确的秘钥，这时候两端就都知道秘钥是什么了。

那么这样做就是绝对安全了吗？

所谓道高一尺魔高一丈，中间人为了对应这种加密方法又想出了一个新的破解方案，既然拿不到 私钥 ，那我就把自己模拟成一个客户端和服务器端的结合体，在 用户->中间人 的过程中，中间人模拟服务器的行为 ，这样可以拿到用户请求的明文，在 中间人->服务器 的过程中中间人模拟客户端行为，这样可以拿到服务器响应的明文，以此来进行中间人攻击

这一次通信再次被中间人截获，中间人自己也伪造了一对公私钥，并将公钥发送给用户以此来窃取客户端生成的 私钥 ，在拿到 私钥 之后就能轻松的进行解密了。

还是没有彻底解决中间人攻击问题，怎么办喃？接下来我们看看 HTTPS 是怎么解决通讯安全问题的。

# HTTPS

HTTPS 并非是应用层的一种新协议，其实是 HTTP+SSL/TLS 的简称。使用安全套接字层(SSL)进行信息交换，

- 对称加密：一个 key 同时复制加密和解密，非对称加密：一对 key，A 加密后只能用 B 解密
- http 明文传输

第三方证书 解决中间人攻击（服务端把证书给浏览器验证，验证成功后再进行非对称加密）。

### HTTP 和 HTTPS 的区别：

- HTTP 是超文本传输协议，信息是明文传输，HTTPS 则是具有安全性的 TLS（SSL）加密传输协议
- HTTP 和 HTTPS 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443
- HTTP 的连接很简单，是无状态的；HTTPS 协议是由 HTTP+SSL/TLS 协议构建的可进行加密传输、身份认证的网络协议，比 HTTPS 协议安全。

HTTPS 协议主要针对解决 HTTP 协议以下不足：

- 1、通信使用明文（不加密），内容可能会被窃听

- 2、不验证通信方身份，应此可能遭遇伪装

- 3、无法证明报文的完整性（即准确性），所以可能已遭篡改

  HTTP+加密+认证+完整性保护=HTTPS，HTTP 端口 80， HTTPS 端口 443

  HTTPS 采用对称加密、SSL 位于应用层于传输层 TCP 之间，原本数据由应用层直接交由传输层处理，现在会经过 SSL 加密再进行传输。

注意：HTTPS 也不是绝对安全的，针对 SSL 的中间人攻击方式主要有两类，分别是 SSL 劫持攻击和 SSL 剥离攻击。

SSL 劫持攻击就是 SSL 证书欺骗攻击，将自己接入到客户端和目标网站之间； 在传输过程中伪造服务器的证书，将服务器的公钥替换成自己的公钥。

### SSL/TSL

SSL 即安全套接层（Secure Sockets Layer），在 OSI 模型中处于第 5 层（会话层），SSL 发展到 v3 时改名为 TLS（传输层安全，Transport Layer Security），正式标准化，版本号从 1.0 重新算起，所以 TLS1.0 实际上就是 SSL v3.1。

到今天 TLS 已经发展出了三个版本，分别是 2006 年的 1.1、2008 年的 1.2 和去年（2018）的 1.3。1.2 版本用的最广泛

HTTPS 通过了 HTTP 来传输信息，但是信息通过 TLS 协议进行了加密

TLS 协议位于传输层之上，应用层之下。首次进行 TLS 协议传输需要两个 RTT ，接下来可以通过 Session Resumption 减少到一个 RTT

在 TLS 中使用了两种加密技术，分别为：对称加密和非对称加密，内容传输的加密上使用的是对称加密，非对称加密只作用在证书验证阶段：

### 请问对称加密与非对称加密有什么区别？

对称密钥加密是指加密和解密使用同一个密钥的方式，这种方式存在的最大问题就是密钥发送问题，即如何安全地将密钥发给对方；

而非对称加密是指使用一对非对称密钥，即公钥和私钥，公钥可以随意发布，但私钥只有自己知道。发送密文的一方使用对方的公钥进行加密处理，对方接收到加密信息后，使用自己的私钥进行解密。

由于非对称加密的方式不需要发送用来解密的私钥，所以可以保证安全性；但是和对称加密比起来，它非常的慢，所以我们还是要用对称加密来传送消息，但对称加密所使用的密钥我们可以通过非对称加密的方式发送出去。

### 请问 HTTP 的请求和响应由哪几个部分组成？

HTTP 请求信息由 3 部分组成：

1、请求方法（GET/POST）、URI、协议/版本

2、请求头(Request Header)：Content-Type、端口号 Host、Cookie

3、请求正文：包含客户提交的查询字符串信息，请求头和请求正文之间是一个空行

HTTP 响应也由 3 个部分构成：

1、状态行：状态代码及描述 如 404、500 等

2、响应头(Response Header)：Content-Type 、Server、Date

3、响应正文：html 代码
