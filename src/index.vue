<template>
  <div :class="{ 'base-loading__wpt': props.forbid }">
    <div class="base-loading">
      <div class="base-loading__animate" ref="LoadingRef"></div>
      <div class="base-loading__text">{{ props.text }}</div>
    </div>
  </div>
</template>

<script setup>
import loadingJSON from './static/white_refresh/data.json'

import { ref, onMounted } from 'vue-demi'

const LoadingRef = ref(null)
const props = defineProps(['text', 'forbid'])
function lottieAnimate() {
  if (!window.lottie) {
    console.error('Loading组件缺少lottie-web引入')
    return
  }
  lottie.loadAnimation({
    container: LoadingRef.value,
    animationData: loadingJSON,
    autoplay: true,
    loop: true,
    renderer: 'svg',
  })
}

onMounted(() => {
  lottieAnimate()
})
</script>

<!-- 务必使用scoped来确保组件样式隔离-->
<style lang="less" scoped>
.base-loading__wpt {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
}
.base-loading {
  position: absolute;
  color: #fff;
  opacity: 0.5;
  background: #000000;
  box-sizing: content-box;
  border-radius: 12px;
  padding: 20px;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 6999;
  text-align: center;
  &__animate {
    width: 56px;
    height: 56px;
    margin: 0 auto;
  }
  &__text {
    min-width: 56px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    line-height: 16px;
  }
}
</style>
