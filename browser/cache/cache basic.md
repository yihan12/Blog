# 概览

> 浏览器缓存，也就是客户端缓存，既是网页性能优化里面静态资源相关优化的一大利器，也是无数web开发人员在工作过程不可避免的一大问题，所以在产品开发的时候我们总是想办法避免缓存产生，而在产品发布之时又在想策略管理缓存提升网页的访问速度。

它分为**强缓存**和**协商缓存**：
- 1）浏览器在加载资源时，先根据这个资源的一些http header判断它是否命中强缓存，强缓存如果命中，浏览器直接从自己的缓存中读取资源，不会发请求到服务器。比如某个css文件，如果浏览器在加载它所在的网页时，这个css文件的缓存配置命中了强缓存，浏览器就直接从缓存中加载这个css，连请求都不会发送到网页所在服务器；

- 2）当强缓存没有命中的时候，浏览器一定会发送一个请求到服务器，通过服务器端依据资源的另外一些http header验证这个资源是否命中协商缓存，如果协商缓存命中，服务器会将这个请求返回，但是不会返回这个资源的数据，而是告诉客户端可以直接从缓存中加载这个资源，于是浏览器就又会从自己的缓存中去加载这个资源；

- 3）强缓存与协商缓存的共同点是：如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源数据；区别是：强缓存不发请求到服务器，协商缓存会发请求到服务器。

- 4）当协商缓存也没有命中的时候，浏览器直接从服务器加载资源数据。

#### 常见的HTTP 缓存首部字段有：

- Expires：响应头，代表该资源的过期时间

- Cache-Control：请求/响应头，缓存控制字段，精确控制缓存策略

- If-Modified-Since：请求头，资源最近修改时间，由浏览器告诉服务器

- Last-Modified：响应头，资源最近修改时间，由服务器告诉浏览器

- Etag：响应头，资源标识，由服务器告诉浏览器

- If-None-Match：请求头，缓存资源标识，由浏览器告诉服务器

其中， 强缓存 ：

- Expires（HTTP/1.0）
- Cache-Control（HTTP/1.1）

协商缓存：

- Last-Modified 和 If-Modified-Since（HTTP/1.0）
- ETag 和 If-None-Match（HTTP/1.1）


# 强缓存

> Expires（**HTTP/1.0**）  
> Cache-Control（**HTTP/1.1**）  
> 强缓存是利用Expires或者Cache-Control这两个http response header实现的，它们都用来表示资源在客户端缓存的有效期。   
> 通常有2种方式来设置是否启用强缓存：  
> 1）通过代码的方式，在web服务器返回的响应中添加Expires和Cache-Control Header；  
> 2）通过配置web服务器的方式，让web服务器在响应资源的时候统一添加Expires和Cache-Control Header。  

**注意：当response header中，Expires和Cache-Control同时存在时，Cache-Control优先级高于Expires。** 

**注意：可以通过 Expires / Cache-Control 控制，命中强缓存时不会发起网络请求，资源直接从本地获取，浏览器显示状态码 200 from cache。**

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
> 发送如下响应头可以关闭缓存。此外，可以参考Expires和Pragma消息头。
```
Cache-Control: no-store
```
缓存静态资源  
> 对于应用程序中不会改变的文件，你通常可以在发送响应头前添加积极缓存。这包括例如由应用程序提供的静态文件，例如图像，CSS 文件和 JavaScript 文件。另请参阅 Expires 标题。
```
Cache-Control:public, max-age=31536000
```
需要重新验证  
> 指定 no-cache 或 max-age=0, must-revalidate 表示客户端可以缓存资源，每次使用缓存资源前都必须重新验证其有效性。这意味着每次都会发起 HTTP 请求，但当缓存内容仍有效时可以跳过 HTTP 响应体的下载。

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

### 强缓存的管理
启用强缓存：

1）通过代码的方式，在web服务器返回的响应中添加Expires和Cache-Control Header；

2）通过配置web服务器的方式，让web服务器在响应资源的时候统一添加Expires和Cache-Control Header。

比如在javaweb里面，我们可以使用类似下面的代码设置强缓存：

