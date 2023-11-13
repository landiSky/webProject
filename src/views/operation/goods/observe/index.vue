<template>
  <t-page-header flex title="商品订阅" :show-back="false">
    <template #extra>
      <div class="title-ext"
        >本清单展示的应用/服务分类来源于工业互联网标识网络，订阅某分类后，标识网络中的此类应用可自动同步至本平台，供本平台用户购买和使用。</div
      >
    </template>

    <t-table
      row-key="id"
      :loading="state.tableLoading"
      :columns="columns"
      :data="state.tableData"
      :pagination="{
        'show-total': true,
        'show-jumper': true,
        'show-page-size': true,
        'hide-on-single-page': hideOnSinglePage,
        ...pagination,
      }"
      bordered
    >
      <template #operations="{ record }">
        <span v-if="record.parentId != 0" class="check-padding"></span>
        <t-checkbox
          :id="record.id"
          :indeterminate="record.sync == StatusEnum.SOME"
          :model-value="record.sync == StatusEnum.ALL"
          @click="handleChange('sync', record)"
          >仅同步</t-checkbox
        >
        <t-checkbox
          :id="record.id"
          :indeterminate="record.syncUpShelf == StatusEnum.SOME"
          :model-value="record.syncUpShelf == StatusEnum.ALL"
          @click="handleChange('up', record)"
          >同步并自动上架</t-checkbox
        >
      </template>
    </t-table>
  </t-page-header>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import { observeList, changeObserve } from '@/api/operation/goods';

const state = reactive<{
  tableLoading: boolean;
  tableData: Record<string, any>[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
}>({
  tableLoading: false,
  tableData: [],
  editData: {},
  detailData: {},
});

const columns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    width: 300,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 400,
  },
];

const pagination = reactive<{
  current: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  current: 0,
  pageSize: 10,
  total: 0,
});

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const StatusEnum: { [name: string]: any } = {
  NO: 0, // 未选中
  ALL: 1, // 全选
  SOME: 2, // 部分选中
};

function fetchData() {
  // 接口请求
  state.tableLoading = true;
  observeList()
    .then((res: any) => {
      if (res.code === 200) {
        state.tableData = res.data || [];
      }
    })
    .finally(() => {
      state.tableLoading = false;
    });
}

const handleChange = (type: string, record: any) => {
  const params: Record<string, any> = {
    id: record.id,
    serverId: record.serverId,
  };
  if (type === 'sync') {
    if (record.sync === StatusEnum.ALL) {
      params.sync = 0;
    } else {
      params.sync = 1;
    }
  } else if (record.syncUpShelf === StatusEnum.ALL) {
    params.syncUpShelf = 0;
  } else {
    params.syncUpShelf = 1;
  }
  changeObserve(params).then((res) => {
    if (res.code === 200) {
      fetchData();
    } else {
      Message.error(res.message);
    }
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
:deep(.tele-page-header-header) {
  display: block;
}

.title-ext {
  margin-top: 10px;
  overflow: hidden;
  color: #4e5969;
  font-size: 12px;
  line-height: 20px;
  text-overflow: ellipsis;
}

.check-padding {
  display: inline-block;
  width: 20px;
}
</style>
