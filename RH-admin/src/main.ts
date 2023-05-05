import { createApp } from 'vue';

import { createPinia } from 'pinia';

import globalComponents from '@/components';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import App from './App.vue';
import router from './router';

import './assets/base.scss';

const app = createApp(App);

app.use(createPinia());
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(router);

// 注册全局组件
app.use(globalComponents);

app.mount('#app');
