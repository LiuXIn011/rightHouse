<template>
  <div class="root-view">
    <a-tag
      class="cursor router-tag-item" :bordered="$route.path === '/home/index'" color="blue"
      @click="toPath('/home/index')"
    >
      首页
    </a-tag>
    <a-tag
      v-for="(item, index) in store.historyRouter" :key="item.name" class="cursor router-tag-item"
      :bordered="$route.path === item.path" color="blue"
      closable @close="tagClose(item, index)" @click="toPath(item.fullPath)"
    >
      {{ item.title }}
    </a-tag>
  </div>
</template>

<script setup lang="ts">
import routerStore from '@/stores/router';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute()
const $router = useRouter()
const store = routerStore()
const tagClose = (data: any, index: number) => {
  const closeInfo = {
    route: data,
    $route,
    index
  }
  store.tagClose(closeInfo, $router)
}
const toPath = (path: string) => {
  $router.push(path)
}
</script>

<style scoped lang="scss">
.root-view {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-y: hidden;
  overflow-x: auto;
  flex-wrap: nowrap;
  .router-tag-item{
    flex-shrink: 0;
  }
}
</style>
