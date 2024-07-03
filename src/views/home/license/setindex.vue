<template>
  <div>
    <t-alert banner closable>
      自建企业节点IDHub在企业前缀申请成功后，需申请License用于企业节点的部署配置。
    </t-alert>
    <t-page-header flex title="License管理" :show-back="false">
      <t-row :wrap="false">
        <t-col flex="auto">
          <t-button type="primary" @click="clickAddBtn"> 申请License </t-button>
        </t-col>
      </t-row>

      <t-table
        row-key="id"
        :loading="state.tableLoading"
        :columns="columns"
        :data="state.tableData"
        :empty="false"
        :pagination="{
          'show-total': true,
          'show-jumper': true,
          'show-page-size': true,
          'hide-on-single-page': true,
          ...pagination,
        }"
        class="table-top"
        bordered
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #authCycle="{ record }">
          {{ stateType[record.status].time }}
        </template>
        <template #status="{ record }">
          <div class="state-center">
            <span
              class="circle circle-right"
              :class="stateType[record.status].color"
            ></span>
            {{ stateType[record.status].name }}
            <t-tooltip
              v-if="record.status === 2"
              :content="`拒绝原因：${record.rejectRemark}`"
              position="top"
            >
              <div class="icon-info-circle"></div>
            </t-tooltip>
          </div>
        </template>
        <template #operations="{ record }">
          <t-space v-if="record.status !== 0">
            <t-link @click="clickEditBtn(record)"> 重新申请 </t-link>
            <t-link v-if="record.status !== 2" @click="clickEditBtn(record)">
              下载License
            </t-link>
          </t-space>
          <div v-if="record.status === 0">-</div>
        </template>
      </t-table>

      <AddForm
        v-if="state.showDrawer"
        :visible="state.showDrawer"
        title="申请License"
        @on-confirm="handleDrawerConfirm"
        @on-cancel="handleDrawerCancel"
      />
    </t-page-header>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import { Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { memberList } from '@/api/system/member';
import AddForm from './components/addForm.vue';

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

const state = reactive<{
  tableLoading: boolean;
  editData: {
    id: number | undefined;
    memberId: number | undefined;
    userId: number | undefined;
    companyId: number | undefined;
    phone: string;
    roleList: number[];
    status: number | undefined;
    roleName: string;
    username: string;
  };
  tableData: Record<string, any>;
  showDrawer: boolean;
}>({
  tableLoading: false,
  editData: {
    id: undefined,
    memberId: undefined,
    userId: undefined,
    companyId: undefined,
    phone: '',
    roleList: [],
    status: undefined,
    roleName: '', // 角色名称
    username: '',
  },
  tableData: [],
  showDrawer: true,
});

const columns = [
  {
    title: '编号',
    dataIndex: 'code',
    ellipsis: true,
    tooltip: true,
    width: 130,
  },
  {
    title: '企业前缀',
    dataIndex: 'entPrefix',
    ellipsis: true,
    tooltip: true,
    width: 130,
  },
  {
    title: '授权周期',
    dataIndex: 'authCycle',
    slotName: 'authCycle',
    width: 100,
  },

  {
    title: '剩余有效期',
    dataIndex: 'remainingValidDate',
    ellipsis: true,
    tooltip: true,
    width: 105,
  },
  {
    title: '申请状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 108,
  },
  {
    title: '生效时间',
    dataIndex: 'effectTime',
    width: 200,
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 200,
  },
];

const stateType: any = {
  0: {
    name: '审核中',
    color: 'orange',
    time: '6个月',
  },
  1: {
    name: '已生效',
    color: 'green',
    time: '1年',
  },
  2: {
    name: '已拒绝',
    color: 'danger',
    time: '2年',
  },
  3: {
    name: '已过期',
    color: 'gray',
    time: '3年',
  },
  4: {
    name: '待生效',
    color: 'blue',
    time: '4年',
  },
};

const pagination = reactive<{
  current: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  current: 1,
  pageSize: 10,
  total: 0,
});

const editModalVisible = ref(false);

function fetchData() {
  const { current, pageSize } = pagination;
  memberList({
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    companyId: userInfoByCompany.value?.companyId,
  }).then((res) => {
    state.tableData = res.records || [];
    pagination.total = res.total;
  });
}

// 每页显示条数发生变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchData();
};

// 页码发生变化
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData();
};

// 点击编辑按钮
const clickEditBtn = (data: any) => {
  state.editData = data;
  editModalVisible.value = true;
};

// 点击新增按钮
const clickAddBtn = () => {
  editModalVisible.value = true;
};

const handleDrawerCancel = () => {
  state.showDrawer = false;
};

const handleDrawerConfirm = () => {
  handleDrawerCancel();
};
onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.noClass {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: #86909c;
  font-weight: 400;
  font-size: 12px;
  font-family: 'PingFang SC';
  font-style: normal;
  line-height: 20px;
  text-align: center;

  .zwclass {
    color: #86909c;
    font-weight: 400;
    font-size: 12px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 20px;
    text-align: center;
  }

  .qkclass {
    margin-left: 4px;
    color: #1664ff;
    font-weight: 400;
    font-size: 12px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 20px;
    cursor: pointer;
  }

  .zwjg {
    color: #86909c;
    font-weight: 400;
    font-size: 12px;
    font-family: 'PingFang SC';
    font-style: normal;
    line-height: 20px;
  }
}

:deep(.tele-alert) {
  padding: 3px 16px;
}

.table-top {
  margin-top: 16px;
}

.circle-right {
  width: 4px;
  height: 4px;
  margin-right: 8px;
}

.state-center {
  display: flex;
  align-items: center;
}

.icon-info-circle {
  width: 13px;
  height: 13px;
  margin-left: 8px;
  background: url(@/assets/images/license/info-circle.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
</style>
