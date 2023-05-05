<template>
  <div class="sider-view">
    <a-menu
      accordion :style="{ width: '200px', height: '100%' }" auto-open-selected
      :selected-keys="[$route.path]"
      :show-collapse-button="!store.isMobile" :breakpoint="store.isMobile ? '' : 'xl'"
      @menu-item-click="routerTo" @collapse="setCollapse"
    >
      <sidebar-item
        v-for="route in routes" :key="route.path" :item="route"
        parent-path=""
      />
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import {
  routes
} from '@/router'

import appStore from '@/stores/index'
import { useRouter, useRoute } from 'vue-router'
import sidebarItem from './sidebar-item.vue'

const $router = useRouter()
const $route = useRoute()

const store = appStore()
const setCollapse = (val: boolean) => {
  store.setCollapsedFlag(val)
}

const emits = defineEmits(['menuClick'])
const routerTo = (key: string) => {
  emits('menuClick')
  $router.push(key)
}
</script>

<style scoped lang="scss">
.sider-view {
  height: 100%;
  height: 100%;
}
</style>
