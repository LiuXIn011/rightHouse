<template>
  <div>
    <headForm :label-width="100">
      <headFormItem label="问题描述：">
        <a-input
          v-model="searchData.title" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="报修房间：">
        <a-input
          v-model="searchData.houseName" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="状态：">
        <a-select
          v-model="searchData.status" placeholder="请选择 ..." :options="statusOption"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="发起人：">
        <a-input
          v-model="searchData.createdUser" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="创建时间：">
        <a-range-picker
          show-time
          @change="datePickerChange"
        />
      </headFormItem>
      <headFormItem type="button" @search="searchList">
      </headFormItem>
    </headForm>
    <a-table
      :columns="tableColumns" :loading="tableLoading" stripe
      show-page-size :pagination="pagination"
      :data="houseMaintenance" row-key="id"
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #status="{ record }">
        <a-tag :color="statusOption.find(item => item.value === record.status)?.color">
          {{ statusOption.find(item => item.value === record.status)?.label || '未知' }}
        </a-tag>
      </template>
      <template #city="{ record }">
        {{ `${record.house.provinceName}${record.house.cityName==="直辖市"?'':record.house.cityName}${record.house.areaName}` }}
      </template>
      <template #updatedAt="{record}">
        <p v-if="record.status===1">
          {{ record.updatedAt }}
        </p>
      </template>
      <template #images="{record}">
        <a-button
          v-if="record.images && record.images.length>0" type="primary" size="mini"
          @click="showImage(record)"
        >
          查看
        </a-button>
      </template>
      <template #video="{record}">
        <a-button
          v-if="record.video" type="primary" size="mini"
          @click="showVideo(record)"
        >
          查看
        </a-button>
      </template>
    </a-table>
    <a-image-preview-group
      v-model:visible="imagePreviewShow"
      :current="0"
      infinite
      :src-list="imagePreviewList"
    />
    <a-drawer
      v-model:visible="videoPreviewShow" title="视频预览" :width="500"
      unmount-on-close
    >
      <video
        v-if="videoPreviewShow" class="video-view" controls
        :src="videoPreviewUrl"
      ></video>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import {
  gethouseMaintenanceList
} from '@/api/houseMaintenance';

const store = storeToRefs(useStore())
const pagination = reactive({
  total: 0,
  pageSize: 10,
  showPageSize: !store.isMobile,
  showTotal: true,
  showMore: true,
  showJumper: true,
  simple: store.isMobile,
  current: 1,
});

const tableColumns: object[] = reactive([
  {
    title: '报修房间',
    dataIndex: 'house.name',
  },
  {
    title: '省市区',
    align: 'center',
    slotName: 'city',
  },
  {
    title: '详细地址',
    align: 'center',
    dataIndex: 'house.addresInfo',
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
    dataIndex: 'status'
  },
  {
    title: '问题描述',
    align: 'center',
    ellipsis: true,
    tooltip: true,
    dataIndex: 'title',
  },
  {
    title: '问题图片',
    align: 'center',
    slotName: 'images',
  },
  {
    title: '问题视频',
    align: 'center',
    slotName: 'video',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt'
  },
  {
    title: '处理时间',
    align: 'center',
    slotName: 'updatedAt'
  },
]);

const statusOption = reactive([
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '未处理',
    value: 0,
    color: 'red'
  },
  {
    label: '已处理',
    value: 1,
    color: 'green'
  }
])
const searchData = reactive({
  houseName: '',
  title: '',
  createdUser: '',
  status: '',
  starTime: '',
  endTime: '',
  size: pagination.pageSize,
  index: pagination.current
})

let houseMaintenance = reactive([])
const tableLoading = ref(false);
const getlandlordListUser = () => {
  tableLoading.value = true;
  gethouseMaintenanceList(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;
        houseMaintenance = (data || []).map((item:any) => {
          try {
            item.images = JSON.parse(item.images)
          } catch (error) {
            item.images = []
          }
          return item
        })
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
getlandlordListUser()
const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  getlandlordListUser();
};
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  getlandlordListUser();
};
const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  getlandlordListUser();
}

const datePickerChange = (value: any) => {
  if (value) {
    searchData.starTime = value[0]
    searchData.endTime = value[1]
  } else {
    searchData.starTime = ''
    searchData.endTime = ''
  }
  searchList()
}

let imagePreviewShow = ref(false)
let imagePreviewList = ref([])
const showImage = (data:any) => {
  imagePreviewList.value = data.images.map((item:any) => item.url)
  imagePreviewShow.value = true
}
let videoPreviewShow = ref(false)
let videoPreviewUrl = ref('')
const showVideo = (data:any) => {
  videoPreviewShow.value = true
  videoPreviewUrl.value = data.video
}
</script>
<style scoped lang="scss">
.video-view{
  display: block;
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>