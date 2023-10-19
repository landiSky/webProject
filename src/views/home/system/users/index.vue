<template>
  <t-page-header flex title="角色管理" :show-back="false">
    <!-- <template #breadcrumb>
      <Breadcrumb :items="['组织架构', '角色管理']" />
    </template> -->
    <t-row :wrap="false">
      <t-col flex="auto">
        <t-button type="primary" @click="clickAddBtn"> 新增企业成员 </t-button>
      </t-col>
      <t-col flex="auto">
        <t-form :model="state.formModel">
          <t-row :gutter="12" justify="end">
            <t-col flex="192px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model="state.formModel.name"
                  placeholder="请输入企业成员姓名"
                  allow-clear
                />
              </t-form-item>
            </t-col>

            <t-col flex="70px">
              <t-button type="primary" @click="clickSearchBtn"> 查询 </t-button>
            </t-col>
            <t-col flex="68px">
              <t-button @click="handleReset"> 重置 </t-button>
            </t-col>
          </t-row>
        </t-form>
      </t-col>
    </t-row>

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
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <template #enabled="{ record }">
        <span
          v-if="record.enabled === UserStatusEnum.UNUSED"
          class="circle danger"
        ></span>
        <span v-else class="circle green"></span>
        {{ record.enabled === UserStatusEnum.UNUSED ? '停用' : '正常' }}
      </template>
      <template #operations="{ record }">
        <t-link @click="clickDetailBtn(record)"> 变更管理员 </t-link>
        <t-link @click="clickEditBtn(record)"> 编辑 </t-link>
        <t-link @click="clickDelBtn(record)">离职</t-link>
      </template>
    </t-table>
  </t-page-header>

  <EditModal
    v-if="editModalVisible"
    :data="state.editData"
    @confirm="onEditModalConfirm"
    @cancel="editModalVisible = false"
  ></EditModal>
  <EditModalAlter
    v-if="editModalVisiblealter"
    :data="state.editData"
    @confirm="onEditModalConfirmAlter"
    @cancel="editModalVisiblealter = false"
  >
  </EditModalAlter>

  <!-- <EditModalFullscreen
    v-if="editFullModalVisible"
    @confirm="onFullModalConfirm"
    @cancel="editFullModalVisible = false"
  ></EditModalFullscreen> -->
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import { Modal, Message } from '@tele-design/web-vue';
import EditModal from './components/edit-modal.vue';
import EditModalAlter from './components/edit-modal-alter.vue';

const defaultFormModel: Record<string, string | number | undefined> = {
  name: undefined,
  username: undefined,
  state: undefined,
  startTime: undefined,
  endTime: undefined,
};

