<script setup lang="ts">
import appStore from '@/stores/index'
import routerStore from '@/stores/router'
import { ref } from 'vue';
// 监听设备类型
const aStore = appStore()
const rStore = routerStore()
aStore.setIsMobile()
window.addEventListener('resize', () => {
  aStore.setIsMobile()
})
// 主题设置
const theme = ref('')
theme.value = localStorage.getItem('pageTheme') || ''
if (theme.value === 'dark') {
  // 设置黑色主题
  document.body.setAttribute('arco-theme', 'dark')
} else {
  // 设置亮色主题
  document.body.removeAttribute('arco-theme');
}
// 路由history设置
const historyList = window.localStorage.getItem('cacheRoutes') || '[]'
rStore.setHistoryRouter(JSON.parse(historyList))

</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
