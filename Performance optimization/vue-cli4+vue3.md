#前言
无缓存时，项目初次打包体积较大，首屏加载接近10s才能打开...总体积约16M...。原始包中包含echarts、vant等全部包，未全部按需加载。导致打出的包体积比较大。总体积约16M，加上sit环境的带宽只有1M，导致首屏加载接近10s才能打开。严重影响用户体验。
于是对项目进行了一系列打包优化：分环境处理包，拆分包，压缩代码，按需加载路由，按需加载组件,gzip压缩等方式进行包压缩。最后将生产包里最大的js文件压缩到160kb,其余js文件均在100kb一下，生产首屏加载速度500ms左右。
下面对整个打包优化的详细过程,希望对以后的性能优化提供思路
优化前后对比
优化前
优化后
项目分析
性能优化的最终目的是提升用户体验。
也就是让用户觉得这个网站访问快。而快是有两种：一种是真的快，一种是觉得快。
真的快：网页访问时间，交互响应时间，跳转页面时间。
觉得快：用户主观感知性能，通过视觉手段，转移用户等待时间的关注。
优化方案
一、vue.config.js 部分的配置
⚡判断 是否生产环境
// 判断是否是生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
⚡配置 alias 别名
module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
  }
}
⚡去除生产环境sourceMap
module.exports = {
  //去除生产环境的productionSourceMap
  productionSourceMap: false,
}
⚡去除console.log的打印和注释
下载插件
npm install uglifyjs-webpack-plugin --save-dev
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    const plugins = []
    // 去除console.log的打印和注释
    if(IS_PROD){
        plugins.push(
            new UglifyJsPlugin({
              uglifyOptions: {
                output: {
                  comments: false, // 去掉注释
                },
                warnings: false,
                compress: {
                  drop_console: true,
                  drop_debugger: false,
                  pure_funcs: ['console.log']//移除console
                }
              }
            })
        )
    }
    config.plugins = [...config.plugins, ...plugins]
  }
}
⚡取消webpack警告性能提示
module.exports = {
  configureWebpack: config => {
    if(IS_PROD){
        // 取消webpack警告的性能提示
        config.performance = {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 1000 * 500,
            //生成文件的最大体积
            maxAssetSize: 1000 * 1000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }
  }
}
由于项目还在初期上述方案并没有明显的体积变小的优化。但是对后续的项目扩展很有好处。
二、整体项目插件框架路由按需加载
由于方案第一步优化效果不理想，还需往后找更有效的方案。后续对整个项目检查是否有大插件、大框架有无完全按需加载。对echarts、vant检查后发现都以按需加载。并把按需加载的代码写在方案内，以便后续项目使用方便。路由未用懒加载也是代码QC时敬增发现的，之前已经做了更改，现在写在方案中。
⚡路由懒加载
SPA中一个很重要的提速手段就是路由懒加载，当打开页面是才去加载对应文件。我们可以利用vue异步组件和webpack代码分割（import()）就可以轻松实现路由懒加载。
但当路由过多时，请合理使用webpack的魔法注释对路由进行分组，太多的chunk会影响构建速度
请只在生产时懒加载，否则路由多起来，开发构建速度感人
{
    path: '/sleepManage/history',
    name: 'history',
    component: () =>
        import(/* webpackChunkName:"sleep-manage" */ '@/views/sleepManage/history/index.vue'),
    meta: { title: () => i18n.t('router.sleepManage._history'), keepAlive: false, auth: false }
}
⚡vantui框架按需引入
1. 安装插件
npm install babel-plugin-import --save-dev
1. 配置插件
在.babelrc 或 babel.config.js 中添加配置：
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ]
}
本地babel.config.js
// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)

