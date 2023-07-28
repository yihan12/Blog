# 概览

> 浏览器缓存，也就是客户端缓存，既是网页性能优化里面静态资源相关优化的一大利器，也是无数web开发人员在工作过程不可避免的一大问题，所以在产品开发的时候我们总是想办法避免缓存产生，而在产品发布之时又在想策略管理缓存提升网页的访问速度。

它分为**强缓存**和**协商缓存**：
- 1）浏览器在加载资源时，先根据这个资源的一些http header判断它是否命中强缓存，强缓存如果命中，浏览器直接从自己的缓存中读取资源，不会发请求到服务器。比如某个css文件，如果浏览器在加载它所在的网页时，这个css文件的缓存配置命中了强缓存，浏览器就直接从缓存中加载这个css，连请求都不会发送到网页所在服务器；

- 2）当强缓存没有命中的时候，浏览器一定会发送一个请求到服务器，通过服务器端依据资源的另外一些http header验证这个资源是否命中协商缓存，如果协商缓存命中，服务器会将这个请求返回，但是不会返回这个资源的数据，而是告诉客户端可以直接从缓存中加载这个资源，于是浏览器就又会从自己的缓存中去加载这个资源；

- 3）强缓存与协商缓存的共同点是：如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源数据；区别是：强缓存不发请求到服务器，协商缓存会发请求到服务器。

- 4）当协商缓存也没有命中的时候，浏览器直接从服务器加载资源数据。

# 强缓存

> Expires（**HTTP/1.0**）  
> Cache-Control（**HTTP/1.1**）  
> 强缓存是利用Expires或者Cache-Control这两个http response header实现的，它们都用来表示资源在客户端缓存的有效期。  
> 通常有2种方式来设置是否启用强缓存：  
> 1）通过代码的方式，在web服务器返回的响应中添加Expires和Cache-Control Header；  
> 2）通过配置web服务器的方式，让web服务器在响应资源的时候统一添加Expires和Cache-Control Header。  

### 原理
当浏览器对某个资源的请求命中了强缓存时，返回的**http状态为200**，在chrome的开发者工具的network里面size会显示为**from disk cache**，比如京东的首页里就有很多静态资源配置了强缓存，用chrome打开几次，再用f12查看network，可以看到有不少请求就是从缓存中加载的：

![image](https://github.com/yihan12/Blog/assets/44987698/f79ca7cf-42ef-407b-b9b7-d3ce890c8210)


### Expires

> 如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。

#### 语法:
```
Expires: <http-date>
```

#### 示例：
```
Expires: Wed, 21 Oct 2023 07:00:00 GMT
```

#### 原理：

1）浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在respone的header加上Expires的header，如：

![image](https://github.com/yihan12/Blog/assets/44987698/517c35d2-aadd-496b-b326-a155c4a6646a)


2）浏览器在接收到这个资源后，会把这个资源连同所有response header一起缓存下来（所以缓存命中的请求返回的header并不是来自服务器，而是来自之前缓存的header）；

3）浏览器再请求这个资源时，先从缓存中寻找，找到这个资源后，拿出它的Expires跟当前的请求时间比较，如果请求时间在Expires指定的时间之前，就能命中缓存，否则就不行。

4）如果缓存没有命中，浏览器直接从服务器加载资源时，Expires Header在重新加载的时候会被更新。

### Cache-Control

> Expires是较老的强缓存管理header，由于它是服务器返回的一个**绝对时间**，在服务器时间与客户端时间相差较大时，缓存管理容易出现问题，比如随意修改下客户端时间，就能影响缓存命中的结果。  
> 所以在http1.1的时候，提出了一个新的header，就是Cache-Control，这是一个相对时间，在配置缓存的时候，以秒为单位，用数值表示，如：Cache-Control:max-age=315360000.
> Cache-Control 通用消息头字段，被用于在 http 请求和响应中，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

#### 指令
请求指令
```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```
响应指令
```
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```

#### 示例
禁止缓存
发送如下响应头可以关闭缓存。此外，可以参考Expires和Pragma消息头。
```
Cache-Control: no-store
```
缓存静态资源
对于应用程序中不会改变的文件，你通常可以在发送响应头前添加积极缓存。这包括例如由应用程序提供的静态文件，例如图像，CSS 文件和 JavaScript 文件。另请参阅 Expires 标题。
```
Cache-Control:public, max-age=31536000
```
需要重新验证
指定 no-cache 或 max-age=0, must-revalidate 表示客户端可以缓存资源，每次使用缓存资源前都必须重新验证其有效性。这意味着每次都会发起 HTTP 请求，但当缓存内容仍有效时可以跳过 HTTP 响应体的下载。

```
Cache-Control: no-cache
```
```
Cache-Control: max-age=0, must-revalidate
```
**注意: 如果服务器关闭或失去连接，下面的指令可能会造成使用缓存。**

```
Cache-Control: max-age=0
```
#### 原理：

1）浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在respone的header加上Cache-Control的header，如：

![image](https://github.com/yihan12/Blog/assets/44987698/8b3323b4-3b56-431e-aa61-ad74f7c3b1e5)


2）浏览器在接收到这个资源后，会把这个资源连同所有response header一起缓存下来；

3）浏览器再请求这个资源时，先从缓存中寻找，找到这个资源后，根据它第一次的请求时间和Cache-Control设定的有效期，计算出一个资源过期时间，再拿这个过期时间跟当前的请求时间比较，如果请求时间在过期时间之前，就能命中缓存，否则就不行。

4）如果缓存没有命中，浏览器直接从服务器加载资源时，Cache-Control Header在重新加载的时候会被更新。

Cache-Control描述的是一个相对时间，在进行缓存命中的时候，都是利用客户端时间进行判断，所以相比较Expires，Cache-Control的缓存管理更有效，安全一些。

这两个header可以只启用一个，也可以同时启用，当response header中，Expires和Cache-Control同时存在时，Cache-Control优先级高于Expires：

![image](https://github.com/yihan12/Blog/assets/44987698/50340a39-eedd-428a-90d9-92a2307906e4)


