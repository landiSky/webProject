<template>
  <t-page-header flex title="商品管理" :show-back="false">
    <t-row class="page-container">
      <t-col flex="1">
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
                  <t-button type="text" @click="handleGroupDel">删除</t-button>
                </template>
              </t-table>
            </div>
          </div>
        </div>
      </t-col>
      <t-col flex="40px" class="arrow"><img :src="labelArrow" /></t-col>
      <t-col flex="1">
        <div class="right-page-container" flex :show-back="false">
          <div class="right-content-layout">
            <div class="right-page-title">行业分组标签</div>
            <div class="content">
              <t-button type="primary" size="large" class="add-btn"
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
                <template #operater>
                  <t-button type="text">编辑</t-button>
                  <t-button type="text">删除</t-button>
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
} from '@/api/inventory/labelManage';
import { Message } from '@tele-design/web-vue';
import labelArrow from '@/assets/images/inventory/label-arrow.png';
import GroupModal from './components/GroupModal.vue';

const state = reactive<{
  groupTableLoading: boolean;
  showGroupVisible: boolean;
  confirmGroupLoading: boolean;
  groupTableData: Record<string, any>[];
  tagTableLoading: boolean;
  tagTableData: Record<string, any>[];
  groupTitle: string;
  rowKey: string;
  scrollHeight: number;
  groupEditData: any;
}>({
  groupTableLoading: false,
  showGroupVisible: false,
  confirmGroupLoading: false,
  groupTableData: [],
  tagTableLoading: false,
  tagTableData: [],
  groupTitle: '新增分组',
  rowKey: '',
  scrollHeight: window.innerHeight - 344,
  groupEditData: {},
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
    width: 140,
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
    width: 120,
  },
  {
    title: '操作',
    slotName: 'operater',
    width: 126,
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
    width: 140,
  },
  {
    title: '打标商品数',
    dataIndex: 'tagCountByTag',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'operater',
    width: 126,
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
  fetchEditGroup({ groupId: record.id }).then((res) => {
    if (res.code === 200) {
      state.groupEditData = res.data;
    } else {
      state.groupEditData = {};
    }
  });
};

const handleTableRowClick = (record: any) => {
  state.tagTableLoading = true;
  state.rowKey = record.id;
  fetchTagData(record.id);
};

// 设置table行背景色
const setRowClass = (record: TableData) => {
  return state.rowKey === record.key ? 'selectd-row' : {};
};

const handleLabelConfirm = (form: object) => {
  state.confirmGroupLoading = true;
  fetchAddGroup(form).then((res) => {
    state.confirmGroupLoading = false;
    if (res.code === 200) {
      Message.success(res.message);
      fetchGroupData();
      state.showGroupVisible = false;
    } else {
      Message.error(res.message);
    }
  });
};

const handleLabelCancel = () => {
  state.showGroupVisible = false;
};

onMounted(async () => {
  state.groupTableLoading = true;
  await fetchGroupData().then((res) => {
    state.groupTableLoading = false;
    if (res.code === 200) {
      state.groupTableData = res.data;
      state.rowKey = res.data[0]?.id; // 默认选择第一个
      fetchTagData(res.data[0]?.id);
    } else {
      state.groupTableData = [];
    }
  });
});
</script>

<style scope lang="less">
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

.tele-page-header-content {
  padding: 24px 24px 0;
  background: #f2f3f8;
}

.left-content-layout,
.right-content-layout {
  .content {
    padding: 20px;
    border: 1px solid #c9cdd4;

    .add-btn {
      margin-bottom: 10px;
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
  margin-left: 10px;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
}
</style>
