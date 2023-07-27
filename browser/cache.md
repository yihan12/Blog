# 概览
> 缓存可以重复利用文件，降低网络负荷，提高网页打开速度，提升用户体验

![image](https://github.com/yihan12/Blog/assets/44987698/bce57bed-cc89-40ff-aed7-e1267eaeb9ef)

![image](https://github.com/yihan12/Blog/assets/44987698/a0ece8ed-6294-4d91-9111-cbe66c95bde2)

# 缓存分类：

从宏观上分为私有缓存和共享缓存，共享缓存就是那些能被各级代理缓存的缓存，私有缓存就是用户专享的，各级代理不能缓存

从微观上可以分为以下几类：

- a、浏览器缓存

- b、代理服务器缓存

- c、CDN缓存

- d、数据库缓存

- e、应用层缓存

### （1）、HTTP缓存：主要分为强缓存与协商缓存

#### 强缓存

强可理解为强制的意思，当浏览器去请求某个文件的时候，服务端就在respone header里面对该文件做了缓存配置。缓存的时间、缓存类型都由服务端控制，具体由 respone header 的cache-control 控制，常见的设置是max-age public private no-cache no-store等，各类设置对应情况：

a、cache-control: max-age=xxxx，public

客户端和代理服务器都可以缓存该资源，客户端在xxx秒的有效期内，如果有请求该资源的需求的话就直接读取缓存，statu code200 ，如果用户做了刷新操作，就向服务器发起http请求

b、cache-control: max-age=xxxx，private

只让客户端可以缓存该资源；代理服务器不缓存，客户端在xxx秒内直接读取缓存，statu code:200

c、cache-control: max-age=xxxx，immutable

客户端在xxx秒的有效期内，如果有请求该资源的需求的话就直接读取缓存，statu code:200 ，即使用户做了刷新操作，也不向服务器发起http请求

d、cache-control: no-cache

跳过设置强缓存，但不妨碍设置协商缓存；通常做了强缓存，只有强缓存失效了才走协商缓存的，设置了no-cache就不会走强缓存了，每次请求都回询问服务端

e、cache-control: no-store

不缓存，客户端、服务器都不缓存

#### 协商缓存

可理解为强缓存就是为资源设置一个有效时间，每次请求资源时都会检查是否过期，只有过期才会去请求服务器（可有效减少请求次数），当强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程协商缓存生效，返回304和Not Modified

在 response header里面的设置etag、last-modified

etag：每个文件具有唯一一个“标识”

last-modified：文件的修改时间，精确到秒

每次请求返回携带response header中的etag和last-modified，在下次请求时request header也会带上，服务端对比etag标识，判断资源是否更改，如更改直接返回新的资源，并更新response header的etag、last-modified，如资源不变，etag、last-modified不变，对客户端来说，每次请求都进行了协商缓存，即：

发请求-->资源是否过期？-->过期（没过期为强缓存）-->请求服务器-->服务器对比资源是否真的过期？-->没过期-->返回304状态码-->客户端用缓存的老资源

当服务端发现资源过期时：

服务器对比资源是否真的过期-？->过期-->返回200状态码-->客户端像第一次接收该资源一样，记录cache-control中的max-age、etag、last-modified等信息

### （2）、本地存储

主要有：localStorage，sessionStorage和cookie，WebSql和IndexDB主要用在前端有大容量存储需求的页面上，如在线编辑浏览器或者网页邮箱，可以将数据存储在浏览器，应该根据不同的场景进行使用

#### Cookie

由服务器生成，且前端也可设置，保存在客户端本地的一个文件，通过response header的set-Cookie字段进行设置，且Cookie的内容自动在请求的时候被传递给服务器

其中包含的信息：

a、用户ID、密码、浏览过的网页、停留的时间等信息，当该用户再打开该网站时，网站通过读取Cookie，就可以做出相应的动作，如身份校验、提示语等

b、还保存host属性，即网站的域名或ip，一个网站只能读取它自己放置的信息，不能读取其他网站的Cookie文件

Cookie 优点：给用户更人性化的使用体验，如自动登陆、提示语；弥补了HTTP无连接特性；可作为站点统计访问量依据

Cookie 缺点：无法解决多人共用电脑问题，具有安全隐患；Cookie文件容易被误删除；可人为修改host文件，可以非法访问目标站点的Cookie；容量较小，不能超过4kb；直接在response header上带数据安全性差

#### LocalStorage（本地存储）

主要是开发人员在前端设置，一旦数据保存在本地后，就可避免再向服务器请求数据，从而减少不必要的数据请求，可以长期存储数据，没有时间限，遵循同源策略，不同的网站不能直接共用

一般浏览器localStorage支持的是5M大小，不同的浏览器会略有不同

LocalStorage 优点：拓展了Cookie的4k限制；可以将第一次请求的5M大小数据直接存储到本地，相比于Cookie节约带宽

LocalStorage 缺点：需要手动删除，否则长期存在；浏览器大小不一，版本的支持也不一样；只支持string类型的存储，JSON对象需要转换；本质上是对字符串的读取，存储内容过多会消耗内存空间，导致卡顿

#### SessionStorage（会话存储）

同样是开发人员在前端设置，用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据，大多数浏览器限制为5MB

#### WebSQL

WebSQL 是在浏览器上模拟数据库，可以使用JS来操作SQL进行数据读写，使用 SQL 来操纵客户端数据库的 API（异步），现阶段使用较少

#### IndexedDB

随浏览器的功能日益强大，越来越多的网站将大量数据储存在客户端，可减少从服务器获取数据，直接从本地获取数据

现有浏览器数据储存方案，都不适用于储存大量数据：Cookie 大小不超过4KB，且每次请求都会发送回服务器；LocalStorage 大小在2.5MB 到 10MB 之间（各家浏览器不同），且不提供搜索功能，不能建立自定义的索引。

IndexedDB 是浏览器提供的本地数据库，可被网页脚本创建和操作。IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。但IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库

# 性能优化
### 缓存的作用

> 重用已获取的资源，减少延迟与网络阻塞，进而减少显示某个资源所用的时间，借助 HTTP 缓存，Web 站点变得更具有响应性。

其实我们对于页面静态资源的要求就两点
- 1、静态资源加载速度
- 2、页面渲染速度

页面渲染速度建立在资源加载速度之上，但不同资源类型的加载顺序和时机也会对其产生影响，所以缓存的可操作空间非常大

### 缓存的一些应用场景
- 1、每次都加载某个同样的静态文件 => 浪费带宽，重复请求 => 让浏览器使用本地缓存（协商缓存，返回304）
- 2、协商缓存还是要和服务器通信啊 => 有网络请求，不太舒服，感觉很low => 强制浏览器使用本地强缓存（返回200）
- 3、缓存要更新啊，兄弟，网络请求都没了，我咋知道啥时候要更新？=> 让请求（header加上ETag）或者url的修改与文件内容关联（文件名加哈希值）=> 开心，感觉自己很牛逼
- 4、CTO大佬说，我们买了阿里还是腾讯的CDN，几百G呢，用起来啊 => 把静态资源和动态网页分集群部署，静态资源部署到CDN节点上，网页中引用的资源变成对应的部署路径 => html中的资源引用和CDN上的静态资源对应的url地址联系起来了 => 问题来了，更新的时候先上线页面，还是先上线静态资源？（蠢，等到半天三四点啊，用户都睡了，随便你先上哪个）
- 5、老板说：我们的产品将来是国际化的，不存在所谓的半夜三点 => GG，咋办？=> 用非覆盖式发布啊，用文件的摘要信息来对资源文件进行重命名，把摘要信息放到资源文件发布路径中，这样，内容有修改的资源就变成了一个新的文件发布到线上，不会覆盖已有的资源文件。上线过程中，先全量部署静态资源，再灰度部署页面

### 各类缓存技术优缺点
#### 1、cookie  
优点：对于传输部分少量不敏感数据，非常简明有效  
缺点：容量小（4K），不安全（cookie被拦截，很可能暴露session）；原生接口不够友好，需要自己封装；需要指定作用域，不可以跨域调用

#### 2、Web Storage  
容量稍大一点（5M），localStorage可做持久化数据存储  
支持事件通知机制，可以将数据更新的通知发送给监听者  
缺点：本地储存数据都容易被篡改，容易受到XSS攻击  

缓存读取需要依靠js的执行，所以前提条件就是能够读取到html及js代码段，其次文件的版本更新控制会带来更多的代码层面的维护成本，所以LocalStorage更适合关键的业务数据而非静态资源

Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生

#### 3、indexDB
IndexedDb提供了一个结构化的、事务型的、高性能的NoSQL类型的数据库，包含了一组同步/异步API，这部分不好判断优缺点，主要看使用者。

#### 4、Manifest（已经被web标准废除）
优点

可以离线运行  
可以减少资源请求  
可以更新资源

缺点

更新的资源，需要二次刷新才会被页面采用  
不支持增量更新，只有manifest发生变化，所有资源全部重新下载一次  
缺乏足够容错机制，当清单中任意资源文件出现加载异常，都会导致整个manifest策略运行异常  
Manifest被移除是技术发展的必然，请拥抱Service Worker吧  

#### 5、PWA(Service Worker)
这位目前是最炙手可热的缓存明星，是官方建议替代Application Cache（Manifest）的方案  
作为一个独立的线程，是一段在后台运行的脚本，可使web app也具有类似原生App的离线使用、消息推送、后台自动更新等能力  

目前有三个限制（不能明说是缺点）

不能访问 DOM  
不能使用同步 API  
需要HTTPS协议  

### 缓存实践（视项目而定，不要死板）
#### 1、大公司静态资源优化方案
- 配置超长时间的本地缓存 —— 节省带宽，提高性能
- 采用内容摘要作为缓存更新依据 —— 精确的缓存控制
- 静态资源CDN部署 —— 优化网络请求
- 更资源发布路径实现非覆盖式发布 —— 平滑升级

#### 2、利用浏览器缓存机制
- 对于某些不需要缓存的资源，可以使用 Cache-control: no-store ，表示该资源不需要缓存
- 对于频繁变动的资源（比如经常需要刷新的首页，资讯论坛新闻类），可以使用 Cache-Control: no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。
- 对于代码文件来说，通常使用 Cache-Control: max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件。

#### 3、静态资源文件通过Service Worker进行缓存控制和离线化加载

# 浏览器缓存机制：强缓存、协商缓存
![image](https://github.com/yihan12/Blog/assets/44987698/e9755e0a-1e94-4867-b66c-77a616086fce)

### 概述
> 良好的缓存策略可以降低资源的重复加载提高网页的整体加载速度.
> 通常浏览器缓存策略分为两种：强缓存和协商缓存

#### 1、基本原理
- 1）浏览器在加载资源时，根据请求头的expires和cache-control判断是否命中强缓存，是则直接从缓存读取资源，不会发请求到服务器。
- 2）如果没有命中强缓存，浏览器一定会发送一个请求到服务器，通过last-modified和etag验证资源是否命中协商缓存，如果命中，服务器会将这个请求返回，但是不会返回这个资源的数据，依然是从缓存中读取资源
- 3）如果前面两者都没有命中，直接从服务器加载资源

#### 2、相同点
如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源数据；

#### 3、不同点
强缓存不发请求到服务器，协商缓存会发请求到服务器。

### 强缓存
通过Expires和Cache-Control两种响应头实现

#### 1、Expires
Expires是http1.0提出的一个表示资源过期时间的header，它描述的是一个绝对时间，由服务器返回。
Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效

Expires: Wed, 11 May 2018 07:20:00 GMT
#### 2、Cache-Control
Cache-Control 出现于 HTTP / 1.1，优先级高于 Expires ,表示的是相对时间

- Cache-Control: max-age=315360000
题外tips
Cache-Control: no-cache不会缓存数据到本地的说法是错误的，详情《HTTP权威指南》P182

![image](https://github.com/yihan12/Blog/assets/44987698/ff840908-aba6-45fa-8d3d-542ea8c1387b)

- Cache-Control: no-store才是真正的不缓存数据到本地
- Cache-Control: public可以被所有用户缓存（多用户共享），包括终端和CDN等中间代理服务器
- Cache-Control: private只能被终端浏览器缓存（而且是私有缓存），不允许中继缓存服务器进行缓存

![image](https://github.com/yihan12/Blog/assets/44987698/a36a6bc9-eaa9-409e-af30-5383a057e141)


### 协商缓存
当浏览器对某个资源的请求没有命中强缓存，就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的http状态为304并且会显示一个Not Modified的字符串

协商缓存是利用的是【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】这两对Header来管理的

#### 1、Last-Modified，If-Modified-Since
Last-Modified 表示本地文件最后修改日期，浏览器会在request header加上If-Modified-Since（上次返回的Last-Modified的值），询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来

但是如果在本地打开缓存文件，就会造成 Last-Modified 被修改，所以在 HTTP / 1.1 出现了 ETag

#### 2、ETag、If-None-Match
Etag就像一个指纹，资源变化都会导致ETag变化，跟最后修改时间没有关系，ETag可以保证每一个资源是唯一的

If-None-Match的header会将上次返回的Etag发送给服务器，询问该资源的Etag是否有更新，有变动就会发送新的资源回来
070b6284-e835-4470-ac6e-7e1892fab369

ETag的优先级比Last-Modified更高

具体为什么要用ETag，主要出于下面几种情况考虑：

一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET；
某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说1s内修改了N次)，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断(或者说UNIX记录MTIME只能精确到秒)；
某些服务器不能精确的得到文件的最后修改时间。

![image](https://github.com/yihan12/Blog/assets/44987698/d7c35795-3f4f-4073-a4a0-8ffb1a6212c4)

大致的顺序

- Cache-Control —— 请求服务器之前
- Expires —— 请求服务器之前
- If-None-Match (Etag) —— 请求服务器
- If-Modified-Since (Last-Modified) —— 请求服务器

**协商缓存需要配合强缓存使用，如果不启用强缓存的话，协商缓存根本没有意义**  
**协商缓存本身是有意义的，比如取一个 1G 的大文件，通过协商缓存，下次不一定要重新下载**

大部分web服务器都默认开启协商缓存，而且是同时启用【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】

但是下面的场景需要注意：

* 分布式系统里多台机器间文件的Last-Modified必须保持一致，以免负载均衡到不同机器导致比对失败；
* 分布式系统尽量关闭掉ETag(每台机器生成的ETag都会不一样）；

# 数据存储：cookie、localStorage、sessionStorage、indexedDB、Web SQL

### 简单对比
储存的数据可能是从服务器端获取到的数据，也可能是在多个页面中需要频繁使用到的数据

- 1、cookie：4K，可以手动设置失效期
- 2、localStorage：5M，除非手动清除，否则一直存在
- 3、sessionStorage：5M，不可以跨标签访问，页面关闭就清理
- 4、indexedDB：浏览器端数据库，无限容量，除非手动清除，否则一直存在
- 5、Web SQL：关系数据库，通过SQL语句访问（已经被抛弃）

本文只涉及前端部分，Web SQL部分有兴趣的同学可自行了解

### 一、cookie
Cookie通过在客户端记录信息确定用户身份
Session通过在服务器端记录信息确定用户身份

#### 1 Cookie机制
一个用户的所有请求操作都应该属于同一个会话，而另一个用户的所有请求操作则应该属于另一个会话
HTTP协议是无状态的协议。一旦数据交换完毕，客户端与服务器端的连接就会关闭，再次交换数据需要建立新的连接。这就意味着服务器无法从连接上跟踪会话
Cookie实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，就使用response向客户端浏览器颁发一个Cookie。客户端浏览器会把Cookie保存起来。当浏览器再请求该网站时，浏览器把请求的网址连同该Cookie一同提交给服务器。服务器检查该Cookie，以此来辨认用户状态。服务器还可以根据需要修改Cookie的内容。
cookie的内容主要包括：名字，值，过期时间，路径和域。路径与域一起构成cookie的作用范围

#### 2 session机制
Session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而Session保存在服务器上。客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上。这就是Session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了。
如果说Cookie机制是通过检查客户身上的“通行证”来确定客户身份的话，那么Session机制就是通过检查服务器上的“客户明细表”来确认客户身份。Session相当于程序在服务器上建立的一份客户档案，客户来访的时候只需要查询客户档案表就可以了。

当程序需要为某个客户端的请求创建一个session时，

服务器首先检查这个客户端的请求里是否已包含了一个session标识------------称为session id，
如果已包含则说明以前已经为此客户端创建过session，服务器就按照session id把这个session检索出来使用（检索不到，会新建一个），
如果客户端请求不包含session id，则为此客户端创建一个session并且生成一个与此session相关联的session id，session id的值应该是一个既不会重复，又不容易被找到规律以仿造的字符串，这个session id将被在本次响应中返回给客户端保存。
可以用document.cookie获取cookie，得到一个字符串，形式如 key1=value1; key2=value2，需要用正则匹配需要的值，其他库已经封装的比较好，具体可以自己去搜索

cookie可以设置路径path，所有他要比另外两个多了一层访问限制
cookie可以通过设置domain属性值，可以不同二级域名下共享cookie，而Storage不可以，比如http://image.baidu.com的cookie http://map.baidu.com是可以访问的，前提是Cookie的domain设置为.http://baidu.com，而Storage是不可以的

缺点：在请求头上带着数据，大小是4k之内，主Domain污染。

常用的配置属性有以下几个
Expires ：cookie最长有效期
Max-Age：在 cookie 失效之前需要经过的秒数。（当Expires和Max-Age同时存在时，文档中给出的是已Max-Age为准，可是我自己用Chrome实验的结果是取二者中最长有效期的值）
Domain：指定 cookie 可以送达的主机名。
Path：指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部
Secure：一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器。
HttpOnly:设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由 Document.cookie 属性、XMLHttpRequest 和 Request APIs 进行访问，以防范跨站脚本攻击（XSS）。

### 二、Storage：localStorage、sessionStorage
大小：官方建议是5M存储空间  

类型：只能操作字符串，在存储之前应该使用JSON.stringfy()方法先进行一步安全转换字符串，取值时再用JSON.parse()方法再转换一次

存储的内容： 数组，图片，json，样式，脚本。。。（只要是能序列化成字符串的内容都可以存储）

注意：数据是明文存储，毫无隐私性可言，绝对不能用于存储重要信息

区别：sessionStorage将数据临时存储在session中，浏览器关闭，数据随之消失，localStorage将数据存储在本地，理论上来说数据永远不会消失，除非人为删除

另外，不同浏览器无法共享localStorage和sessionStorage中的信息。同一浏览器的相同域名和端口的不同页面间可以共享相同的 localStorage，但是不同页面间无法共享sessionStorage的信息

#### 1、基础操作API
```
//保存数据
localStorage.setItem( key, value );
sessionStorage.setItem( key, value );
//读取数据
localStorage.getItem( key );
 sessionStorage.getItem( key );
//删除单个数据
localStorage.removeItem( key ); 
sessionStorage.removeItem( key );
//删除全部数据
localStorage.clear( ); 
sessionStorage.clear( );
//获取索引的key
localStorage.key( index ); 
sessionStorage.key( index );
```

#### 2、监听storage事件
可以通过监听 window 对象的 storage 事件并指定其事件处理函数，当页面中对 localStorage 或 sessionStorage 进行修改时，则会触发对应的处理函数
```javascript
window.addEventListener('storage',function(e){
   console.log('key='+e.key+',oldValue='+e.oldValue+',newValue='+e.newValue);
})
```
触发事件的时间对象（e 参数值）有几个属性：  
- key : 键值。
- oldValue : 被修改前的值。
- newValue : 被修改后的值。
- url : 页面url。
- storageArea : 被修改的 storage 对象。

### 三、indexedDB
张大神的indexedDB教程

要想系统学习indexedDB相关知识，可以去MDN文档啃API，假以时日就可以成为前端indexedDB方面的专家

大概流程

#### 1、打开数据库
```
var DBOpenRequest = window.indexedDB.open(dbName, version);
dbName是数据库名称，version是数据库版本
打开数据库的结果是，有可能触发4种事件

success：打开成功。
error：打开失败。
upgradeneeded：第一次打开该数据库，或者数据库版本发生变化。
blocked：上一次的数据库连接还未关闭。
第一次打开数据库时，会先触发upgradeneeded事件，然后触发success事件。
var openRequest = indexedDB.open("test",1);
var db;

openRequest.onupgradeneeded = function(e) {
    console.log("Upgrading...");
}
 
openRequest.onsuccess = function(e) {
    console.log("Success!");
    db = e.target.result;
}
 
openRequest.onerror = function(e) {
    console.log("Error");
    console.dir(e);
}
```
open返回的是一个对象  
回调函数定义在这个对象上面  
回调函数接受一个事件对象event作为参数，它的target.result属性就指向打开的IndexedDB数据库，也就是说db = e.target.result才算我们真正拿到的数据库

#### 2、创建一个数据库存储对象
```
var objectStore = db.createObjectStore(dbName, { 
        keyPath: 'id',
        autoIncrement: true
    });
```
objectStore是一个重要的对象，可以理解为存储对象  
objectStore.add()可以向数据库添加数据，objectStore.delete()可以删除数据，objectStore.clear()可以清空数据库，objectStore.put()可以替换数据

使用objectStore来创建数据库的主键和普通字段
```
objectStore.createIndex('id', 'id', {
        unique: true    
    });
``` 
#### 3、向indexedDB数据库添加数据
数据库的操作都是基于事务（transaction）来进行，于是，无论是添加编辑还是删除数据库，我们都要先建立一个事务（transaction），然后才能继续下面的操作
```
var transaction = db.transaction(dbName, "readwrite");
// dbName就是数据库的名称

// 新建一个事务
var transaction = db.transaction('project', "readwrite");
// 打开存储对象
var objectStore = transaction.objectStore('project');
// 添加到数据对象中
objectStore.add(newItem);
```
#### 4、indexedDB数据库的获取
indexedDB数据库的获取使用Cursor APIs和Key Range APIs。也就是使用“游标API”和“范围API”，具体使用可以去看文档

### localStorage，sessionStorage和cookie的区别
共同点：都是保存在浏览器端、且同源的  

区别：

* cookie数据**始终在同源的http请求中携带**（即使不需要），即cookie在浏览器和服务器间来回传递，而sessionStorage和localStorage不会自动把数据发送给服务器，**仅在本地保存**。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下

* **存储大小限制**也不同，cookie数据不能超过4K，同时因为每次http请求都会携带cookie、所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大

* **数据有效期不同**，**sessionStorage：仅在当前浏览器窗口关闭之前有效**；**localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据(需手动清除)**；**cookie：只在设置的cookie过期时间之前有效，即使窗口关闭或浏览器关闭**

* **作用域不同**，**sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面**；**localstorage在所有同源窗口中都是共享的**；**cookie也是在所有同源窗口中都是共享的**

* web Storage支持事件通知机制，可以将数据更新的通知发送给监听者

* web Storage的api接口使用更方便
