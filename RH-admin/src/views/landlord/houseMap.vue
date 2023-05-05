<template>
  <Chart ref="chartRef" :option="option" @click="itemClick" />
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { format } from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    default () {
      return [];
    },
  },
  name: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['itemClick'])

const option = ref({
  title: [
    {
      text: props.name + '的房屋地图',
      subtext: '点击查看房屋详情',
      left: 'center',
      show: false,
      backgroundColor: '#fff',
      padding: 10
    }
  ],
  tooltip: {
    formatter: function (info: any) {
      let treePathInfo = info.treePathInfo;
      let treePath = [];
      for (let i = 1; i < treePathInfo.length; i++) {
        treePath.push(treePathInfo[i].name);
      }
      return [
        '<div class="tooltip-title">' +
        format.encodeHTML(treePath.join('/')) +
        '</div>',
      ].join('');
    }
  },
  series: [
    {
      name: props.name || 'ROOT',
      type: 'treemap',
      visibleMin: 300,
      upperLabel: {
        show: true,
        height: 30
      },
      levels: [
        {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 5,
            gapWidth: 10
          },
          upperLabel: {
            show: false
          }
        },
        {
          itemStyle: {
            borderColor: '#666',
            borderWidth: 5,
            gapWidth: 10
          }
        },
        {
          itemStyle: {
            borderColor: '#999',
            borderWidth: 5,
            gapWidth: 10
          }
        },
      ],
      // 关闭拖拽
      roam: false,
      data: props.data
    }
  ]
});
const itemClick = (e: any) => {
  emits('itemClick', e.data)
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>