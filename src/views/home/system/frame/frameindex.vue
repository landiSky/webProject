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
        :hide-expand-button-on-empty="true"
        :data="state.tableData"
        :pagination="false"
        bordered
      >
        <template #empty>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              height: 140px;
            "
          >
            <div>
              <img :src="noData" alt="" />
              <div class="nodata">暂无数据</div>
            </div>
          </div>
        </template>
        <template #operations="{ record }">
          <t-link @click="addDept(record)"> 添加子部门 </t-link>
          <t-link @click="editDept(record)">编辑</t-link>
          <t-link @click="deleteDept(record)">删除</t-link>
          <t-link @click="showDept(record)">查看</t-link>
        </template>
      </t-table>
    </t-page-header>
    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    />
    <DetailModal
      v-if="detailModalVisible"
      :visible="detailModalVisible"
      :data="state.detailData"
      @confirm="detailModalVisible = false"
      @cancel="detailModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import {
  deptTreeData,
  deptInfo,
  delDept,
  hasDeptMemeber,
} from '@/api/system/dept';
import noData from '@/assets/images/noData.png';
import EditModal from './components/edit-modal.vue';
import DetailModal from './components/detail-modal.vue';

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
  delLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
  statusOptions: { value: string; label: string }[];
  rangeTimeList: string[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
}>({
  tableLoading: false,
  delLoading: false,
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

const editModalVisible = ref(false);

const detailModalVisible = ref(false);

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

const fetchData = () => {
  state.tableLoading = true;
  deptTreeData({
    companyId: userInfoByCompany.value?.companyId,
  })
    .then((res: any) => {
      state.tableLoading = false;
      state.tableData = JSON.parse(
        JSON.stringify(res).replace(/childNodes/g, 'children')
      );
    })
    .catch(() => {
      state.tableLoading = false;
    });
};

const addDept = (record: Record<string, any>) => {
  state.editData = {};
  state.editData.parentId = record.id; // 新增传当前id
  state.editData.title = '新增子部门';
  editModalVisible.value = true;
};

// 点击编辑按钮
const editDept = async (record: Record<string, any>) => {
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
const deleteDept = (record: Record<string, any>) => {
  hasDeptMemeber({ deptId: record.id }).then((res: any) => {
    if (res) {
      Modal.warning({
        title: '确定删除该企业架构吗？',
        titleAlign: 'start',
        content: '删除后数据无法进行操作',
        okText: '确认',
        hideCancel: false,
        okLoading: state.delLoading,
        okButtonProps: {
          status: 'danger',
        },
        onOk: () => {
          state.delLoading = true;
          delDept({ deptId: record.id })
            .then(() => {
              state.delLoading = false;
              Message.success('删除成功');
              fetchData();
            })
            .catch(() => {
              state.delLoading = false;
            });
        },
      });
    } else {
      Modal.warning({
        title: '该企业组织架构下存在成员无法删除',
        titleAlign: 'start',
        content: '请移除该组织下成员进行删除操作',
        okText: '取消',
        hideCancel: true,
        okButtonProps: {
          type: 'secondary',
        },
      });
    }
  });
};
// 查看
const showDept = async (record: Record<string, any>) => {
  await deptInfo({ deptId: record.id })
    .then((res: any) => {
      state.detailData = res;
    })
    .catch(() => {})
    .finally(() => {
      detailModalVisible.value = true;
    });
};
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

.nodata {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
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
