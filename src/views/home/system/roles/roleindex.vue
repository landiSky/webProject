<template>
  <div>
    <t-page-header flex title="角色管理" :show-back="false">
      <template #breadcrumb>
        <Breadcrumb :items="['组织架构', '角色管理']" />
      </template>
      <t-row :wrap="false">
        <t-col flex="auto">
          <t-button
            v-if="userInfoByCompany.profile !== rolestatusled.ROLESTATUS"
            type="primary"
            @click="clickAddBtn"
          >
            新建角色
          </t-button>
        </t-col>
        <t-col flex="auto">
          <t-form :model="state.formModel">
            <t-row :gutter="12" justify="end">
              <t-col flex="192px">
                <t-form-item field="name" hide-label>
                  <t-input
                    v-model="state.formModel.name"
                    placeholder="请输入角色名称"
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
          <span
            v-if="record.enabled === UserStatusEnum.UNUSED"
            class="circle danger"
          ></span>
          <span v-else class="circle green"></span>
          {{ record.enabled === UserStatusEnum.UNUSED ? '停用' : '正常' }}
        </template>
        <template #operations="{ record }">
          <!-- <t-link @click="clickDetailBtn(record)"> 详情 </t-link> -->
          <t-link
            v-if="
              userInfoByCompany.profile !== rolestatusled.ROLESTATUS ||
              userInfo.isAdmin === false
            "
            @click="onEditTreeConfirmsldrole(record)"
          >
            授权管理
          </t-link>

          <t-link
            v-if="
              userInfoByCompany.profile !== rolestatusled.ROLESTATUS ||
              userInfo.isAdmin === false
            "
            @click="clickEditBtn(record)"
            >编辑</t-link
          >
          <t-link
            v-if="
              userInfoByCompany.profile !== rolestatusled.ROLESTATUS ||
              userInfo.isAdmin === false
            "
            @click="delectlist(record.id, record.memberCount)"
            >删除</t-link
          >
          <span
            v-if="
              userInfoByCompany.profile === rolestatusled.ROLESTATUS ||
              userInfo.isAdmin === true
            "
            >-</span
          >
          <!-- <t-link @click="handleEditFullscreen(record)">全屏展示编辑</t-link> -->
        </template>
      </t-table>
    </t-page-header>
    <!-- <DetailDrawer
    v-if="detailDrawerVisible"
    :data="state.detailData"
    @cancel="detailDrawerVisible = false"
    @edit="onDetailEdit"
  ></DetailDrawer> -->

    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    ></EditModal>
    <!-- 角色权限 -->
    <TreeModalsles
      v-if="flagModalTree"
      :data="state.editData"
      @confirm="onEditTreeConfirmsld"
      @cancel="onEditTreeCancelsld"
    >
    </TreeModalsles>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
// import dayjs from 'dayjs';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { rolelist, apiRoleDelete, apiRoleDetails } from '@/api/system/role';
import { rolestatusled } from '@/enums/common';

import EditModal from './components/edit-modal.vue';

import TreeModalsles from './components/tree-modals.vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

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
    title: '角色名称',
    dataIndex: 'roleName',
    ellipsis: true,
    tooltip: true,
    width: '20%',
  },
  {
    title: '角色描述',
    dataIndex: 'remark',
    slotName: 'remark',
    width: '20%',
  },
  {
    title: '角色ID',
    dataIndex: 'id',
    width: '20%',
  },

  {
    title: '成员数量',
    dataIndex: 'memberCount',
    width: '10%',
  },

  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: '30%',
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

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const editModalVisible = ref(false);

// 角色弹窗
const flagModalTree = ref(false);
// const aaa = ref({});

function fetchData() {
  // @ts-ignore
  const { current, pageSize } = pagination;
  console.log(current, pageSize);

  // mock数据
  state.tableLoading = false;

  rolelist({
    pageSize: pagination.pageSize,
    pageNum: pagination.current,
    roleName: state.formModel.name,
    companyId: userInfoByCompany.value?.companyId,
    type: 0,
  })
    .then((res: any) => {
      console.log(res);
      state.tableData = res.records;
      pagination.total = res.total;
    })
    .catch((err) => {});
}

// 每页显示条数发生变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchData();
};

// 页码发生变化
const onPageChange = (current: number) => {
  state.formModel.name = '';
  pagination.current = current;
  fetchData();
};
// 查询
const clickSearchBtn = () => {
  console.log(state.formModel.name, ' state.formModel.name');
  // onPageChange(1);
  pagination.current = 1;
  fetchData();
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  // state.formModel = { ...defaultFormModel };
  // state.rangeTimeList = [];
  state.formModel.name = '';
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
  state.editData = undefined; // 编辑、新增复用一个modal时，清除编辑数据
  editModalVisible.value = true;
};
// 新增编辑弹窗确定后的回调
const onEditModalConfirm = () => {
  console.log('e');

  editModalVisible.value = false;

  fetchData();
};
const delectdata = () => {};
// 删除
const delectlist = (id: number, memberCount: number) => {
  console.log(id);
  if (memberCount === 0) {
    Modal.warning({
      title: '确定删除该角色吗？',
      titleAlign: 'start',
      content: '',
      okText: '删除',
      hideCancel: false,
      okButtonProps: {
        status: 'danger',
      },
      onOk: () => {
        apiRoleDelete({ roleId: id }).then((res) => {
          console.log(res);

          if (res.data.code === 200) {
            fetchData();
            Message.success('删除成功');
          }
        });
      },
    });
  } else {
    Modal.warning({
      title: '该角色下已有成员，暂无法删除。',
      titleAlign: 'start',
      content: '',
      okText: '好的',
      hideCancel: true,
      onOk: () => {
        // modifyUserStatus([id], UserStatusEnum.UNUSED);
      },
    });
  }
};

// 权限管理
const onEditTreeConfirmsldrole = (data: any) => {
  state.editData = data;
  flagModalTree.value = true;
};
// 完成
const onEditTreeConfirmsld = () => {
  flagModalTree.value = false;
  fetchData();
};
// 取消
const onEditTreeCancelsld = () => {
  flagModalTree.value = false;
};

onMounted(() => {
  console.log(userInfo.value);
  fetchData();
});
</script>

<style lang="less" scoped></style>
