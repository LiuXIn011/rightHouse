<template>
  <div>
    <headForm :label-width="100">
      <headFormItem label="评论内容：">
        <a-input
          v-model="searchData.comment" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="评论房屋：">
        <a-input
          v-model="searchData.house" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="评论房东：">
        <a-input
          v-model="searchData.landlord" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="评论人：">
        <a-input
          v-model="searchData.tenant" placeholder="请输入..." allow-clear
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
      :columns="tableColumns" :loading="tableLoading"
      show-page-size :pagination="pagination"
      :data="userList" row-key="id" stripe
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #houseCommentImg="{record}">
        <a-button
          v-if="record.houseCommentImg" type="primary" size="mini"
          @click="showImage(record.houseCommentImg)"
        >
          查看
        </a-button>
      </template>
      <template #landlordCommentImg="{record}">
        <a-button
          v-if="record.landlordCommentImg" type="primary" size="mini"
          @click="showImage(record.landlordCommentImg)"
        >
          查看
        </a-button>
      </template>
      <template #operation="{ record }">
        <a-dropdown position="bottom">
          <a-button type="primary" size="mini">
            <template #icon>
              <icon-down />
            </template>
          </a-button>
          <template #content>
            <a-doption v-if="record.status === 1" @click="editUser(record, 2)">
              停用
            </a-doption>
            <a-doption v-if="record.status === 2" @click="editUser(record, 1)">
              启用
            </a-doption>
            <a-doption @click="editUser(record, 3)">
              删除
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-table>
    <a-image-preview-group
      v-model:visible="imagePreviewShow"
      :current="0"
      infinite
      :src-list="imagePreviewList"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { updateLandlordUserStatus } from '@/api/tenantsUser';
import { getComments } from '@/api/comments';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import { Modal, Message } from '@arco-design/web-vue';

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
    title: '房屋名称',
    align: 'center',
    dataIndex: 'house.name'
  },
  {
    title: '房东名称',
    align: 'center',
    dataIndex: 'landlordUser.name'
  },
  {
    title: '评价人',
    align: 'center',
    dataIndex: 'tenantsUser.name'
  },
  {
    title: '房间评分',
    align: 'center',
    dataIndex: 'houseScore'
  },
  {
    title: '房间评价',
    align: 'center',
    dataIndex: 'houseComment'
  },
  {
    title: '房间评价图片',
    align: 'center',
    slotName: 'houseCommentImg',

  },
  {
    title: '房东评分',
    align: 'center',
    dataIndex: 'landlordScore'
  },
  {
    title: '房东评价',
    align: 'center',
    dataIndex: 'landlordComment'
  },
  {
    title: '房东评价图片',
    align: 'center',
    slotName: 'landlordCommentImg',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'operation',
  },
]);

const searchData = reactive({
  comment: '',
  house: '',
  landlord: '',
  tenant: '',
  starTime: '',
  endTime: '',
  size: pagination.pageSize,
  index: pagination.current
});
let userList = reactive([]);
const tableLoading = ref(false);
const getCommentsFun = () => {
  tableLoading.value = true;
  getComments(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;
        userList = (data || [])
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};
getCommentsFun();

const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  getCommentsFun();
};
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  getCommentsFun();
};
const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  getCommentsFun();
};

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
  imagePreviewList.value = JSON.parse(data).map((item:any) => item.url)
  imagePreviewShow.value = true
}

const editUser = (data: any, status: number) => {
  const operationType = status === 1 ? '启用' : status === 2 ? '停用' : status === 3 ? '删除' : ''
  Modal.info({
    title: '提示',
    content: `是否${operationType}该租客？`,
    titleAlign: 'start',
    draggable: true,
    hideCancel: false,
    onOk: () => {
      updateLandlordUserStatus({
        id: data.id,
        status
      }).then(({
        status: apiStatus
      }) => {
        if (apiStatus === 1) {
          Message.success(operationType + '成功！')
          getCommentsFun()
        }
      })
    },
  });
}
</script>

<style lang="scss">

</style>
