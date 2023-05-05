<template>
  <!-- 末级菜单 -->
  <a-menu-item v-if="(!item.children || item.children.length === 0) && !item.meta.hideInMenu" :key="fullPath">
    {{ item.meta.title }}
  </a-menu-item>
  <!-- 只要一个下级的菜单 -->
  <a-menu-item v-if="(item.children && item.children.length === 1) && !item.meta.hideInMenu" :key="item.redirect">
    <template v-if="item.meta.icon || item.children[0].meta.icon" #icon>
      <component :is="item.meta.icon || item.children[0].meta.icon" size="26" />
    </template>
    {{ item.meta.title || item.children[0].meta.title }}
  </a-menu-item>
  <!-- 多级菜单 -->
  <a-sub-menu v-if="item.children && item.children.length > 1 && !item.meta.hideInMenu" :key="fullPath">
    <template v-if="item.meta.icon" #icon>
      <component :is="item.meta.icon" size="26" />
    </template>
    <template #title>
      {{ item.meta.title }}
    </template>
    <sidebar-item
      v-for="child in item.children" :key="child.path" :item="child"
      :parent-path="fullPath"
    />
  </a-sub-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => { }
  },
  parentPath: String
})
const fullPath = computed(() => {
  let path = props.item.path.startsWith('/') ? props.item.path.substr(1) : props.item.path
  path = `${props.parentPath}/${path}`
  return path.replaceAll('//', '/')
})
</script>