const plugins = [
  ['import', {
    libraryName: 'vant',
    libraryDirectory: 'es',
    style: true
  }, 'vant']
]
// 去除 console.log
if (IS_PROD) {
  plugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
1. 引入组件
接着你可以在代码中直接引入 Vant(main.js) 组件，插件会自动将代码转化为按需引入的形式。
// 原始代码
import { Button } from 'vant';

// 编译后代码
import Button from 'vant/es/button';
import 'vant/es/button/style';
⚡echarts按需加载
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入折线图图表，图表后缀都为 Chart
import { PieChart, LineChart, BarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import "echarts/lib/component/markLine";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  PieChart,
  LineChart,
  BarChart,
  CanvasRenderer,
]);
三、资源文件Gzip压缩传输
Gzip压缩是一种强力压缩手段，针对文本文件时通常能减少2/3的体积。
http协议中用头部字段Accept-Encoding和Content-Encoding对[采取何种编码格式 传输文本]进行了协定，请求头的Accept-Encoding会列出客户端支持的编码格式。当响应头的 Content-Encoding指定了gzip时，浏览器则会进行对应解压
这个方法是优化效果最好的，需要服务端的配合，对nginx进行gzip配置。
成功将包的体积由15.9M缩小到400多kb。体验显著提升，但是在sit环境（1M带宽）中访问，还是需要4s左右才能访问。
⚡下载插件
npm install compression-webpack-plugin --save-dev
⚡前端配置gzip压缩
插件默认压缩等级是9，最高级的压缩
图片文件不建议使用gzip压缩，效果较差
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    const plugins = []
    // 前端配置gzip压缩
    if(IS_PROD){
        plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                // test: /\.js$|\.html$|\.json$|\.css/,
                test: /\.js$|\.json$|\.css/,
                threshold: 10240, // 只有大小大于该值的资源会被处理  对超过10k的数据压缩
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                // deleteOriginalAssets: false  // 删除原文件
            })
        )
    }
    config.plugins = [...config.plugins, ...plugins]
  },
}
⚡nginx配置
#开启和关闭gzip模式
gzip on;
#gizp压缩起点，文件大于1k才进行压缩
gzip_min_length 1k;
# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间
gzip_comp_level 6;
# 进行压缩的文件类型。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript ;
# nginx对于静态文件的处理模块，开启后会寻找以.gz结尾的文件，直接返回，不会占用cpu进行压缩，如果找不到则不进行压缩
gzip_static on
# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;
# 设置gzip压缩针对的HTTP协议版本
gzip_http_version 1.1;
location ~ .*\.(js|json|css)$ {
    gzip on;
    gzip_static on; # gzip_static是nginx对于静态文件的处理模块，该模块可以读取预先压缩的gz文件，这样可以减少每次请求进行gzip压缩的CPU资源消耗。
    gzip_min_length 1k;
    gzip_http_version 1.1;
    gzip_comp_level 9;
    gzip_types  text/css application/javascript application/json;
    root /dist;
}
四、配置 打包分析
尽管gzip的优化已经的到了很大的提升，但是还是感觉速度不太快，可能是sit环境的带宽原因 ，但是对于新的项目，不应该体积这么大。
于是上午找了相关资料。可以对代码打包进行可视化分析，对打包后的所有代码进行分析。
下载插件
npm install webpack-bundle-analyzer --save-dev
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  chainWebpack: config => {
    // 打包分析
    if(IS_PROD){
        config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
            {
              analyzerMode: 'static'
            }
        ])
    }
  }
}
之后我们对代码进行打包的时候就可以像这样输出分析图：
通过上面的分析图能很快掌握哪些包体积还比较大，可以进行公共代码拆分以及cdn优化。
五、通过打包图发现vconsole在生产未用到但是还是被打包到了生产
通过打包图发现vconsole在生产未用到但是还是被打包到了生产，于是对生产和debug环境进行了区分，并且用cdn的模式引入，防止浪费带宽。
vconsole使用cdn模式
// 本地环境是否需要使用cdn
const devNeedCdn = false
// cdn预加载使用
const externals = {
  vconsole: 'vconsole',
}
// cdn
const cdn = {
  // 开发环境
  dev: {
    css: [
    ],
    js: []
  },
  // debug
  debug: {
    css: [
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vconsole@3.10.1/dist/vconsole.min.js'
    ]
  },
  // 生产环境
  pro: {
    css: [
    ],
    js: [
    ]
  }
}

