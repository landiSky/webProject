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
              <t-button type="text" @click="handleTableLaunchOrDel(record)">{{
                record.status ? '下线' : '上线'
              }}</t-button>
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
import { reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  fetchApplicationList,
  fetchOffineStatus,
  fetchOffine,
  fetchDel,
} from '@/api/devCenter/manage';
import { Message, Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import AddForm from './components/addForm.vue';
import AddFormNext from './components/addFormNext.vue';
import FormDetail from './components/formDetail.vue';

const store = useUserStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const { userInfo } = store;

const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

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
  tableRecord: Record<string, any>;
  showAnchor: boolean;
  offlineLoading: boolean;
  launchLoading: boolean;
  delLoading: boolean;
}>({
  tableLoading: false,
  tableData: [],
  showDrawer: false,
  showAddFormNext: false,
  editId: '',
  showTip: false,
  showFormDetail: false,
  tableRecord: {},
  showAnchor: false,
  offlineLoading: false,
  launchLoading: false,
  delLoading: false,
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
    companyId: userInfoByCompany.value?.companyId,
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
  if (route.query?.selectById) {
    router.push({ name: 'devManage' });
  }
};

const handleDrawerConfirm = (res: any) => {
  if (res) {
    state.showAnchor = true;
    state.showAddFormNext = true;
    // 获取编辑应用信息
    state.editId = res;
    handleDrawerCancel();
  }
};

const handleTableDetail = (record: Record<string, any>) => {
  console.log(record);
  state.showFormDetail = true;
  state.tableRecord = record;
  state.editId = record.id;
};

const handleTableLaunchOrDel = (record: Record<string, any>) => {
  // 0 未上线 1 上线
  const { status, id } = record;
  if (status) {
    fetchOffineStatus(id).then((res: any) => {
      if (res) {
        Modal.warning({
          title: '确定下线该应用吗？',
          content:
            '若已有售卖订单，为避免影响用户使用，请编辑修改后立即重新上线',
          titleAlign: 'start',
          okText: '下线应用',
          hideCancel: false,
          okLoading: state.offlineLoading,
          okButtonProps: {
            status: 'danger',
          },
          onBeforeOk(done) {
            state.offlineLoading = true;
            fetchOffine({ id, status: 0 })
              .then(() => {
                done(true);
                Message.success({
                  content: '下线成功',
                  duration: 500,
                  onClose: () => {
                    state.offlineLoading = false;
                    fetchTableData();
                  },
                });
              })
              .catch(() => {
                state.offlineLoading = false;
                done(false);
              });
          },
        });
      } else {
        Modal.warning({
          title: '该应用因在商城上架，无法下线',
          content:
            '当前对接应用已在商城上架，请先下架再下线，若已有售卖订单，为避免影响用户使用，请编辑修改后立即重新上线。',
          titleAlign: 'start',
          okText: '知道了',
          hideCancel: true,
          okButtonProps: {
            type: 'primary',
          },
        });
      }
    });
  } else {
    state.launchLoading = true;
    // 0 未上线 1 上线
    fetchOffine({ id, status: 1 })
      .then(() => {
        Message.success({
          content: '上线成功',
          duration: 500,
          onClose: () => {
            state.launchLoading = false;
            fetchTableData();
          },
        });
      })
      .catch(() => {
        state.launchLoading = false;
      });
  }
};

// 删除或者下线确认
const handleTableDel = (record: Record<string, any>) => {
  const { id } = record;
  Modal.warning({
    title: '确定删除该应用吗？',
    content: '',
    titleAlign: 'start',
    okText: '删除',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onBeforeOk(done) {
      state.delLoading = true;
      fetchDel(id)
        .then(() => {
          done(true);
          Message.success({
            content: '删除成功',
            duration: 500,
            onClose: () => {
              state.delLoading = false;
              fetchTableData();
            },
          });
        })
        .catch(() => {
          state.delLoading = false;
          done(false);
        });
    },
  });
};

const handleTableEdit = (record: Record<string, any>) => {
  state.showAddFormNext = true;
  state.editId = record.id;
};

const handleEditCancel = () => {
  state.showAnchor = false;
  state.showAddFormNext = false;
  state.showFormDetail = false;
  state.showDrawer = false;
  fetchTableData();
};

const handleSearch = () => {
  pagination.pageNum = 1;
  fetchTableData();
};

const handleReset = () => {
  pagination.pageNum = 1;
  baseParams.appName = '';
  fetchTableData();
};

watch(
  () => route.query.selectById,
  (newV) => {
    if (newV) {
      handleTableDetail({
        status: Number(route.query.selectByState),
        id: newV,
      });
    }
  },
  {
    immediate: true,
  }
);

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
