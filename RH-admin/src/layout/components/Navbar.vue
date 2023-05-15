<template>
  <div class="navbar">
    <div class="logo-view">
      <img src="@/assets/img/login/logo-no-txt.png">
      <h2 v-if="!aStore.isMobile">
        {{ title }}
      </h2>
      <icon-menu v-if="aStore.isMobile" size="22" @click="handerSwitchMenuDrawer" />
    </div>
    <div class="right-side">
      <a-button type="dashed" shape="circle" @click="handleToggleTheme">
        <template #icon>
          <icon-moon v-if="theme !== 'dark'" />
          <icon-sun v-else />
        </template>
      </a-button>
      <a-dropdown trigger="click">
        <a-avatar :size="38" :style="{ backgroundColor: '#3370ff', textAlign: 'center' }">
          <IconUser />
        </a-avatar>
        <template #content>
          <!-- <a-doption>
            <a-space @click="userInfo">
              <icon-user />
              <span>
                个人信息
              </span>
            </a-space>
          </a-doption> -->
          <a-doption>
            <a-space @click="uStore.logOut">
              <icon-export />
              <span>
                退出登录
              </span>
            </a-space>
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref
} from 'vue'
import appStore from '@/stores/index'
import userStore from '@/stores/user'

const aStore = appStore()
const uStore = userStore()
const theme = ref('')
theme.value = localStorage.getItem('pageTheme') || ''
const handleToggleTheme = () => {
  if (theme.value === 'dark') {
    // 设置亮色主题
    theme.value = ''
    localStorage.removeItem('pageTheme')
    document.body.removeAttribute('arco-theme');
  } else {
    // 设置黑色主题
    theme.value = 'dark'
    localStorage.setItem('pageTheme', 'dark')
    document.body.setAttribute('arco-theme', 'dark')
  }
}
const userInfo = () => {

}

const emits = defineEmits(['switchMenuDrawer']);
const handerSwitchMenuDrawer = () => {
  emits('switchMenuDrawer')
}

const title = ref(import.meta.env.VITE_TITLE)
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  padding: 0 20px;
  box-sizing: border-box;

  .logo-view {
    display: flex;
    align-items: center;
    gap: 20px;

    img {
      height: 30px;
      display: block;
    }
  }

  .right-side {
    display: flex;
    align-items: center;
    gap: 15px;
  }

}
</style>