module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.pro
      }
      if (process.env.NODE_ENV === 'debug') {
        args[0].cdn = cdn.debug
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })
  },
  configureWebpack: config => {
    if(IS_PROD){
        // 打包时npm包转CDN
        // 用cdn方式引入，则构建时要忽略相关资源
        if (IS_PROD || devNeedCdn) config.externals = externals
    }
  }
}
main.js
// debug环境开启 VConsole
const vue_vconsole = process.env.VUE_APP_CONSOLE
if (vue_vconsole === 'show') {
  const VConsole = require('vconsole')
  const vConsole = new VConsole()
  console.log(vConsole.version);
}
六、公共代码抽离
进行上述几种方法的优化后，发现chunk.vendor.js这个公共包还是有300多kb（sit环境首屏加载速度3秒内），对于一个初始项目不应该这么大。
通过查资料以及这些优化博客的介绍，了解到：这个js是我们本身项目所有的包，包括vue这个全家桶，vant以及echarts等插件。于是按照博客的思路，对公共包进行拆分，大于50kb的包都拆成单个包，这样单个包的加载时间就会等到优化。
果然对包进行拆分后，单个包的大小达到160kb，sit环境首屏加载速度也达到了2s以内。速度显著提升。后续我们将代码打包好放到生产环境（8M带宽）。首屏加载速度在500ms左右，接近于秒开。下面对这个方法进行描述
module.exports = {
  configureWebpack: config => {
    if(IS_PROD){
        // 代码分割
      config.optimization = {
        splitChunks: {
          chunks: 'async', // 只处理异步 chunk，这里两个缓存组都另配了 chunks，那么就被无视了
          minSize: 20000, // 允许新拆出 chunk 的最小体积
          maxSize: 0, // 旨在与 HTTP/2 和长期缓存一起使用。它增加了请求数量以实现更好的缓存。它还可以用于减小文件大小，以加快二次构建速度。
          minChunks: 1, // 拆分前被 chunk 公用的最小次数
          maxAsyncRequests: 6, // 每个异步加载模块最多能被拆分的数量
          maxInitialRequests: 6, // 每个入口和它的同步依赖最多能被拆分的数量
          enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
          automaticNameDelimiter: '~',
          cacheGroups: {// 缓存组
            common: {
              name: "chunk-common",
              chunks: "initial",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: false,// 复用已被拆出的依赖模块，而不是继续包含在该组一起生成
              enforce: true
            },
            vue: {
              name: 'vue',
              test: /[\\/]node_modules[\\/]vue[\\/]/,
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            vuex: {
              name: 'vuex',
              test: /[\\/]node_modules[\\/]vuex[\\/]/,
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            vue_router: {
              name: 'vue-router',
              test: /[\\/]node_modules[\\/]vue-router[\\/]/,
              chunks: "all",
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",// 只处理初始 chunk
              priority: -20,// 缓存组权重，数字越大优先级越高
              reuseExistingChunk: true,
              enforce: true
            },
            vant: {
              name: "chunk-vant",
              test: /[\\/]node_modules[\\/]vant[\\/]/,
              chunks: "all",
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            zrender: {
              name: "chunk-zrender",
              test: /[\\/]node_modules[\\/]zrender[\\/]/,
              chunks: "all",
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            },
            echarts: {
              name: "chunk-echarts",
              test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
              chunks: "all",
              priority: 4,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      }
    }
  },
}
总结
业务方面
性能优化影响的，不仅是用户体验，还影响了转化率、搜索引擎排名，这些因素都会对最终的流量、销量等收入造成影响
来自Google的数据表明，一个有10条数据0.4秒能加载完的页面，变成30条数据0.9秒加载完之后，流量和广告收入下降90%。
性能优化影响的，不仅是用户体验，还影响了转化率、搜索引擎排名，这些因素都会对最终的流量、销量等收入造成影响
亚马逊的数据表明：加载时间增加100毫秒，销量就下降1%。
个人提升
项目包体积由16M优化到最大包160kb，首屏加载的速度也有整体的提升，速度由当初的10s优化到500ms左右。
刚开始项目单个js文件的体积是16M多，加载非常慢。后续后端通过对Nginx的压缩配置（gzip压缩），把文件压缩到了四百多kb。整体的页面加载速度提升了不少。后面通过查看文档，寻找多个解决方案，进行了前端文件过大可视化分析，图片压缩，文件打包压缩，CDN方式获取以及包拆分等方式让单个包在120kb，其余包都在100kb以下，极大提升了首屏加载速度。对自己的整体打包的理解，以及整个项目的运行更加透彻。
性能优化算是老生常谈的话题了，但部分人在面对怎么做性能优化的问题时，仅仅只是罗列出各种常见优化手段，更有深度的答案应该是遇到什么性能问题，针对这个问题围绕某些性能指标采取了什么手段，手段是否带来了其他问题，怎么权衡，最终达到了什么样的效果。
