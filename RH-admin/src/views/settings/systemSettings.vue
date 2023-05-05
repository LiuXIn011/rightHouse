<template>
  <div>
    <p class="title">
      OSS域名替换
    </p>
    <a-form
      :model="setOssOrgin" :rules="formRules" layout="inline"
      @submit="save"
    >
      <a-form-item label="旧的域名：" field="o">
        <a-input
          v-model="setOssOrgin.o" placeholder="请输入..." allow-clear
        />
      </a-form-item>
      <a-form-item label="新的域名：" field="n">
        <a-input
          v-model="setOssOrgin.n" placeholder="请输入..." allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue';
import { reactive } from 'vue';
import { updateOssOrgin } from '@/api/systemSettings';
import { Modal, Message } from '@arco-design/web-vue';

let setOssOrgin = reactive({
  o: '',
  n: ''
})
const formRules:Record<string, FieldRule<any> | FieldRule<any>[]> = {
  o: [
    { required: true, message: '请输入旧的域名' },
    { type: 'url', message: '输入不合规' },
  ],
  n: [
    { required: true, message: '请输入旧的域名' },
    { type: 'url', message: '输入不合规' },
  ],
}
const save = () => {
  Modal.info({
    title: '提示',
    content: `是否将OSS源地址：${setOssOrgin.o}修改为：${setOssOrgin.n}`,
    titleAlign: 'start',
    draggable: true,
    hideCancel: false,
    onOk: () => {
      updateOssOrgin(setOssOrgin).then(({
        status
      }) => {
        if (status === 1) {
          Message.success('修改成功！')
          setOssOrgin.o = ''
          setOssOrgin.n = ''
        }
      })
    }
  });
}
</script>
<style scoped lang="scss">
  .title{
    font-size: 26px;
    margin: 30px 0;
    &:first-child{
      margin-top: 0;
    }
  }
</style>