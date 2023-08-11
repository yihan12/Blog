### 适配方案
> 关键点： `viewport` `相对单位` `媒体查询` `响应式图片`

移动端开发的主要痛点是**如何让页面适配各种不同的终端设备**，使不同的终端设备都拥有基本一致的视觉效果和交互体验。移动端常见的适配方案有以下几种，一般都是互相搭配使用。包括：

- 视口元信息配置
- 响应式布局
- 相对单位
- 媒体查询
- 响应式图片
- 安全区域适配

### 相关概念

#### 像素

#### 分辨率（Resolution）

分辨率是指位图图像中细节的精细程度，以每英寸像素（ppi）衡量。每英寸的像素越多，分辨率就越高。

#### 物理像素（Physical pixels）

物理像素是一个设备的实际像素数。

#### 逻辑像素（Logical pixels）

是一种抽象概念。在不同的设备下，一个逻辑像素代表的物理像素数不同。CSS 像素是逻辑像素。

为了在不同尺寸和密度比的设备上表现出一致的视觉效果，使用逻辑像素描述一个相同尺寸的物理单位。在具有高密度比的屏幕下，一个逻辑像素对应多个物理像素。

#### 设备像素比（Device Pixel Ratio）

当前显示设备的物理像素分辨率与 CSS 像素分辨率之比。

#### 相关问题：图片或 1px 边框显示模糊

在移动端中，常见图片或者 1px 的边框在一些机型下显示模糊/变粗的问题。基于对像素相关的概念理解，可知 CSS 中的 1px 是指一个单位的逻辑像素。一个单位的逻辑像素映射到不同像素密度比的设备下，实际对应的物理像素不同。

因此，同样尺寸的图片在高密度比的设备下，由于一个位图像素需要应用到多个物理像素上，所以会比低密度比设备中的视觉效果模糊。

#### 视口（viewport）

视口一般是指用户访问页面时，当前的可视区域范围。通过滚动条滑动，视口可以显示页面的其他部分。在 PC 端上，<html> 元素的宽度被设置为 100% 时，等同于视口大小，等同于浏览器的窗口大小。通过 document.documentElement.clientWidth 或 window.innerWidth 可以获取视口宽度。CSS 布局基于视口大小进行计算。

由于移动设备尺寸较小，如果基于浏览器窗口大小的视口进行布局，会导致一些没有适配过移动设备样式的站点布局错乱，用户体验差。为了让移动端也能正常显示未适配移动设备的页面，从而引入布局视口和视觉视口的概念。

#### 布局视口（layout viewport）

布局视口的宽度默认为 980px，通常比物理屏幕宽。CSS 布局会基于布局视口进行计算。移动设备的浏览器基于虚拟的布局视口去渲染网页，并将对应的渲染结果缩小以便适应设备实际宽度，从而可以完整的展示站点内容且不破坏布局结构。

#### 视觉视口（visual viewport）

视觉视口是布局视口的当前可见部分。用户可以通过缩放来查看页面内容，从而改变视觉视口，但不影响布局视口。

### 适配的相关操作
#### 1. 使用 viewport 元标签配置视口
开发者可以通过 `<meta name="viewport"> `对移动端的布局视口进行设置。如果不进行 viewport 元标签的设置，可能会导致开发者设定的较小宽度的媒体查询永远不会被使用，因为默认的布局视口宽度为 980px。
```html
<!-- width 属性控制视口的大小。device-width 值指代设备屏幕宽度。 -->
<!-- initial-scale 属性控制页面首次加载时的缩放级别。-->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
#### 2. 使用现代响应式布局方案
除了使用浮动布局和百分比布局外，目前比较常见的是使用 Flexbox 或 CSS Grid 来实现灵活的网格布局。可以根据以下条件来选择布局方案：

需要一维还是二维布局：Flexbox 基于一条主轴方向进行布局。CSS Grid 可划分为行和列进行布局。如果只需要按照行或列进行布局则使用 Flexbox；如果需要同时按照行和列控制布局则使用 CSS Grid。

专注布局结构还是内容流：Flexbox 专注于内容流。Flex Item 的宽度或高度由项目中的内容决定。Flex Item 根据其内部内容和可用空间进行增长和缩小。CSS Grid 专注于精确的内容布局结构规则。每个 Grid Item 都是一个网格单元，沿水平轴和垂直轴排列。如果允许内容灵活的分配空间则使用 Flexbox；如果需要准确控制布局中项目的位置则使用 CSS Grid。


#### 3. 使用媒体查询（Media Queries）
媒体查询允许开发者根据设备类型和特征（如屏幕分辨率或浏览器视口宽度）来按需设置样式。
```css
/* 当浏览器宽度至少在 600px 及以上时 */
@media screen and (min-width: 600px) {
  .hzfe {
    /* 对 .hzfe 应用某些样式  */
  }
}

