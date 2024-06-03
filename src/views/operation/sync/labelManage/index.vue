<template>
  <t-page-header flex title="标签管理" :show-back="false">
    <t-row class="page-container">
      <t-col :span="12">
        <div class="left-page-container" :show-back="false">
          <div class="left-content-layout">
            <div class="left-page-title">分组列表</div>
            <div class="content">
              <t-button
                type="primary"
                size="large"
                class="add-btn"
                @click="handleAddGroup"
                >新增分组</t-button
              >
              <t-table
                ref="tableRef"
                row-key="id"
                :scroll="{ y: state.scrollHeight }"
                :row-class="setRowClass"
                :loading="state.groupTableLoading"
                :columns="tagGroupColumns"
                :data="state.groupTableData"
                :pagination="false"
                bordered
                @row-click="handleTableRowClick"
              >
                <template #sortNumber="{ rowIndex }">
                  <span>{{ rowIndex + 1 }}</span>
                </template>
                <template #type="{ record }">
                  <span>{{ TypeList[record.type] }}</span>
                </template>
                <template #operater="{ record }">
                  <t-button type="text" @click="handleGroupEdit(record)"
                    >编辑</t-button
                  >
                  <t-button type="text" @click="handleGroupDel(record)"
                    >删除</t-button
                  >
                </template>
              </t-table>
            </div>
          </div>
          <div>
            <div class="left-content-img"></div>
          </div>
        </div>
      </t-col>
      <!-- <t-col :span="2" class="arrow"><img :src="labelArrow" /></t-col> -->
      <t-col :span="12">
        <div class="right-page-container" flex :show-back="false">
          <div class="right-content-layout">
            <div class="right-page-title">行业分组标签</div>
            <div class="content">
              <t-button
                type="primary"
                size="large"
                class="add-btn"
                @click="handleAddLabel"
                >新增标签</t-button
              >
              <t-table
                ref="tableRef"
                row-key="id"
                :scroll="{ y: state.scrollHeight }"
                :loading="state.tagTableLoading"
                :columns="tagColumns"
                :data="state.tagTableData"
                :pagination="false"
                bordered
              >
                <template #sortNumber="{ rowIndex }">
                  <span>{{ rowIndex + 1 }}</span>
                </template>
                <template #operater="{ record }">
                  <t-button type="text" @click="handleLabelEdit(record)"
                    >编辑</t-button
                  >
                  <t-button type="text" @click="handleLabelDel(record)"
                    >删除</t-button
                  >
                </template>
              </t-table>
            </div>
          </div>
        </div>
      </t-col>
    </t-row>
  </t-page-header>
  <GroupModal
    v-if="state.showGroupVisible"
    :title="state.groupTitle"
    :visible="state.showGroupVisible"
    :confirm-loading="state.confirmGroupLoading"
    :group-edit-data="state.groupEditData"
    @on-confirm="handleGroupConfirm"
    @on-cancel="handleGroupCancel"
  />
  <LabelModal
    v-if="state.showLabelVisible"
    :title="state.labelTitle"
    :visible="state.showLabelVisible"
    :confirm-loading="state.confirmLabelLoading"
    :label-edit-data="state.labelEditData"
    :group-row-record="state.groupRowRecord"
    @on-confirm="handleLabelConfirm"
    @on-cancel="handleLabelCancel"
  />
</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted, reactive } from 'vue';
import {
  fetchGroupData,
  fetchLabelData,
  fetchAddGroup,
  fetchEditGroup,
  fetchDelGroup,
  fetchAddLabel,
  fetchEditLabel,
  fetchDelLabel,
} from '@/api/inventory/labelManage';
import { Message } from '@tele-design/web-vue';
import labelArrow from '@/assets/images/inventory/label-arrow1.png';
import GroupModal from './components/GroupModal.vue';
import LabelModal from './components/labelModal.vue';