```java
java.util.Date date = new java.util.Date();    
response.setDateHeader("Expires",date.getTime()+20000); //Expires:过时期限值 
response.setHeader("Cache-Control", "public"); //Cache-Control来控制页面的缓存与否,public:浏览器和缓存服务器都可以缓存页面信息；
response.setHeader("Pragma", "Pragma"); //Pragma:设置页面是否缓存，为Pragma则缓存，no-cache则不缓存
```
还可以通过类似下面的java代码设置不启用强缓存：
```java
response.setHeader( "Pragma", "no-cache" );   
response.setDateHeader("Expires", 0);   
response.addHeader( "Cache-Control", "no-cache" );//浏览器和缓存服务器都不应该缓存页面信息
```

由于在开发的时候不会专门去配置强缓存，而浏览器又默认会缓存图片，css和js等静态资源，所以开发环境下经常会因为强缓存导致资源没有及时更新而看不到最新的效果，解决这个问题的方法有很多，常用的有以下几种：

1）直接ctrl+f5，这个办法能解决页面直接引用的资源更新的问题；

2）使用浏览器的隐私模式开发；

3）如果用的是chrome，可以f12在network那里把缓存给禁掉（这是个非常有效的方法）：

![image](https://github.com/yihan12/Blog/assets/44987698/69cb5982-660e-405e-8ec4-d844b6160d8e)


4）在开发阶段，给资源加上一个动态的参数，如css/index.css?v=0.0001，由于每次资源的修改都要更新引用的位置，同时修改参数的值，所以操作起来不是很方便，除非你是在动态页面比如jsp里开发就可以用服务器变量来解决（v=${sysRnd}），或者你能用一些前端的构建工具来处理这个参数修改的问题；

5）如果资源引用的页面，被嵌入到了一个iframe里面，可以在iframe的区域右键单击重新加载该页面，以chrome为例：

![image](https://github.com/yihan12/Blog/assets/44987698/b1edcf61-f97c-4af4-a92b-833adf52055e)


6）如果缓存问题出现在ajax请求中，最有效的解决办法就是ajax的请求地址追加随机数；

7）还有一种情况就是动态设置iframe的src时，有可能也会因为缓存问题，导致看不到最新的效果，这时候在要设置的src后面添加随机数也能解决问题；

8）如果你用的是grunt和gulp这种前端工具开发，通过它们的插件比如grunt-contrib-connect来启动一个静态服务器，则完全不用担心开发阶段的资源更新问题，因为在这个静态服务器下的所有资源返回的respone header中，cache-control始终被设置为不缓存：

![image](https://github.com/yihan12/Blog/assets/44987698/123d1fb2-0b04-4c65-a44e-e1025a9428d5)

# 协商缓存

**协商缓存是利用的是【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】这两对Header来管理的。**

当浏览器对某个资源的请求没有命中强缓存，就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的http状态为**304**并且会显示一个**Not Modified**的字符串，比如你打开京东的首页，按f12打开开发者工具，再按f5刷新页面，查看network，可以看到有不少请求就是命中了协商缓存的：

![image](https://github.com/yihan12/Blog/assets/44987698/ba8614f2-65bd-46bc-8953-7abd9ba01508)

### 【Last-Modified，If-Modified-Since]

> Last-Modified 是一个响应首部，其中包含源头服务器认定的资源做出修改的日期及时间。它通常被用作一个验证器来判断接收到的或者存储的资源是否彼此一致。由于精确度比 ETag 要低，所以这是一个备用机制。包含有 If-Modified-Since 或 If-Unmodified-Since 首部的条件请求会使用这个字段。  
> If-Modified-Since 是一个条件式请求首部，服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200 。如果请求的资源从那时起未经修改，那么返回一个不带有消息主体的 304 响应，而在 Last-Modified 首部中会带有上次修改时间。不同于 If-Unmodified-Since, If-Modified-Since 只可以用在 GET 或 HEAD 请求中。

#### 原理：
1）浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在respone的header加上Last-Modified的header，这个header表示这个资源在服务器上的最后修改时间：

![image](https://github.com/yihan12/Blog/assets/44987698/97d2dbd9-3d4d-47d5-a7f2-5dd71a44750b)


2）浏览器再次跟服务器请求这个资源时，在request的header上加上If-Modified-Since的header，这个header的值就是上一次请求时返回的Last-Modified的值：

![image](https://github.com/yihan12/Blog/assets/44987698/6e22c453-8b72-4ef2-9b9b-72899d370adb)


3）服务器再次收到资源请求时，根据浏览器传过来If-Modified-Since和资源在服务器上的最后修改时间判断资源是否有变化，如果没有变化则返回304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。当服务器返回304 Not Modified的响应时，response header中不会再添加Last-Modified的header，因为既然资源没有变化，那么Last-Modified也就不会改变，这是服务器返回304时的response header：

![image](https://github.com/yihan12/Blog/assets/44987698/88eebce5-2bbb-4e60-a325-aa4283215588)


4）浏览器收到304的响应后，就会从缓存中加载资源。

5）如果协商缓存没有命中，浏览器直接从服务器加载资源时，Last-Modified Header在重新加载的时候会被更新，下次请求时，If-Modified-Since会启用上次返回的Last-Modified值。

【Last-Modified，If-Modified-Since】都是根据服务器时间返回的header，一般来说，在没有调整服务器时间和篡改客户端缓存的情况下，这两个header配合起来管理协商缓存是非常可靠的，但是有时候也会服务器上资源其实有变化，但是最后修改时间却没有变化的情况，而这种问题又很不容易被定位出来，而当这种情况出现的时候，就会影响协商缓存的可靠性。所以就有了另外一对header来管理协商缓存，这对header就是【ETag、If-None-Match】。

### 【ETag、If-None-Match】

#### 原理：

1）浏览器第一次跟服务器请求一个资源，服务器在返回这个资源的同时，在respone的header加上ETag的header，这个header是服务器根据当前请求的资源生成的一个唯一标识，这个唯一标识是一个字符串，只要资源有变化这个串就不同，跟最后修改时间没有关系，所以能很好的补充Last-Modified的问题：

![image](https://github.com/yihan12/Blog/assets/44987698/22fd09c9-12dc-44a0-9046-47186c0a4fa4)


2）浏览器再次跟服务器请求这个资源时，在request的header上加上If-None-Match的header，这个header的值就是上一次请求时返回的ETag的值：

![image](https://github.com/yihan12/Blog/assets/44987698/d6954c1c-aa40-4619-951a-728762e2b7da)


3）服务器再次收到资源请求时，根据浏览器传过来If-None-Match和然后再根据资源生成一个新的ETag，如果这两个值相同就说明资源没有变化，否则就是有变化；如果没有变化则返回304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。与Last-Modified不一样的是，当服务器返回304 Not Modified的响应时，由于ETag重新生成过，response header中还会把这个ETag返回，即使这个ETag跟之前的没有变化：

![image](https://github.com/yihan12/Blog/assets/44987698/18a3f0c3-fd12-4569-9feb-032d4048d822)

4）浏览器收到304的响应后，就会从缓存中加载资源。

#### 应用
协商缓存跟强缓存不一样，强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。大部分web服务器都默认开启协商缓存，而且是同时启用【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】，比如apache:

![image](https://github.com/yihan12/Blog/assets/44987698/565afaac-8825-4409-9c1c-00e68ca81cb4)


如果没有协商缓存，每个到服务器的请求，就都得返回资源内容，这样服务器的性能会极差。

【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】一般都是同时启用，这是为了处理Last-Modified不可靠的情况。有一种场景需要注意：

分布式系统里多台机器间文件的Last-Modified必须保持一致，以免负载均衡到不同机器导致比对失败；

分布式系统尽量关闭掉ETag(每台机器生成的ETag都会不一样）；

京东页面的资源请求，返回的repsones header就只有Last-Modified，没有ETag：

![image](https://github.com/yihan12/Blog/assets/44987698/50f7ebb8-5bcf-44e8-8ae9-00d3b2d6a13c)


协商缓存需要配合强缓存使用，你看前面这个截图中，除了Last-Modified这个header，还有强缓存的相关header，因为如果不启用强缓存的话，协商缓存根本没有意义。

### 浏览器的刷新影响
- 1）当ctrl+f5强制刷新网页时，直接从服务器加载，跳过强缓存和协商缓存；

- 2）当f5刷新网页时，跳过强缓存，但是会检查协商缓存；
