<template>
  <VCharts
    v-if="renderChart" :option="options" :autoresize="autoResize"
    :style="{ width, height }"
  />
</template>

<script lang="ts" setup>
import { ref, nextTick, provide } from 'vue';
import VCharts, { THEME_KEY } from 'vue-echarts';

let theme = localStorage.getItem('pageTheme') || ''
if (theme === 'dark') {
  provide(THEME_KEY, 'dark');
}

defineProps({
  options: {
    type: Object,
    default () {
      return {};
    },
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
});
const renderChart = ref(false);
nextTick(() => {
  renderChart.value = true;
});
</script>

<style scoped lang="less">

</style>
