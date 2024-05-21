<template>
  <t-page-header flex title="商品管理" :show-back="false">
    <t-row class="page-container">
      <t-col flex="auto">
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
                <template #operater>
                  <t-button type="text">编辑</t-button>
                  <t-button type="text">删除</t-button>
                </template>
              </t-table>
            </div>
          </div>
        </div>
      </t-col>
      <t-col flex="40px" class="arrow">箭头</t-col>
      <t-col flex="auto">
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
    title="新增分组"
    :visible="state.showGroupVisible"
    :confirm-loading="state.confirmGroupLoading"
    @on-confirm="handleLabelConfirm"
    @on-cancel="handleLabelCancel"
  />
</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted, reactive } from 'vue';
import { fetchGroupData, fetchLabelData } from '@/api/inventory/labelManage';
import GroupModal from './components/GroupModal.vue';

const state = reactive<{
  groupTableLoading: boolean;
  showGroupVisible: boolean;
  confirmGroupLoading: boolean;
  groupTableData: Record<string, any>[];
  tagTableLoading: boolean;
  tagTableData: Record<string, any>[];
}>({
  groupTableLoading: false,
  showGroupVisible: false,
  confirmGroupLoading: false,
  groupTableData: [],
  tagTableLoading: false,
  tagTableData: [],
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

const handleTableRowClick = (record: any) => {
  state.tagTableLoading = true;
  fetchTagData(record.id).then((res) => {
    state.tagTableLoading = false;
    if (res.code === 200) {
      state.tagTableData = res.data;
    } else {
      state.tagTableData = [];
    }
  });
};

const handleLabelConfirm = (data: any) => {
  console.log('handleLabelConfirm');
};

const handleLabelCancel = () => {
  state.showGroupVisible = false;
};

onMounted(async () => {
  state.groupTableLoading = true;
  await fetchGroupData().then((res) => {
    state.groupTableLoading = false;
    console.log('res', res);
    if (res.code === 200) {
      state.groupTableData = res.data;
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

.tele-page-header {
  padding: 16px 0 0;
}

.page-container {
  align-items: center;
  padding: 16px 34px 20px;
  background: #fff;

  .arrow {
    margin-top: 30px;
    text-align: center;
  }
}

.tele-page-header-content {
  padding: 24px 24px 0;
  background: #f2f3f8;
}

.left-content-layout,
.right-content-layout {
  .content {
    height: calc(100% - 20px);
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
