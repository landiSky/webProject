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
            'hide-on-single-page': hideOnSinglePage,
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
            <t-tooltip v-if="state.showTip" :content="record.clientId">
              <span class="tablecell-item">{{
                computeLength(record.clientId)
              }}</span>
            </t-tooltip>
            <span v-else class="tablecell-item">{{
              computeLength(record.clientId)
            }}</span>

            <icon-copy
              class="copy"
              size="14"
              @click="handleCopy(record.clientId)"
            />
          </template>
          <template #clientSecret="{ record }">
            <t-tooltip v-if="state.showTip" :content="record.clientSecret">
              <span class="tablecell-item">{{
                computeLength(record.clientSecret)
              }}</span>
            </t-tooltip>
            <span v-else class="tablecell-item">{{
              computeLength(record.clientSecret)
            }}</span>

            <icon-copy
              class="copy"
              size="14"
              @click="handleCopy(record.clientSecret)"
            />
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
              <t-button type="text" @click="handleTableLaunch(record)"
                >上线</t-button
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
                @click="handleTableDel(record)"
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
      @on-cancel="handleCancel"
    />
    <FormDetail
      v-if="state.showFormDetail"
      :visible="state.showFormDetail"
      title="应用详情"
      :edit-id="state.editId"
      @on-cancel="handleDetailCancel"
    >
    </FormDetail>
  </t-page-header>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { fetchApplicationList } from '@/api/devCenter/manage';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import AddForm from './components/addForm.vue';
import AddFormNext from './components/addFormNext.vue';
import FormDetail from './components/formDetail.vue';

const store = useUserStore();

const { userInfo } = store;

console.log('userInfo', userInfo);

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

const hideOnSinglePage = computed(() => pagination.total <= 10);

const state = reactive<{
  tableLoading: boolean;
  tableData: Record<string, any>[];
  showDrawer: boolean;
  showAddFormNext: boolean;
  editId: string;
  showTip: boolean;
  showFormDetail: boolean;
}>({
  tableLoading: false,
  tableData: [],
  showDrawer: false,
  showAddFormNext: false,
  editId: '',
  showTip: false,
  showFormDetail: false,
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
    ellipsis: true,
    tooltip: true,
    width: 160,
  },
  {
    title: 'APP Secret',
    dataIndex: 'clientSecret',
    slotName: 'clientSecret',
    width: 180,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '应用创建人',
    dataIndex: 'createUser',
    width: 150,
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

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    Message.success('复制成功');
  } catch (err) {
    Message.error('复制失败');
  }
};

const computeLength = (data: string) => {
  if (data.length > 10) {
    state.showTip = true;
    return `${data.slice(0, 10)}...`;
  }
  state.showTip = false;
  return data;
};

const fetchTableData = async () => {
  state.tableLoading = true;
  const { pageNum, pageSize } = pagination;
  await fetchApplicationList({
    ...baseParams,
    companyId: userInfo?.companyId,
    pageNum,
    pageSize,
  }).then((res) => {
    state.tableLoading = false;
    pagination.total = res.data?.total;
    state.tableData = res.data?.records || [];
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
  if (res.data) {
    state.showDrawer = false;
    state.showAddFormNext = true;
    // 获取编辑应用信息
    state.editId = res.data;
  }
};

const handleTableDetail = (record: Record<string, any>) => {
  state.showFormDetail = true;
  state.editId = record.id;
};

const handleTableLaunch = (record: Record<string, any>) => {};

const handleTableEdit = (record: Record<string, any>) => {
  state.showFormDetail = true;
  state.editId = record.id;
};

const handleTableDel = (record: Record<string, any>) => {};

const handleCancel = () => {
  state.showAddFormNext = false;
  state.showDrawer = false;
};

const handleSearch = () => {
  fetchTableData();
};

const handleReset = () => {
  baseParams.appName = '';
};

onMounted(async () => {
  await fetchTableData();
});
</script>

<style lang="less" scoped>
.page-container {
  margin-bottom: 16px;
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
