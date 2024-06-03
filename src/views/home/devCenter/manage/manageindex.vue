<template>
  <t-page-header flex title="应用接入管理" :show-back="false">
    <t-row :wrap="false" class="page-container" justify="space-between">
      <t-col flex="auto">
        <t-button type="primary" @click="handleAdd">新建应用</t-button>
      </t-col>
      <t-col flex="auto">
        <t-row gutter="12" justify="end">
          <t-col flex="240px">
            <t-input
              v-model="baseParams.appName"
              placeholder="请输入应用名称"
              allow-clear
            />
          </t-col>
          <t-col flex="32px">
            <t-button type="primary" @click="handleSearch"> 查询 </t-button>
          </t-col>
          <t-col flex="32px">
            <t-button @click="handleReset"> 重置 </t-button>
          </t-col>
        </t-row>
      </t-col>
    </t-row>
    <t-row>
      <t-col flex="auto">
        <t-table
          ref="tableRef"
          row-key="id"
          :loading="state.tableLoading"
          :columns="columns"
          :data="state.tableData"
          bordered
          :pagination="{
            'show-total': true,
            'show-jumper': true,
            'show-page-size': true,
            'hide-on-single-page': true,
            ...pagination,
            'current': pagination.pageNum,
          }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
          @filter-change="handleFilterChange"
        >
          <template #appType="{ record }">
            <span>{{ AppTypeEnum[record.appType] ?? '-' }}</span>
          </template>
          <template #clientId="{ record }">
            <t-typography-paragraph
              copyable
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
              class="merchantName"
              >{{ record.clientId }}</t-typography-paragraph
            >
          </template>
          <template #clientSecret="{ record }">
            <t-typography-paragraph
              copyable
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
              class="merchantName"
              >{{ record.clientSecret }}</t-typography-paragraph
            >
          </template>
          <template #status="{ record }">
            <span
              class="status-section"
              :class="record.status ? '' : 'offline'"
              >{{ StatusEnum[record.status] ?? '-' }}</span
            >
          </template>
          <template #operation="{ record }">
            <span class="operation-section">
              <t-button type="text" @click="handleTableDetail(record)"
                >详情</t-button
              >
              <t-button
                type="text"
                @click="handleTableLaunchOrDel(record, 0)"
                >{{ record.status ? '下线' : '上线' }}</t-button
              >
              <t-button
                type="text"
                :disabled="record.status === 1"
                @click="handleTableEdit(record)"
                >编辑</t-button
              >
              <t-button
                type="text"
                :disabled="record.status === 1"
                @click="handleTableLaunchOrDel(record, 1)"
                >删除</t-button
              >
            </span>
          </template>
        </t-table>
      </t-col>
    </t-row>
    <AddForm
      v-if="state.showDrawer"
      :visible="state.showDrawer"
      title="新建应用（限免）"
      @on-confirm="handleDrawerConfirm"
      @on-cancel="handleDrawerCancel"
    />
    <AddFormNext
      v-if="state.showAddFormNext"
      :visible="state.showAddFormNext"
      title="编辑应用"
      :edit-id="state.editId"
      :show-anchor="state.showAnchor"
      @on-cancel="handleEditCancel"
    />
    <FormDetail
      v-if="state.showFormDetail"
      :visible="state.showFormDetail"
      :table-record="state.tableRecord"
      title="应用详情"
      :edit-id="state.editId"
      @on-cancel="handleDetailCancel"
    >
    </FormDetail>
  </t-page-header>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { fetchApplicationList } from '@/api/devCenter/manage';
import { Message, Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';

import AddForm from './components/addForm.vue';
import AddFormNext from './components/addFormNext.vue';
import FormDetail from './components/formDetail.vue';
// import OfflineOrDel from './components/offlineOrDel.vue';

const store = useUserStore();

const { userInfo } = store;

const baseParams: Record<string, string | number | null> = reactive<{
  appName: string;
  appType: number | null;
  status: number | null;
  companyId: string;
}>({
  appName: '',
  appType: null, // 默认为全部
  status: null,
  companyId: '',
});

const pagination = reactive<{
  pageNum: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const state = reactive<{
  tableLoading: boolean;
  tableData: Record<string, any>[];
  showDrawer: boolean;
  showAddFormNext: boolean;
  editId: string;
  showTip: boolean;
  showFormDetail: boolean;
  mode: number; // 0 代表下线 1代表删除
  showLaunchOrDel: boolean;
  tableRecord: Record<string, any>;
  showAnchor: boolean;
}>({
  tableLoading: false,
  tableData: [],
  showDrawer: false,
  showAddFormNext: false,
  editId: '',
  showTip: false,
  showFormDetail: false,
  mode: 0,
  showLaunchOrDel: false,
  tableRecord: {},
  showAnchor: false,
});

const AppTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '自建应用',
    value: 0,
  },
  {
    text: '商城应用',
    value: 1,
  },
];

