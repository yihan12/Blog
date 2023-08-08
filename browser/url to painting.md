# 要点如下：

- 浏览器根据 DNS 服务器得到域名的 IP 地址
- 向这个 IP 的机器发送 HTTP 请求
- 服务器收到、处理并返回 HTTP 请求
- 浏览器得到返回内容

![image](https://github.com/yihan12/Blog/assets/44987698/d8237b82-84fb-4fd1-a1a7-10aba53d29f3)


![image](https://github.com/yihan12/Blog/assets/44987698/ba27247a-0d96-4bee-a200-c8ff09f0ed8b)


### 从输入一个URL到网页展示的过程

从输入URL到渲染出整个页面包括三个部分：

（1）、DNS解析URL

DNS解析就是寻找哪个服务器上有请求的资源，因为ip地址不易记忆，一般会使用URL域名（如www.baidu.com）作为网址，DNS解析就是将域名“翻译”成IP地址

具体过程：

a、浏览器缓存：浏览器会按照一定的频率，缓存DNS记录

b、操作系统缓存：如果浏览器缓存中找不到需要的DNS记录，就会取操作系统中找

c、路由缓存：路由器也有DNS缓存

d、ISP的DNS服务器：ISP有专门的DNS服务器应对DNS查询请求

e、根服务器：ISP的DNS服务器找不到，就要向根服务器发出请求，进行递归查询

（2）、浏览器发送请求与服务器交互

a、浏览器利用tcp协议通过三次握手与服务器建立连接

http请求包括header和body，header中包括请求的方式（get和post）、请求的协议 （http、https、ftp）、请求的地址ip、缓存cookie，body中有请求的内容

b、浏览器根据解析到的IP地址和端口号发起http的get请求

c、服务器接收到http请求之后，开始搜索html页面，并使用http返回响应报文

d、若状态码为200显示响应成功，浏览器接收到返回的HTML页面后，开始渲染页面

（3）、浏览器对接收到的HTML页面进行渲染

a、浏览器根据深度遍历的方式把HTML节点遍历成DOM树

b、将CSS解析成CSSOM树

c、将DOM树和CSSOM树构造成Render树

d、根据Render树计算所有节点在屏幕中的位置，进行布局（回流）

e、遍历Render树并调用硬件API绘制所有节点（重绘）

#### 总结

1. **域名解析**： 关键字： **host文件**、**DNS解析**、**得到IP地址**
2. **建立TCP连接**：  关键字：**tcp三次握手**、**HTTPS，还有TLS握手**
3. **浏览器发送请求，服务端接收请求**：
4. **浏览器渲染页面**：
5. **关闭TCP连接**：



### 域名解析

在客户端输入 URL 后，会有一个**递归查找**的过程，从**浏览器缓存**中查找->**本地的hosts文件**查找->找**本地DNS解析器缓存**查找->**本地DNS服务器**查找，这个过程中任何一步找到了都会结束查找流程。

![image](https://github.com/yihan12/Blog/assets/44987698/5a33805d-0800-43c6-84c2-824529549924)


* 根 DNS 服务器 ：返回顶级域 DNS 服务器的 IP 地址
* 顶级域 DNS 服务器：返回权威 DNS 服务器的 IP 地址
* 权威 DNS 服务器 ：返回相应主机的 IP 地址。

  ![image](https://github.com/yihan12/Blog/assets/44987698/274c6b8b-7041-4629-88c5-63012a9197e1)


### 建立TCP连接
首先，判断是不是https的，如果是，则HTTPS其实是HTTP + SSL / TLS 两部分组成，也就是在HTTP上又加了一层处理加密信息的模块。服务端和客户端的信息传输都会通过TLS进行加密，所以传输的数据都是加密后的数据。


### 浏览器渲染页面

![image](https://github.com/yihan12/Blog/assets/44987698/7ae65fce-357e-4e60-ba2d-ffb03c1f0616)


（1）、用户输入一个URL后，浏览器就会向服务器发出一个请求，请求URL对应的资源

（2）、接到服务器的响应内容后，浏览器的HTML解析器，会将HTML文件解析成一颗DOM树，DOM树的构建是一个深度遍历的过程，当前节点的所有子节点都构建完成后，才会去构建当前节点的下一个兄弟节点

（3）、将CSS解析成CSSOM树

（4）、根据DOM树与CSSOM树，构建Render Tree

（5）、浏览器会根据Render Tree能知道网页中哪些有节点，各个节点的CSS，以及各个节点的从属关系

（6）、计算出每个节点在屏幕中的位置后，最后一步就是Painting，根据计算出的规则，把内容画到屏幕上

