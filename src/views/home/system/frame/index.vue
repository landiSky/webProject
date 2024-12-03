<template>
  <div class="edit-modal">
    <t-page-header flex title="企业架构管理" :show-back="false">
      <t-row :wrap="false" class="add-dept">
        <t-col flex="auto">
          <t-button type="primary" @click="clickAddBtn"> 新建部门 </t-button>
        </t-col>
      </t-row>
      <t-table
        row-key="id"
        :loading="state.tableLoading"
        :columns="columns"
        :data="state.tableData"
        :pagination="false"
        bordered
      >
        <template #operations="{ record }">
          <t-link @click="addDept(record)"> 添加子部门 </t-link>
          <t-link @click="editDept(record)">编辑</t-link>
          <t-link @click="deleteDept(record.id, record.memberCount)"
            >删除</t-link
          >
          <t-link @click="showDept()">查看</t-link>
        </template>
      </t-table>
    </t-page-header>
    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import { apiRoleDelete } from '@/api/system/role';
import { deptTreeData, deptInfo } from '@/api/system/dept';
import { rolestatusled } from '@/enums/common';

import EditModal from './components/edit-modal.vue';

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);

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

const columns = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    ellipsis: true,
    tooltip: true,
    width: '20%',
  },
  {
    title: '部门主管',
    dataIndex: 'deptCharge',
    ellipsis: true,
    tooltip: true,
    width: '20%',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    tooltip: true,
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    width: '30%',
  },
];

const editModalVisible = ref(false);

const fetchData = () => {
  state.tableLoading = false;
  deptTreeData({
    companyId: userInfoByCompany.value?.companyId,
  })
    .then((res: any) => {
      console.log('resres', res);

      state.tableData = JSON.parse(
        JSON.stringify(res).replace(/childNodes/, 'children')
      );
    })
    .catch(() => {});
};

const addDept = (record: Record<string, any>) => {
  state.editData = {};
  state.editData.parentId = record.id; // 新增传当前id
  state.editData.title = '新增子部门';
  editModalVisible.value = true;
  console.log('addDept', record);
};

// 点击编辑按钮
const editDept = async (record: Record<string, any>) => {
  console.log('editDept', record);
  let memberList: [] = [];
  await deptInfo({ deptId: record.id })
    .then((res: any) => {
      memberList = res.memberList;
    })
    .catch(() => {})
    .finally(() => {
      state.editData = record;
      state.editData.memberList = memberList;
      state.editData.parentId = record.parentId; // 编辑传父级id
      state.editData.title = '编辑部门信息';
      editModalVisible.value = true;
      console.log('stateData', state.editData);
    });
};
// 点击新增按钮
const clickAddBtn = () => {
  state.editData = {}; // 编辑、新增复用一个modal时，清除编辑数据
  state.editData.parentId = 0;
  state.editData.title = '新增部门';
  editModalVisible.value = true;
};

// 新增编辑弹窗确定后的回调
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  fetchData();
};

// 删除
const deleteDept = (id: number, memberCount: number) => {
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
// 查看
const showDept = () => {};
onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.edit-modal {
  .add-dept {
    margin-bottom: 16px;
  }
}
// .noClass {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   height: 500px;
//   color: #86909c;
//   font-weight: 400;
//   font-size: 12px;
//   font-family: 'PingFang SC';
//   font-style: normal;
//   line-height: 20px;
//   text-align: center;

//   .zwclass {
//     color: #86909c;
//     font-weight: 400;
//     font-size: 12px;
//     font-family: 'PingFang SC';
//     font-style: normal;
//     line-height: 20px;
//     text-align: center;
//   }

//   .qkclass {
//     margin-left: 4px;
//     color: #1664ff;
//     font-weight: 400;
//     font-size: 12px;
//     font-family: 'PingFang SC';
//     font-style: normal;
//     line-height: 20px;
//     cursor: pointer;
//   }

//   .zwjg {
//     color: #86909c;
//     font-weight: 400;
//     font-size: 12px;
//     font-family: 'PingFang SC';
//     font-style: normal;
//     line-height: 20px;
//   }
// }
</style>
