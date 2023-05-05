<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="@/assets/img/login/logo.png" alt="" />
        </div>
        <div class="view-account-top-desc">
          {{ title }}
        </div>
      </div>
      <div class="view-account-form">
        <a-form
          size="large" :model="form" auto-label-width
          :style="{ width: '100%' }" @submit-success="handleSubmit"
        >
          <a-form-item
            field="phone" label="用户名" hide-label
            hide-asterisk
            :rules="[{ required: true, message: '请输入用户名' }]" :validate-trigger="['change', 'input']"
          >
            <a-input v-model="form.phone" allow-clear placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item
            field="password" label="密码" hide-label
            hide-asterisk
            :rules="[{ required: true, message: '请输入密码' }]" :validate-trigger="['change', 'input']"
          >
            <a-input-password v-model="form.password" allow-clear placeholder="请输入密码" />
          </a-form-item>
          <a-form-item hide-label hide-asterisk>
            <a-button
              class="mt20" long type="primary"
              shape="round" html-type="submit"
              :loading="btnLoading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import {
  reactive,
  ref
} from 'vue';
import useUserStore from '@/stores/user'
import { Message } from '@arco-design/web-vue';

const title = ref(import.meta.env.VITE_TITLE)

const userStore = useUserStore()

const router = useRouter();

const form = reactive({
  phone: '',
  password: ''
})

const btnLoading = ref(false)
const handleSubmit = () => {
  btnLoading.value = true
  login(form)
    .then(async ({
      status,
      data
    }) => {
      if (status === 1) {
        Message.success('登录成功！')
        await localStorage.setItem('token', data)
        await userStore.getUserInfo()
        await router.replace('/home/index')
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-image: url('../../assets/img/login/login.svg');
  background-repeat: no-repeat;

  .view-account-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  .view-account-top {
    padding: 32px 0;
    text-align: center;

    .view-account-top-desc {
      font-size: 14px;
      color: #808695;
    }
  }

  .view-account-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