/* 当设备 DPR 为2时的样式 */
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-1 {
    border-width: 0.5px;
  }
}
```
#### 4. 使用相对单位
移动端开发需要面对十分繁杂的终端设备尺寸。除了使用响应式布局、媒体查询等方案之外，在对元素进行布局时，一般会使用相对单位来获得更多的灵活性。

**rem**

根据 W3C 规范可知，1rem 等同于根元素 html 的 font-size 大小。

由于早期 vw、vh 兼容性不佳，一个使用广泛的移动端适配方案 flexible 是借助 rem 来模拟 vw 特性实现移动端适配。在设计与开发时，通常会约定某一种尺寸为开发基准。开发者可以利用工具（如 px2rem）进行绝对单位 px 和其他 rem 单位的自动换算，然后利用 flexible 脚本动态设置 html 的字体大小和<meta name="viewport">。

**vw/vh**

由于目前 vw、vh 相关单位获得了更多浏览器的支持，可以直接使用 vw、vh 单位进行移动端开发。

同理于 flexible 方案，使用 vw、vh 也需要对设计稿中的尺寸进行换算，将 px 转换为 vw 值，常见的工具如 postcss-px-to-viewport 等可以满足需求。
![image](https://github.com/yihan12/Blog/assets/44987698/258b5da8-bebc-4434-b17a-01d7253e6a7d)


#### 5. 使用响应式图片
展示图片时，可以在 picture 元素中定义零或多个 source 元素和一个 img 元素，以便为不同的显示/设备场景提供图像的替代版本。从而使得图片内容能够灵活响应不同的设备，避免出现图片模糊或视觉效果差以及使用过大图片浪费带宽的问题。

source 元素可以按需配置 srcset、media、sizes 等属性，以便用户代理为不同媒体查询范围或像素密度比的设备配置对应的图片资源。如果没有找到匹配的图像或浏览器不支持 picture 元素，则使用 img 元素作为回退方案。
```html
<picture>
  <source
    srcset="hzfe-avatar-desktop.png, hzfe-avatar-desktop-2x.png 2x"
    media="(min-width: 990px)"
  />
  <source
    srcset="hzfe-avatar-tablet.png, hzfe-avatar-tablet-2x.png 2x"
    media="(min-width: 750px)"
  />
  <source
    srcset="hzfe-avatar-mobile.png, hzfe-avatar-mobile-2x.png 2x"
    media="(min-width: 375px)"
  />
  <img
    srcset="hzfe-avatar.png, hzfe-avatar-2x.png 2x"
    src="hzfe-avatar.png"
    alt="hzfe-default-avatar"
  />
</picture>
```
#### 6. 适配安全区域
由于手机厂商各有特色，目前手机上常见有圆角（corners）、刘海（sensor housing）和小黑条（Home Indicator）等特征。为保证页面的显示效果不被这些特征遮盖，需要把页面限制在安全区域范围内。
```html
<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
```
设置 viewport-fit=cover 后，按需借助以下预设的环境变量，对元素应用 padding，从而确保它们不会被一些以上特征遮盖：
```
safe-area-inset-left  
safe-area-inset-right  
safe-area-inset-top  
safe-area-inset-bottom  
```
```html
/* 例子：兼容刘海屏 */

body {
  /* constant 函数兼容 iOS 11.2 以下*/
  padding-top: constant(safe-area-inset-top);
  /* env 函数兼容 iOS 11.2 */
  padding-top: env(safe-area-inset-top);
}
```
