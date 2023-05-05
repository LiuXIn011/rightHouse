<template>
  <div class="content-view">
    <router-view v-slot="{ Component }" class="content">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.content-view {
  width: 100%;
  box-sizing: border-box;
  height: calc(100% - 44px);
  padding: 20px;
}

.content {
  background-color: var(--color-bg-2);
  box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 10px;
  min-height: 100%;
  padding: 20px;
}
</style>
