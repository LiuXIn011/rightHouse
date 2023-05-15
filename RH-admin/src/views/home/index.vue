<template>
  <div class="page-view">
    <div ref="houseAnimationBox" class="house-lottie-box"></div>
    <div ref="welcomeAnimationBox" class="welcome-lottie-box"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import houseAnimationData from '@/assets/lottiefiles/house.json'
import welcomeAnimationData from '@/assets/lottiefiles/welcome.json'
import lottie from 'lottie-web';

const houseAnimationBox = ref()
const welcomeAnimationBox = ref()
onMounted(() => {
  lottie.loadAnimation({
    container: houseAnimationBox.value,
    name: 'index',
    animationData: houseAnimationData,
  });
  lottie.loadAnimation({
    container: welcomeAnimationBox.value,
    name: 'welcome',
    loop: false,
    animationData: welcomeAnimationData,
  });
})
</script>
<style scoped lang="scss">
.page-view{
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .welcome-title{
    font-size: 20px;
  }
}

@media screen and (max-width: 993px) {
  .house-lottie-box{
    width: 300px;
    height: 200px;
  }
  .welcome-lottie-box{
    width: 300px;
    height: 100px;
  }
}
@media screen and (min-width: 993px) {
  .house-lottie-box{
    width: 500px;
    height: 380px;
  }
  .welcome-lottie-box{
    width: 500px;
    height: 100px;
  }
}
</style>