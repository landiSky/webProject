<template>
  <div>
    <t-page-header flex title="企业成员管理" :show-back="false">
      <!-- <template #breadcrumb>
        <Breadcrumb :items="['组织架构', '角色管理']" />
      </template> -->
      <t-row :wrap="false">
        <t-col flex="auto">
          <t-button
            v-if="userInfoByCompany.primary !== rolestatusled.ROLESTATUS"
            type="primary"
            @click="clickAddBtn"
          >
            新增企业成员
          </t-button>
        </t-col>
        <t-col flex="auto">
          <t-form :model="state.formModel">
            <t-row :gutter="12" justify="end">
              <t-col flex="240px">
                <t-form-item field="name" hide-label>
                  <t-input
                    v-model="state.formModel.name"
                    placeholder="请输入企业成员姓名"
                    :max-length="30"
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
        :empty="false"
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
            v-if="
              record.memberType === 1 &&
              record.status === 0 &&
              userInfoByCompany.primary !== rolestatusled.ROLESTATUS
            "
            @click="clickDetailBtn(record)"
          >
            变更管理员
          </t-link>
          <t-link
            v-if="
              record.status === 0 &&
              record.memberType !== 1 &&
              userInfoByCompany.primary !== rolestatusled.ROLESTATUS
            "
            @click="clickEditBtn(record)"
          >
            编辑
          </t-link>
          <t-link
            v-if="
              record.status === 0 &&
              record.memberType !== 1 &&
              userInfoByCompany.primary !== rolestatusled.ROLESTATUS
            "
            @click="clickDelBtn(record)"
            >离职</t-link
          >
          <span
            v-if="
              record.status === 1 ||
              userInfoByCompany.primary === rolestatusled.ROLESTATUS
            "
            >--</span
          >
        </template>
        <template #empty> </template>
      </t-table>
    </t-page-header>
    <div v-if="pagination.total === 0 && noDatalist === true" class="noClass">
      <div>
        <img :src="noSearch" alt="" />
        <div>
          <span class="zwjg">暂无查询结果</span>

          <span class="qkclass" @click="clearSearchles()">清空查询项</span>
        </div>
      </div>
    </div>
    <div v-if="pagination.total === 0 && noDatalist === false" class="noClass">
      <div>
        <img :src="noData" alt="" />
        <div class="zwclass">暂无数据</div>
      </div>
    </div>

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

import {
  Modal,
  // Message
} from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { memberList, menberResign } from '@/api/system/member';
import { rolestatusled } from '@/enums/common';
import noSearch from '@/assets/images/noSearch.png';
import noData from '@/assets/images/noData.png';
import EditModal from './components/edit-modal.vue';
import EditModalAlter from './components/edit-modal-alter.vue';

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

// const defaultFormModel: Record<string, string | number | undefined> = {
//   name: undefined,
//   username: undefined,
//   state: undefined,
//   startTime: undefined,
//   endTime: undefined,
// };
const noDatalist = ref(false);
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
    username: '',
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
    title: '成员ID',
    dataIndex: 'memberId',
    width: 160,
  },
  {
    title: '成员姓名',
    dataIndex: 'username',

    width: 140,
  },
  {
    title: '成员角色',
    dataIndex: 'roleName',
    width: 170,
  },

  {
    title: '角色状态',
    dataIndex: 'enabled',
    slotName: 'enabled',
    width: 170,
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
    width: 190,
  },
];

const pagination = reactive<{
  current: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  current: 1,
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
  memberList({
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    username: state.formModel.name,
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

const clickSearchBtn = () => {
  onPageChange(1);
  noDatalist.value = true;
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  state.formModel.name = '';
  clickSearchBtn();
};
// 清空查询项
const clearSearchles = () => {
  state.formModel.name = '';
  onPageChange(1);
  noDatalist.value = false;
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
    username: '',
  };
  editModalVisible.value = false;
};
// 新增编辑弹窗确定后的回调
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  fetchData();
};

// modal类删除 离职
const clickDelBtn = (row: Record<string, any>) => {
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
      menberResign({ memberId: row.memberId }).then((res) => {
        fetchData();
      });
    },
  });
};
// 变更管理员
const clickDetailBtn = (data: any) => {
  state.editData = data;
  editModalVisiblealter.value = true;
};
// 变更管理员 提交
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
  // fetchData();
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
    username: '',
  };
  editModalVisiblealter.value = false;
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
</style>
