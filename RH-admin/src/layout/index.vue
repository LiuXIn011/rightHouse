<template>
  <a-layout class="layout-parent">
    <a-layout-header>
      <Navbar @switch-menu-drawer="switchMenuDrawer" />
    </a-layout-header>
    <a-layout class="layout-middle-content">
      <a-layout-sider v-if="!store.isMobile" class="layout-sider" :collapsed="store.collapsedFlag">
        <div class="layout-sider-view">
          <Sider />
        </div>
      </a-layout-sider>
      <a-drawer
        v-if="store.isMobile" v-model:visible="menuDrawer" :header="false"
        :footer="false" mask-closable
        :closable="false" unmount-on-close placement="left"
        :width="200"
      >
        <Sider @menu-click="menuDrawer = false" />
      </a-drawer>
      <a-layout-content class="layout-content">
        <RouterTabs />
        <Content />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import appStore from '@/stores/index'
import Navbar from './components/Navbar.vue'
import Sider from './components/Sider.vue'
import Content from './components/Content.vue'
import RouterTabs from './components/RouterTags.vue'

const store = appStore()

const menuDrawer = ref(false)
const switchMenuDrawer = () => {
  menuDrawer.value = !menuDrawer.value
}
</script>

<style scoped lang="scss">
.layout-parent {
  width: 100%;
  height: 100%;
}

.layout-middle-content {
  width: 100%;
  height: 100%;
  padding-top: 60px;
}

.layout-sider-view {
  height: 100%;
}

.layout-content {
  background-color: var(--color-fill-2);
}
</style>

<style lang="scss">
.arco-drawer-body {
  padding: 0 !important;
}
</style>