const state = reactive<{
  groupTableLoading: boolean;
  showGroupVisible: boolean;
  showLabelVisible: boolean;
  confirmGroupLoading: boolean;
  confirmLabelLoading: boolean;
  groupTableData: Record<string, any>[];
  tagTableLoading: boolean;
  tagTableData: Record<string, any>[];
  groupRowRecord: Record<string, any>;
  groupEditRecord: Record<string, any>[];
  groupTitle: string;
  labelTitle: string;
  rowKey: string;
  scrollHeight: number;
  groupEditData: any;
  labelEditData: any;
}>({
  groupTableLoading: false,
  showGroupVisible: false,
  showLabelVisible: false,
  confirmGroupLoading: false,
  confirmLabelLoading: false,
  groupTableData: [],
  groupRowRecord: {},
  groupEditRecord: [],
  tagTableLoading: false,
  tagTableData: [],
  groupTitle: '新增分组',
  labelTitle: '新增标签',
  rowKey: '',
  scrollHeight: window.innerHeight - 344,
  groupEditData: {},
  labelEditData: {},
});

// 状态
const TypeList: { [name: string]: any } = {
  0: '否',
  1: '是',
};

const tagGroupColumns = [
  {
    title: '序号',
    slotName: 'sortNumber',
    tooltip: true,
    width: 60,
  },
  {
    title: '分组名称',
    dataIndex: 'name',
    width: 130,
  },
  {
    title: '标签数',
    dataIndex: 'tagCountByGroup',
    width: 70,
    tooltip: true,
  },
  {
    title: '是否支持筛选',
    dataIndex: 'type',
    slotName: 'type',
    width: 110,
  },
  {
    title: '操作',
    slotName: 'operater',
    width: 110,
  },
];

const tagColumns = [
  {
    title: '序号',
    slotName: 'sortNumber',
    tooltip: true,
    width: 60,
  },
  {
    title: '标签名称',
    dataIndex: 'name',
    width: 130,
  },
  {
    title: '打标商品数',
    dataIndex: 'tagCountByTag',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'operater',
    width: 110,
  },
];

// 新增分组
const handleAddGroup = () => {
  state.groupTitle = '新增分组';
  state.groupEditData = null;
  state.showGroupVisible = true;
};

const fetchTagData = (id: string) => {
  state.tagTableLoading = true;
  fetchLabelData(id).then((res) => {
    state.tagTableLoading = false;
    if (res.code === 200) {
      state.tagTableData = res.data;
    } else {
      state.tagTableData = [];
    }
  });
};

const handleGroupEdit = (record: any) => {
  state.groupTitle = '编辑分组';
  state.showGroupVisible = true;
  state.groupEditData = record;
};

const handleGroupDel = (record: any) => {
  console.log('handleDel', record);
  fetchDelGroup(record.id).then((res) => {
    if (res.code === 200) {
      Message.success('删除成功');
      fetchGroupData();
    } else {
      Message.error(res.message);
    }
  });
};

const handleTableRowClick = (record: any, eve: Event) => {
  if (eve.target.type !== 'button') {
    // 点击操作按钮不发送请求
    state.tagTableLoading = true;
    state.rowKey = record.id;
    state.groupRowRecord = record;
    fetchTagData(record.id);
  }
};

// 设置table行背景色
const setRowClass = (record: TableData) => {
  return state.rowKey === record.key ? 'selectd-row' : {};
};

const handleGroupConfirm = (form: object) => {
  state.confirmGroupLoading = true;
  const params = state.groupEditData
    ? { id: state.groupEditData.id, ...form }
    : form;
  // 编辑确认
  if (state.groupEditData) {
    fetchEditGroup(params).then((res) => {
      state.confirmGroupLoading = false;
      if (res.code === 200) {
        Message.success('编辑成功');
        fetchGroupData();
      } else {
        Message.error(res.message);
      }
    });
    return;
  }
  fetchAddGroup(params).then((res) => {
    state.confirmGroupLoading = false;
    if (res.code === 200) {
      Message.success('新增成功');
      fetchGroupData();
      state.showGroupVisible = false;
    } else {
      Message.error(res.message);
    }
  });
};

const handleGroupCancel = () => {
  state.showGroupVisible = false;
};

