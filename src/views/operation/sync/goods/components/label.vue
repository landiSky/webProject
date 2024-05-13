<template>
  <t-modal
    v-model:visible="showModal"
    :closable="false"
    :width="520"
    :height="600"
    class="label-modal-container"
    body-class="label-modal-body"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>商品打标</template>
    <div class="sub-title"
      >请选择商品标签<span class="sub-title-tip">（最多可选择3个）</span></div
    >
    <div class="content">
      <t-spin v-if="state.labelLoading" class="label-spin" />
      <t-transfer
        v-if="!state.labelLoading"
        :title="['全部标签', '已选择标签']"
        :data="getTransferData(state.treeData)"
        :show-select-all="false"
        @select="handleTransferSelectChange"
      >
        <template #source="{ data, selectedKeys, onSelect }">
          <t-tree
            :checkable="true"
            :checked-keys="selectedKeys"
            :data="getSourceTreeData(data)"
            @check="onSelect"
          />
        </template>
        <template #target="{ data, selectedKeys, onSelect }">
          <t-tree
            ref="targetTreeRef"
            :checkable="true"
            :checked-keys="selectedKeys"
            :data="getTargetTreeData(data, selectedKeys, onSelect)"
            @check="onSelect"
          />
        </template>
      </t-transfer>
    </div>
  </t-modal>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  reactive,
} from 'vue';
import { fetchLabel } from '@/api/inventory/fetchLabel';
import treeData from './data';

const emits = defineEmits(['onConfirm', 'onCancel']);

const targetTreeRef = ref(null);

const state = reactive<{
  labelLoading: boolean;
  transferData: Record<string, any>[];
  treeData: Record<string, any>[];
  sourceTreeData: Record<string, any>[];
  selectedKeys: Record<string, any>[];
  limit: boolean;
  checkedValues: Record<string, any>[];
}>({
  labelLoading: true,
  transferData: [],
  treeData,
  sourceTreeData: [],
  selectedKeys: [],
  limit: false,
  checkedValues: [],
});

const props = defineProps({
  labelVisible: Boolean,
  recordData: Object,
});

const showModal = computed(() => props.labelVisible);

const getSourceTreeData = (data = []) => {
  const values = data.map((item) => item.value);
  const travel = (_treeData = []) => {
    const treeDataSource = [];
    _treeData.forEach((item) => {
      if (item.children || values.includes(item.key)) {
        treeDataSource.push({
          title: item.title,
          key: item.key,
          checkable: item.checkable,
          children: travel(item.children),
        });
      }
    });
    return treeDataSource;
  };

  return travel(state.treeData).filter((i) => i.children[0]);
};

const getTargetTreeData = (data = []) => {
  const values = data.map((item) => item.value);
  const travel = (_treeData = []) => {
    const treeDataSource = [];
    _treeData.forEach((item) => {
      if (item.children || values.includes(item.key)) {
        treeDataSource.push({
          title: item.title,
          key: item.key,
          checkable: item.checkable,
          // 这里需要加下最多只能选3个限制
          disableCheckbox:
            state.limit &&
            !state.checkedValues.includes(item.key) &&
            !!state.checkedValues[0],
          children: travel(item.children),
        });
      }
    });
    return treeDataSource;
  };
  return travel(state.treeData).filter((i) => i.children[0]);
};

const getTransferData = (treeData = [], transferDataSource = []) => {
  treeData.forEach((item) => {
    if (item.children) getTransferData(item.children, transferDataSource);
    else
      transferDataSource.push({
        label: item.title,
        value: item.key,
      });
  });
  return transferDataSource;
};

const handleOk = () => {
  emits('onConfirm');
};

const handleCancel = () => {
  emits('onCancel');
};

const fetchLabelData = () => {
  fetchLabel({ id: props.recordData?.id })
    .then((res: any) => {
      if (res.code === 200) {
        state.labelLoading = false;
      }
    })
    .finally(() => {
      state.labelLoading = false;
    });
};

const handleTransferSelectChange = (values: []) => {
  state.checkedValues = values;
  if (targetTreeRef.value?.getCheckedNodes().length >= 2) {
    state.limit = true;
  } else {
    state.limit = false;
  }
};

onMounted(async () => {
  await fetchLabelData();
});
</script>

<style lang="less" scoped>
.label-modal-container {
  .content {
    :deep(.tele-transfer-view) {
      height: 418px;
    }
  }

  .label-modal-body {
    .tele-transfer {
      justify-content: center;
    }

    .label-spin {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .sub-title {
      margin-right: 4px;
      margin-bottom: 16px;
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;

      .sub-title-tip {
        color: #86909c;
        font-weight: 400;
        font-size: 12px;
      }
    }

    .tele-transfer-list-item {
      display: block;
      height: auto;
    }
  }
}
</style>