const AppTypeEnum: { [name: string]: any } = {
  0: '自建应用',
  1: '商城应用',
};

const StatusList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '未上线',
    value: 0,
  },
  {
    text: '已上线',
    value: 1,
  },
];

const StatusEnum: { [name: string]: any } = {
  0: '未上线',
  1: '已上线',
};

const columns = [
  {
    title: '应用名称',
    dataIndex: 'appName',
    ellipsis: true,
    tooltip: true,
    width: 240,
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
    slotName: 'appType',
    ellipsis: true,
    tooltip: true,
    width: 130,
    filterable: {
      filters: AppTypeList,
    },
  },

  {
    title: 'App ID',
    dataIndex: 'clientId',
    slotName: 'clientId',
    width: 160,
  },
  {
    title: 'APP Secret',
    dataIndex: 'clientSecret',
    slotName: 'clientSecret',
    width: 180,
  },
  {
    title: '应用创建人',
    dataIndex: 'createUser',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '应用状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
    filterable: {
      filters: StatusList,
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slotName: 'operation',
    width: 220,
  },
];

const fetchTableData = async () => {
  state.tableLoading = true;
  const { pageNum, pageSize } = pagination;
  await fetchApplicationList({
    ...baseParams,
    companyId: userInfo?.companyId,
    pageNum,
    pageSize,
  }).then((res: any) => {
    state.tableLoading = false;
    pagination.total = res.total ?? 0;
    state.tableData = res.records ?? [];
  });
};

const handleFilterChange = (dataIndex: string, filteredValues: string[]) => {
  const val = filteredValues[0];
  if (typeof val === 'boolean') {
    baseParams[dataIndex] = null;
  } else {
    baseParams[dataIndex] = val;
  }
  pagination.pageNum = 1;
  fetchTableData();
};

// 页码发生变化
const handlePageChange = (pageNum: number) => {
  pagination.pageNum = pageNum;
  fetchTableData();
};

// 每页显示条数发生变化
const handlePageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  fetchTableData();
};

const handleAdd = () => {
  state.showDrawer = true;
};

const handleDrawerCancel = () => {
  state.showDrawer = false;
};

const handleDetailCancel = () => {
  state.showFormDetail = false;
};

const handleDrawerConfirm = (res: any) => {
  if (res) {
    state.showAnchor = true;
    state.showAddFormNext = true;
    // 获取编辑应用信息
    state.editId = res;
  }
};

const handleTableDetail = (record: Record<string, any>) => {
  state.showFormDetail = true;
  state.tableRecord = record;
  state.editId = record.id;
};

const handleText = () => {
  // 0 未上线 1 已上线
  const { status } = state.tableRecord as Record<string, any>;
  return {
    // eslint-disable-next-line no-nested-ternary
    btn: state.mode ? '删除' : status ? '下架应用' : '上线应用',
    // eslint-disable-next-line no-nested-ternary
    title: state.mode
      ? '确定删除该应用吗？'
      : status
      ? '确定下线该应用吗？'
      : '确定上线该应用吗？',
  };
};

const handleTableLaunchOrDel = (record: Record<string, any>, mode: number) => {
  state.showLaunchOrDel = true;
  state.tableRecord = record;
  state.mode = mode; // 上下线操作
  Modal.warning({
    title: handleText().title,
    content: '你可以自定义此处文本。此对话框将在你点击「删除」按钮后即刻关闭。',
    titleAlign: 'start',
    okText: '删除',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
  });
};

// 删除或者下线确认
const handleModalConfirm = () => {};

// 删除或者下线取消
const handleModalCancel = (record: Record<string, any>) => {};

const handleTableEdit = (record: Record<string, any>) => {
  state.showAddFormNext = true;
  state.editId = record.id;
};

const handleEditCancel = () => {
  state.showAnchor = false;
  state.showAddFormNext = false;
  state.showFormDetail = false;
  state.showDrawer = false;
};

const handleSearch = () => {
  fetchTableData();
};

const handleReset = () => {
  baseParams.appName = '';
  fetchTableData();
};

onMounted(async () => {
  await fetchTableData();
});
</script>

<style lang="less" scoped>
.page-container {
  margin-bottom: 16px;
}

:deep(.tele-typography) {
  margin-bottom: 0;
}

.operation-section {
  button {
    margin-right: 20px;
    padding: 0;
  }
}

.copy {
  margin-left: 10px;
  cursor: pointer;
}

.status-section::before {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  vertical-align: middle;
  background: #00aa2a;
  border-radius: 50%;
  content: '';
}

.offline::before {
  background: #c9cdd4;
}
</style>
