# uni-app 中使用 JavaScript 控制 video 组件

在 uni-app 中，你可以通过 `<video>` 组件和 JavaScript 来控制视频播放。uni-app 的 video 组件是基于各平台原生 video 实现的，因此在不同平台上可能有细微差异。

## 基本使用方法

### 1. 模板中使用 video 组件

```html
<template>
  <view>
    <video 
      id="myVideo"
      ref="videoRef"
      src="https://example.com/sample.mp4"
      controls
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    ></video>
    
    <button @click="playVideo">播放</button>
    <button @click="pauseVideo">暂停</button>
    <button @click="seekTo(30)">跳转到30秒</button>
  </view>
</template>
```

### 2. JavaScript 控制方法

```javascript
<script>
export default {
  methods: {
    // 播放视频
    playVideo() {
      // 方式1：通过 uni.createVideoContext
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.play()
      
      // 方式2：通过 refs (H5平台)
      // this.$refs.videoRef.play()
    },
    
    // 暂停视频
    pauseVideo() {
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.pause()
    },
    
    // 跳转到指定时间
    seekTo(time) {
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.seek(time)
    },
    
    // 视频开始播放事件
    onPlay() {
      console.log('视频开始播放')
    },
    
    // 视频暂停事件
    onPause() {
      console.log('视频已暂停')
    },
    
    // 视频结束事件
    onEnded() {
      console.log('视频播放结束')
    }
  }
}
</script>
```

## 完整 API 控制

uni-app 提供了 `uni.createVideoContext` 方法来创建 video 上下文，支持以下方法：

```javascript
const videoContext = uni.createVideoContext('myVideo', this)

// 播放
videoContext.play()

// 暂停
videoContext.pause()

// 跳转到指定位置，单位秒
videoContext.seek(30)

// 停止
videoContext.stop()

// 全屏
videoContext.requestFullScreen()

// 退出全屏
videoContext.exitFullScreen()

// 显示状态栏（仅iOS有效）
videoContext.showStatusBar()

// 隐藏状态栏（仅iOS有效）
videoContext.hideStatusBar()
```

## 监听视频事件

video 组件支持以下事件：

```html
<video
  @play="onPlay"
  @pause="onPause"
  @ended="onEnded"
  @timeupdate="onTimeUpdate"
  @fullscreenchange="onFullscreenChange"
  @waiting="onWaiting"
  @error="onError"
></video>
```

对应的事件处理：

```javascript
methods: {
  onPlay(e) {
    console.log('视频开始播放', e)
  },
  onPause(e) {
    console.log('视频暂停', e)
  },
  onEnded(e) {
    console.log('视频播放结束', e)
  },
  onTimeUpdate(e) {
    console.log('播放进度变化', e.detail.currentTime)
  },
  onFullscreenChange(e) {
    console.log('全屏状态变化', e.detail.fullScreen)
  },
  onWaiting(e) {
    console.log('视频缓冲中')
  },
  onError(e) {
    console.error('视频错误', e.detail.errMsg)
  }
}
```

## 平台差异说明

1. **H5 平台**：
   - 可以直接使用 DOM API 操作 video 元素
   - 也可以通过 `this.$refs.videoRef` 获取组件实例

2. **小程序平台**：
   - 必须使用 `uni.createVideoContext` 来操作 video
   - 部分 API 可能有平台限制

3. **App 平台**：
   - 支持大部分 API，但全屏控制可能有特殊处理

## 完整示例

```html
<template>
  <view class="container">
    <video 
      id="myVideo"
      ref="videoRef"
      src="/static/sample.mp4"
      :controls="false"
      :autoplay="false"
      style="width: 100%;"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
    ></video>
    
    <view class="controls">
      <button @click="playVideo">播放</button>
      <button @click="pauseVideo">暂停</button>
      <button @click="seekTo(30)">跳转到30秒</button>
      <button @click="toggleFullScreen">全屏切换</button>
    </view>
    
    <view>当前进度: {{ currentTime }} / {{ duration }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTime: 0,
      duration: 0
    }
  },
  methods: {
    playVideo() {
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.play()
    },
    pauseVideo() {
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.pause()
    },
    seekTo(time) {
      const videoContext = uni.createVideoContext('myVideo', this)
      videoContext.seek(time)
    },
    toggleFullScreen() {
      const videoContext = uni.createVideoContext('myVideo', this)
      // 需要先获取当前全屏状态
      videoContext.requestFullScreen({
        direction: 90 // 0正常竖向，90横屏，-90反向横屏
      })
    },
    onPlay(e) {
      console.log('视频开始播放')
      this.duration = e.detail.duration
    },
    onPause() {
      console.log('视频已暂停')
    },
    onEnded() {
      console.log('视频播放结束')
    },
    onTimeUpdate(e) {
      this.currentTime = e.detail.currentTime
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}
.controls {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
button {
  margin: 5px;
}
</style>
```

## 注意事项

1. 视频源需要使用 HTTPS（小程序平台要求）
2. 不同平台对视频格式支持可能不同
3. 全屏控制在不同平台表现可能不一致
4. 在组件销毁时，最好手动停止视频播放
5. 对于长视频，考虑使用分段加载或流媒体技术

希望这些信息能帮助你在 uni-app 中有效地控制 video 组件！
