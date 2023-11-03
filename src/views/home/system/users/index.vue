<template>
  <div>
    <t-page-header flex title="角色管理" :show-back="false">
      <!-- <template #breadcrumb>
      <Breadcrumb :items="['组织架构', '角色管理']" />
    </template> -->
      <t-row :wrap="false">
        <t-col flex="auto">
          <t-button type="primary" @click="clickAddBtn">
            新增企业成员
          </t-button>
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
                <t-button type="primary" @click="clickSearchBtn">
                  查询
                </t-button>
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
          <span v-if="record.status === 1" class="circle danger"></span>
          <span v-else class="circle green"></span>
          {{ record.status === 0 ? '在职' : '离职' }}
        </template>
        <template #operations="{ record }">
          <t-link
            v-if="record.roleName === '超级管理员' && record.status === 0"
            @click="clickDetailBtn(record)"
          >
            变更管理员
          </t-link>
          <t-link
            v-if="record.status === 0 && record.roleName !== '超级管理员'"
            @click="clickEditBtn(record)"
          >
            编辑
          </t-link>
          <t-link
            v-if="record.status === 0 && record.roleName !== '超级管理员'"
            @click="clickDelBtn(record)"
            >离职</t-link
          >
          <t-link v-if="record.status === 1">--</t-link>
        </template>
      </t-table>
    </t-page-header>

    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="clickAddBtnflag"
    ></EditModal>
    <EditModalAlter
      v-if="editModalVisiblealter"
      :data="state.editData"
      @confirm="onEditModalConfirmAlter"
      @cancel="editModalVisiblealterflag"
    >
    </EditModalAlter>
  </div>

  <!-- <EditModalFullscreen
    v-if="editFullModalVisible"
    @confirm="onFullModalConfirm"
    @cancel="editFullModalVisible = false"
  ></EditModalFullscreen> -->
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
// import dayjs from 'dayjs';
import {
  Modal,
  // Message
} from '@tele-design/web-vue';
import EditModal from './components/edit-modal.vue';
import EditModalAlter from './components/edit-modal-alter.vue';

// const defaultFormModel: Record<string, string | number | undefined> = {
//   name: undefined,
//   username: undefined,
//   state: undefined,
//   startTime: undefined,
//   endTime: undefined,
// };
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
    userName: string;
  };
  tableData: Record<string, any>;
  formModel: {
    name: string;
  };
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
    userName: '',
  },
  tableData: [],
  formModel: {
    name: '',
  },
});
// const state1 = reactive<{
//   tableLoading: boolean;
//   formModel: Record<string, any>;
//   tableData: Record<string, any>[];
//   statusOptions: { value: string; label: string }[];
//   rangeTimeList: string[];
//   editData: Record<string, any> | undefined; // 要编辑的数据
//   detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
// }>({
//   tableLoading: false,
//   formModel: { ...defaultFormModel },
//   tableData: [],
//   statusOptions: [
//     { value: ' ', label: '全部' }, // 默认有全部选项
//     { value: '1', label: '启用' },
//     { value: '2', label: '停用' },
//   ],
//   rangeTimeList: [],
//   editData: {
//     id: '',
//     memberId: '',
//     userId: '',
//     companyId: '',
//     phone: '',
//     roleList: [],
//   },
//   detailData: {},
// });

const columns = [
  //  tooltip: true,
  {
    ellipsis: true,
    title: '成员ID',
    dataIndex: 'id',

    width: 100,
  },
  {
    title: '成员姓名',
    dataIndex: 'userName',

    width: 140,
  },
  {
    title: '成员角色',
    dataIndex: 'roleName',
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
    dataIndex: 'phone',
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
// const onRangeChange = (
//   value: (Date | string | number | undefined)[] | undefined
// ) => {
//   if (value) {
//     const [startDate, endDate] = value || [];
//     [state.formModel.startTime, state.formModel.endTime] = [
//       `${startDate} 00:00:00`,
//       `${endDate} 23:59:59`,
//     ];
//   } else {
//     state.formModel.startTime = undefined;
//     state.formModel.endTime = undefined;
//   }
// };

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const editModalVisible = ref(false);

// const editFullModalVisible = ref(false); // 编辑全屏展示弹窗
// 变更管理员
const editModalVisiblealter = ref(false);

function fetchData() {
  const { current, pageSize } = pagination;
}

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

const data = {
  content: [
    {
      id: 1,
      userId: 1, // 用户id
      userName: 'kw1', // 用户名称
      phone: '18839014161', // 手机号
      companyId: null,
      memberId: 1, // 成员id
      status: 0, // 0:在职 1:离职
      roleList: null,
      roleName: '普通用户', // 角色名称
    },
    {
      id: 2,
      userId: 1, // 用户id
      userName: 'kw2', // 用户名称
      phone: '18839014161', // 手机号
      companyId: null,
      memberId: 1, // 成员id
      status: 1, // 0:在职 1:离职
      roleList: null,
      roleName: '普通用户', // 角色名称
    },
    {
      id: 3,
      userId: 1, // 用户id
      userName: 'kw3', // 用户名称
      phone: '18839014161', // 手机号
      companyId: null,
      memberId: 1, // 成员id
      status: 0, // 0:在职 1:离职
      roleList: null,
      roleName: '超级管理员', // 角色名称
    },
  ],
  pageNumber: 1,
  totalCount: 3,
};

state.tableData = data.content || [];
pagination.total = data.totalCount;

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
  // console.log(state.formModel.name);
  onPageChange(1);
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数

  clickSearchBtn();
};

// 点击编辑按钮
const clickEditBtn = (data: any) => {
  console.log(data);
  state.editData = data;
  editModalVisible.value = true;
};

// 点击新增按钮
const clickAddBtn = () => {
  editModalVisible.value = true;
};
// 取消 清空
const clickAddBtnflag = () => {
  state.editData = {
    id: undefined,
    memberId: undefined,
    userId: undefined,
    companyId: undefined,
    phone: '',
    roleList: [],
    status: undefined,
    roleName: '', // 角色名称
    userName: '',
  };
  editModalVisible.value = false;
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
  console.log(row.memberId);
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
  console.log(data, 'data');
  state.editData = data;
  editModalVisiblealter.value = true;
};
// 变更管理员 提交
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
};
const editModalVisiblealterflag = () => {
  state.editData = {
    id: undefined,
    memberId: undefined,
    userId: undefined,
    companyId: undefined,
    phone: '',
    roleList: [],
    status: undefined,
    roleName: '', // 角色名称
    userName: '',
  };
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
  // fetchData();
});
</script>

<style lang="less" scoped></style>
