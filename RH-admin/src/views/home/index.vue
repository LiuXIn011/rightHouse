<template>
  <Chart :option="option" @dblclick="test" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { format } from 'echarts';
const diskData = reactive([
  {
    value: 10,
    name: '1',
  },
  {
    value: 10,
    name: '2',
    children: [
      {
        value: 10,
        name: '3',
      }, {
        value: 10,
        name: '3',
      }, {
        value: 10,
        name: '3',
      },
    ]
  },
  {
    value: 10,
    name: '3',
  },
])
const option = ref({
  title: [
    {
      text: '123',
      subtext: '456',
      left: 'center',
      show: true
    }
  ],
  tooltip: {
    formatter: function (info) {
      let value = info.value;
      let treePathInfo = info.treePathInfo;
      let treePath = [];
      for (let i = 1; i < treePathInfo.length; i++) {
        treePath.push(treePathInfo[i].name);
      }
      return [
        '<div class="tooltip-title">' +
        format.encodeHTML(treePath.join('/')) +
        '</div>',
        'Disk Usage: ' + format.addCommas(value) + ' KB'
      ].join('');
    }
  },
  series: [
    {
      name: 'Disk Usage',
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
        // {
        //   itemStyle: {
        //     borderColor: '#999',
        //     borderWidth: 0,
        //     gapWidth: 1
        //   },
        //   upperLabel: {
        //     show: false
        //   }
        // },
        // {
        //   itemStyle: {
        //     borderColor: '#555',
        //     borderWidth: 5,
        //     gapWidth: 1
        //   },
        //   emphasis: {
        //     itemStyle: {
        //       borderColor: '#ddd'
        //     }
        //   }
        // },
        // {
        //   colorSaturation: [0.35, 0.5],
        //   itemStyle: {
        //     borderWidth: 5,
        //     gapWidth: 1,
        //     borderColorSaturation: 0.6
        //   }
        // }
      ],
      // 关闭拖拽
      roam: false,
      data: diskData
    }
  ]
});
const test = (e) => {
  console.log(e);
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>