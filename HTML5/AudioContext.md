#  音频

# 一、使用Audio 第一种 使用标签方式
```javascript

    <audio src="./tests.mp3" ref="audio"></audio>
    <el-button @click="audioPlay()">播放Audio</el-button>
    audioPlay() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // this.$refs.audio.pause(); //暂停
    },
```

# 二、使用Audio 第二种 利用js构建Audio对象
```javascript
audioJs() {
    var audio = new Audio();
    var url = require("./tests.mp3");
    audio.src = url;
    // audio.loop = true; //设置循环播放
    audio.play();
    // audio.pause(); //暂停
},
```

# 三、使用AudioContext播放
```javascript
<template>
  <div>
    <el-button @click="playAudio()" v-show="!hasPlay">播放</el-button>
    <el-button @click="resumeAudio()" v-show="hasPlay">{{
      isPause ? "继续" : "暂停"
    }}</el-button>
    <el-button @click="stopAudio()" v-show="hasPlay">结束</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ctx: null,
      source: null,
      loop: false, //是否循环
      hasPlay: false, //是否播放 助变量 可忽略辅
      isPause: false, //是否暂停 助变量 可忽略辅
    };
  },
  methods: {
    // 播放
    async playAudio() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext())();
      this.source = this.ctx.createBufferSource(); // 创建音频源头姐点
      const audioBuffer = await this.loadAudio();
      this.playSound(audioBuffer);
    },
    async loadAudio() {
      // const audioUrl = require("./test.mp3");
      const audioUrl = require("./tests.mp3");
      const res = await fetch(audioUrl);
      const arrayBuffer = await res.arrayBuffer(); // byte array字节数组
      const audioBuffer = await this.ctx.decodeAudioData(
        arrayBuffer,
        function (decodeData) {
          return decodeData;
        }
      );
      return audioBuffer;
    },
    async playSound(audioBuffer) {
      this.source.buffer = audioBuffer; // 设置数据
      this.source.loop = this.loop; //设置，循环播放
      this.source.connect(this.ctx.destination); // 头尾相连
      // 可以对音频做任何控制
      this.source.start(0); //立即播放
      this.hasPlay = true;
    },
    // 暂停
    async resumeAudio() {
      if (this.ctx.state === "running") {
        this.ctx.suspend();
        this.isPause = true;
      } else if (this.ctx.state === "suspended") {
        this.ctx.resume();
        this.isPause = false;
      }
    },
    // 结束
    async stopAudio() {
      this.source.stop();
      this.hasPlay = false;
      this.isPause = false;
    },
  },
};
</script>
```
<template>
  <div>
    <el-button @click="playAudio()" v-show="!hasPlay">播放</el-button>
    <el-button @click="resumeAudio()" v-show="hasPlay">{{
      isPause ? "继续" : "暂停"
    }}</el-button>
    <el-button @click="stopAudio()" v-show="hasPlay">结束</el-button>
  </div>
</template>
