<template>
  <div>
    <svg-icon v-if="isFull" class="myicon" icon-class="exit-fullscreen" @click="toggle" />
    <svg-icon v-else class="myicon" icon-class="fullscreen" @click="toggle" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFull: false
    }
  },
  methods: {
    toggle() {
    // 1. 判断浏览器是否支持全屏和取消全屏
      if (ScreenFull.isEnabled) {
        // 实现全屏和取消全屏的切换
        ScreenFull.toggle()
        this.isFull = !this.isFull
      } else {
        this.$message.warning('您的浏览器不支持该功能，请尝试更新后重试')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.myicon {
  width:20px;
  height:20px;
  fill: white !important;
  cursor: pointer;
}
</style>
