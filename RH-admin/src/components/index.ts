import type { App } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  TreemapChart
} from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent
} from 'echarts/components';
import Chart from './chart/index.vue';
import headForm from './headForm/headForm.vue'
import headFormItem from './headForm/headFormItem.vue'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TreemapChart,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
  GraphicComponent
]);

export default {
  install (Vue: App) {
    Vue.component('Chart', Chart);
    Vue.component('HeadForm', headForm);
    Vue.component('HeadFormItem', headFormItem);
  }
};
