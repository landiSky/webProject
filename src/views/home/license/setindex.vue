<template>
  <div class="license_body">
    <t-alert v-if="!userInfo.isAdmin" banner closable>
      自建企业节点IDHub在企业前缀申请成功后，需申请License用于企业节点的部署配置。
    </t-alert>
    <t-page-header flex title="License管理" :show-back="false">
      <t-row :wrap="false">
        <t-col flex="auto" :class="{ 'manage-right': userInfo.isAdmin }">
          <t-button
            v-if="!userInfo.isAdmin"
            type="primary"
            @click="clickAddBtn"
          >
            申请License
          </t-button>
          <t-input-group v-if="userInfo.isAdmin">
            <t-select
              v-model.trim="state.formModel.type"
              :options="selectOptions"
              :style="{ width: '100px' }"
              placeholder="请选择"
            />
            <t-input-search
              v-model.trim="state.formModel.name"
              :style="{ width: '220px' }"
              :placeholder="`请输入${queryTypeName[state.formModel.type]}`"
              @search="clickSearchBtn"
            />
          </t-input-group>
        </t-col>
      </t-row>
      <t-row :wrap="false"> </t-row>
      <t-table
        :loading="state.tableLoading"
        :columns="userInfo.isAdmin ? manageColumns : userColumns"
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
        @filter-change="filterChange"
        @sorter-change="sorterChanged"
      >
        <template #authCycle="{ record }">
          {{
            record.authCycle >= 0 && record.authCycle != null
              ? stateType[record.authCycle]?.time
              : '-'
          }}
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
          <t-space v-if="userInfo.isAdmin">
            <t-link
              v-if="record.status !== 0 && record.status !== 2"
              @click="clickDetails(record, '1')"
            >
              详情
            </t-link>
            <div v-if="record.status === 2">-</div>
            <t-link
              v-if="record.status === 0"
              @click="clickDetails(record, '2')"
            >
              审核
            </t-link>
          </t-space>
          <t-space v-if="!userInfo.isAdmin">
            <t-link v-if="record.status !== 0" @click="clickEditBtn(record)">
              重新申请
            </t-link>
            <div v-if="record.status === 0">-</div>
            <t-link
              v-if="record.status !== 0 && record.status !== 2"
              @click="downloadLicense(record)"
            >
              下载License
            </t-link>
          </t-space>
        </template>
      </t-table>

      <AddForm
        v-if="state.showDrawer"
        :visible="state.showDrawer"
        :edit-id="state.editId"
        title="申请License"
        @on-confirm="handleDrawerConfirm"
        @on-cancel="handleDrawerCancel"
      />
    </t-page-header>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { userLicenseList, manageLicenseList } from '@/api/identifying/license';
import AddForm from './components/addForm.vue';

const userStore = useUserStore();
const { userInfo, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
const router = useRouter();
const route = useRoute();

const defaultFormModel: Record<string, any> = {
  orderAsc: '',
  status: '',
  type: 1,
  name: '',
};

const defaultFormData: Record<string, any> = {
  code: '',
  companyName: '',
  entPrefix: '',
};
const typeName: Record<string, any> = {
  1: 'code',
  2: 'entPrefix',
  3: 'companyName',
};

const queryTypeName: Record<string, any> = {
  1: '编号',
  2: '企业前缀',
  3: '企业名称',
};

const state = reactive<{
  tableLoading: boolean;
  tableData: Record<string, any>;
  formModel: Record<string, any>;
  formData: Record<string, any>;
  showDrawer: boolean;
  editId: string;
}>({
  tableLoading: false,
  tableData: [],
  formModel: { ...defaultFormModel },
  formData: { ...defaultFormData },
  showDrawer: false,
  editId: '',
});

const EntStatusList = [
  {
    text: '审核中',
    value: 0,
  },
  {
    text: '已拒绝',
    value: 2,
  },
  {
    text: '已过期',
    value: 3,
  },
  {
    text: '待生效',
    value: 4,
  },
  {
    text: '已生效',
    value: 1,
  },
];

const selectOptions = [
  {
    label: '编号',
    value: 1,
  },
  {
    label: '企业前缀',
    value: 2,
  },
  {
    label: '企业名称',
    value: 3,
  },
];
// 企业用户列表展示
const userColumns = [
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
// 管理员列表展示
const manageColumns = [
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
    title: '企业名称',
    dataIndex: 'companyName',
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
    title: 'License状态',
    dataIndex: 'status',
    slotName: 'status',
    filterable: {
      filters: EntStatusList,
      multiple: true,
    },
    width: 108,
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 120,
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
// 列表接口请求
function fetchData() {
  const { current, pageSize } = pagination;
  const userList = userInfo.value?.isAdmin
    ? manageLicenseList
    : userLicenseList;
  state.formData = { ...defaultFormData };
  if (state.formModel.type && state.formModel.name) {
    state.formData[typeName[state.formModel.type]] = state.formModel.name;
  }
  userList({
    pageSize,
    pageNum: current,
    companyId: userInfo.value?.isAdmin
      ? ''
      : userInfoByCompany.value?.companyId,
    ...state.formModel,
    ...state.formData,
  }).then((res) => {
    state.tableData = userInfo.value?.isAdmin
      ? res.data.records
      : res.records || [];
    pagination.total = userInfo.value?.isAdmin ? res.data.total : res.total;
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
  state.editId = data.id;
  state.showDrawer = true;
};
// 点击新增按钮
const clickAddBtn = () => {
  state.editId = '';
  state.showDrawer = true;
};
// 取消License弹窗
const handleDrawerCancel = () => {
  state.showDrawer = false;
};
// 打开申请License弹窗
const handleDrawerConfirm = () => {
  handleDrawerCancel();
  fetchData();
};
// 列表-License状态 多选
const filterChange = (dataIndex: string, filteredValues: string[]) => {
  if (filteredValues.length === 0) {
    state.formModel[`${dataIndex}`] = '';
  } else {
    state.formModel[`${dataIndex}`] = filteredValues.join(',');
  }
  onPageChange(1);
};
// 列表排序
const sorterChanged = (dataIndex: string, direction: string) => {
  if (direction === 'descend') {
    state.formModel.orderAsc = false;
  } else if (direction === 'ascend') {
    state.formModel.orderAsc = true;
  } else {
    state.formModel.orderAsc = '';
  }
  onPageChange(1);
};
// 搜素
const clickSearchBtn = () => {
  onPageChange(1);
};
// 详情和审核跳转
const clickDetails = (data: any, typeindex: string) => {
  if (typeindex === '1') {
    router.push({
      path: '/sync/license/addlicensedetail',
      query: {
        id: data.id,
      },
    });
    return;
  }
  router.push({
    path: '/sync/license/admin/reviewdetails',
    query: {
      id: data.id,
    },
  });
};
// 下载License文件
const downloadLicense = (data: any) => {
  const link = document.createElement('a');
  const objectUrl = `/server/web/file/licenseDownload?name=${data?.licenseUrl}&code=${data.code}`; // 创建一个新的url对象
  link.href = objectUrl;
  link.click();
  window.URL.revokeObjectURL(objectUrl); // 为了更好地性能和内存使用状况，应该在适当的时候释放url
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.manage-right {
  display: flex;
  justify-content: right;
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

.license_body {
  :deep(.tele-form-item) {
    margin-bottom: 0;
  }
}
</style>