// 标签新增
const handleAddLabel = () => {
  console.log('handleAddLabel');
  state.showLabelVisible = true;
  state.labelTitle = '新增标签';
  state.labelEditData = null;
};

// 标签确认
const handleLabelConfirm = (form) => {
  state.confirmLabelLoading = true;
  const params = state.labelEditData
    ? { ...form, id: state.labelEditData.id, groupId: state.groupRowRecord.id }
    : { ...form, groupId: state.groupRowRecord.id };

  if (state.labelEditData) {
    fetchEditLabel(params).then((res) => {
      state.confirmLabelLoading = false;
      if (res.code === 200) {
        Message.success('编辑成功');
        fetchTagData(state.rowKey);
        state.showLabelVisible = false;
      } else {
        Message.error(res.message);
      }
    });
    return;
  }

  fetchAddLabel(params).then((res) => {
    state.confirmLabelLoading = false;
    if (res.code === 200) {
      Message.success('新增成功');
      fetchTagData(state.rowKey);
      state.showLabelVisible = false;
    } else {
      Message.error(res.message);
    }
  });
};

// 标签关闭
const handleLabelCancel = () => {
  state.showLabelVisible = false;
};

// 标签 编辑
const handleLabelEdit = (record: any) => {
  state.LabelTitle = '编辑标签';
  state.showLabelVisible = true;
  console.log('handleLabelEdit', record);
  state.labelEditData = record;
};

// 标签删除
const handleLabelDel = (record: any) => {
  console.log('handleDel', record);
  fetchDelLabel(record.id).then((res) => {
    if (res.code === 200) {
      Message.success('删除成功');
      fetchLabelData();
    } else {
      Message.error(res.message);
    }
  });
};

onMounted(async () => {
  state.groupTableLoading = true;
  await fetchGroupData().then((res) => {
    state.groupTableLoading = false;
    if (res.code === 200) {
      state.groupTableData = res.data;
      state.rowKey = res.data[0]?.id; // 默认选择第一个
      state.groupRowRecord = res.data[0] || {}; // 默认存第一行值供标签使用
      fetchTagData(res.data[0]?.id);
    } else {
      state.groupTableData = [];
    }
  });
});
</script>

<style scoped lang="less">
.tele-table-hover:not(.tele-table-dragging)
  .tele-table-tr:not(.tele-table-tr-empty):not(.tele-table-tr-summary):hover
  .tele-table-td:not(.tele-table-col-fixed-left):not(
    .tele-table-col-fixed-right
  ) {
  background: #e8f4ff;
}

.selectd-row {
  td {
    background: #e8f4ff;
  }
}

.tele-page-header {
  padding: 16px 0 0;
}

.page-container {
  padding: 16px 34px 20px;
  background: #fff;

  .arrow {
    margin-top: 24%;
    text-align: center;

    img {
      width: 12px;
      height: 24px;
    }
  }
}

:deep(.tele-page-header-content) {
  padding: 24px 24px 0;
  background: #f2f3f8;
}

.left-content-layout,
.right-content-layout {
  .content {
    padding: 20px;
    border: 1px solid #c9cdd4;

    .add-btn {
      height: 32px;
      margin-bottom: 10px;
      padding: 6px 16px 6px 16px;
    }

    .tele-table-container {
      .tele-btn-size-medium {
        margin-right: 4px;
        padding: 0;
      }
    }
  }
}

.left-page-title,
.right-page-title {
  margin-bottom: 16px;
  margin-left: 10px;
  font-weight: 500;
  font-size: 14px;
  font-family: PingFang SC;
  line-height: 44px;
}

.left-page-container {
  display: flex;
  align-items: center;
  padding-right: 24px;
}

.left-content-layout {
  width: 100%;
}

.left-content-img {
  width: 20px;
  height: 20px;
  margin-top: 44px;
  margin-left: -10px;
  border-top: 1px solid rgba(201, 205, 212, 1);
  border-right: 1px solid rgba(201, 205, 212, 1);
  transform: rotate(45deg);
}
</style>
