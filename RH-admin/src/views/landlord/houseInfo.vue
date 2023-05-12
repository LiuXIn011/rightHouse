<template>
  <a-row :gutter="20" align="stretch">
    <a-col
      :xs="24" :sm="12" :lg="16"
      :xl="18" :xxl="18"
    >
      <houseMap :data="data.housesTree" :name="data.name" @item-click="onItemClick"></houseMap>
    </a-col>
    <a-col
      :xs="24" :sm="12" :lg="8"
      :xl="6" :xxl="6"
    >
      <div class="house-info">
        <a-space
          v-show="showData.name" direction="vertical" size="medium"
          fill
        >
          <a-descriptions
            size="mini" bordered align="right"
            :data="showData.info" :title="showData.name" :column="2"
            layout="inline-horizontal"
          />
          <a-image-preview-group infinite>
            <a-row :gutter="10" align="stretch">
              <a-col
                v-for="(item, ind) in showData.headImg" :key="ind" class="mb20"
                :xs="24" :sm="12" :lg="12"
                :xl="8"
                :xxl="8"
              >
                <a-image
                  fit="cover" :src="item.url" width="100%"
                  height="100%"
                />
              </a-col>
            </a-row>
          </a-image-preview-group>
        </a-space>
        <a-empty v-show="!showData.name" description="点击左侧查看详细信息" class="mt20" />
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import houseMap from './houseMap.vue'

defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})

let showData: any = reactive({
  name: '',
  info: [],
  headImg: [],
  tenantsList: []
})
const onItemClick = (data: any) => {
  if (data) {
    showData.name = data.name
    showData.headImg = data.headImg
    showData.info = [
      {
        label: '价格：',
        value: data.price,
      },
      {
        label: '省市区：',
        value: `${data.provinceName}${data.cityName === '直辖市' ? '' : data.cityName}${data.areaName}`
      },
      {
        label: '详细地址：',
        value: data.addresInfo,
      }
    ]
  } else {
    showData.name = ''
    showData.headImg = ''
    showData.info = []
  }
}
</script>
<style lang="scss">
.house-info {
  width: 100%;
  height: 500px;
  margin: 20px 0;
  background-color: var(--color-bg-2);
  box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>