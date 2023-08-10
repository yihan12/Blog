### 问题描述
> Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.

### 思路
找出不播放的根本原因：由于安全性校验，首次调用`play()`方式时，iOS会暂停音乐，导致播放的时候不会自动往下播。

所以考虑利用第二次去自动播放音乐。第一次的时候播放完立马暂停，且将时间也设置为`currentTime = 0`.这样就不会发出声音，后续按钮操控的时候就会想Android一样自动播放了。


### 解决
- 设置全局的audio
```html
//APP.vue
<audio
id="audioMp3"
:src="mp3"
autoplay
preload="auto"
controls="controls"
loop="false"
hidden="true"
v-show="false"
></audio>
```
- 按钮点击的时候触发开启关闭等播放操作。模拟ios播放，解除ios安全性的处理
```javascript
// 这时候音乐不会发声
let music = document.getElementById("audioMp3");
music.play();
music.pause();
music.currentTime = 0;
```
- 最后在需要的位置播放音乐
```javascript
function initMusic() {
  // 解决ios audio无法自动播放、循环播放的问题
  let music = document.getElementById("audioMp3");

  music.currentTime = 0;
  music.play();

  // 音频播放结束
  countDownTimer = setInterval(() => {
    if (countDownVal.value == 1) {
      countDownVal.value = "Go";
      clearInterval(countDownTimer);
      setTimeout(() => {
        showLoading.value = true;
        music.currentTime = 0;
        music.pause();
        emits("endCountDown", false);
      }, 1000);
      return false;
    }
    countDownVal.value--;
  }, 1000);
  // dom.oncanplay = undefined;
}
```