const state = reactive<{
  tableLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
  statusOptions: { value: string; label: string }[];
  rangeTimeList: string[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
}>({
  tableLoading: false,
  formModel: { ...defaultFormModel },
  tableData: [],
  statusOptions: [
    { value: ' ', label: '全部' }, // 默认有全部选项
    { value: '1', label: '启用' },
    { value: '2', label: '停用' },
  ],
  rangeTimeList: [],
  editData: {},
  detailData: {},
});

const UserStatusEnum: { [name: string]: any } = {
  USED: 0, // 启用
  UNUSED: 1, // 停用
};

const columns = [
  {
    title: '成员ID',
    dataIndex: 'roleName',
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: '成员姓名',
    dataIndex: 'roleCode',
    slotName: 'roleCode',
    width: 140,
  },
  {
    title: '成员角色',
    dataIndex: 'userCount',
    width: 140,
  },

  {
    title: '角色状态',
    dataIndex: 'enabled',
    slotName: 'enabled',
    width: 120,
  },
  {
    title: '绑定手机号',
    dataIndex: 'createdBy',
    width: 140,
  },

  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: 290,
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

// 时间框选择格式是：年月日，接口入参需要加上时分秒
const onRangeChange = (
  value: (Date | string | number | undefined)[] | undefined
) => {
  if (value) {
    const [startDate, endDate] = value || [];
    [state.formModel.startTime, state.formModel.endTime] = [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`,
    ];
  } else {
    state.formModel.startTime = undefined;
    state.formModel.endTime = undefined;
  }
};

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const editModalVisible = ref(false);

// const editFullModalVisible = ref(false); // 编辑全屏展示弹窗
// 变更管理员
const editModalVisiblealter = ref(false);

function fetchData() {
  const { current, pageSize } = pagination;
  const params = {
    page: current - 1, // 从0开始
    size: pageSize,
    ...state.formModel,
  };

  // 接口请求
  // state.tableLoading = true;
  // roleList(params)
  //   .then((data: any) => {
  //     state.tableData = data.content;
  //     pagination.page = data.pageNumber;
  //     pagination.total = data.totalCount;
  //   })
  //   .finally(() => {
  //     state.tableLoading = false;
  //   });
  // mock数据
  state.tableLoading = false;
  const data = {
    content: [
      {
        id: 26,
        roleName: '测试角QAA色',
        roleCode: 'ROLE_BIBUCCAZCX',
        roleDesc: '测试角色',
        enabled: 0,
        authority: 1,
        userCount: 12,
        createdBy: 'super',
        createdTime: '2022-12-07 20:29:06',
      },
      {
        id: 25,
        roleName: '谢珍测试角色编辑',
        roleCode: 'ROLE_CNYAEDBPZU',
        roleDesc: '描述',
        enabled: 0,
        authority: 1,
        userCount: 0,
        createdBy: 'super',
        createdTime: '2022-12-07 18:28:17',
      },
      {
        id: 22,
        roleName: 'xdffef',
        roleCode: 'ROLE_TXOKINNOHD',
        roleDesc: '修改一次',
        enabled: 0,
        authority: 0,
        userCount: 6,
        createdBy: 'super',
        createdTime: '2022-12-07 16:07:13',
      },
      {
        id: 21,
        roleName: '12222',
        roleCode: 'ROLE_WZEZUFYCNG',
        roleDesc: null,
        enabled: 1,
        authority: 1,
        userCount: 2,
        createdBy: 'super',
        createdTime: '2022-12-07 14:58:14',
      },
    ],
    pageNumber: 1,
    totalCount: 11,
  };

  state.tableData = data.content || [];
  pagination.total = data.totalCount;
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

const clickSearchBtn = () => {
  console.log(state.formModel.name);
  onPageChange(1);
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  state.formModel = { ...defaultFormModel };
  state.rangeTimeList = [];
  clickSearchBtn();
};

// 点击编辑按钮
const clickEditBtn = (data: any) => {
  editModalVisible.value = true;
  state.editData = data;
};

// 点击新增按钮
const clickAddBtn = () => {
  state.editData = undefined; // 编辑、新增复用一个modal时，清除编辑数据
  editModalVisible.value = true;
};

// 新增编辑弹窗确定后的回调
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  fetchData();
};

// // 修改状态的接口
// const modifyUserStatus = (ids: Array<number>, enabled: 0 | 1) => {
//   changeUserStatus({
//     ids,
//     enabled, // : UserStatusEnum.USED : UserStatusEnum.UNUSED
//   })
//     .then(() => {
//       Message.success(
//         `${enabled === UserStatusEnum.USED ? '启用' : '停用'}成功!`
//       );
//       fetchData();
//     })
//     .catch(() => {});
// };

// modal类删除 离职
const clickDelBtn = (row: Record<string, any>) => {
  // // 前端判断无法删除时的弹窗情况
  // if (row?.binded === BindHdlStatusEnum.YES) {
  //   // 以前端请求数据为准，可能存在数据与实际不一致请求
  //   Modal.warning({
  //     title: '该用户已绑定标识身份，暂无法删除。',
  //     content: '如需删除，请先将该系统用户与标识身份解绑。',
  //     titleAlign: 'start',
  //     okText: '好的',
  //     hideCancel: true,
  //   });
  //   return;
  // }

  Modal.warning({
    title: '确定为该企业成员办理离职吗?',
    content: '离职后该成员将无法继续参与平台管理或项目开发。',
    titleAlign: 'start',
    okText: '办理离职',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      // deleteUsers(params);
    },
  });
};
// 变更管理员
const clickDetailBtn = (data: any) => {
  editModalVisiblealter.value = true;
  state.editData = data;
};
// 变更管理员
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
};

// 编辑全屏展示
// function handleEditFullscreen(data: any) {
//   state.editData = data;
//   editFullModalVisible.value = true;
// }

// 编辑全屏展示成功
// const onFullModalConfirm = () => {
//   editFullModalVisible.value = false;
//   fetchData();
// };

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped></style>
