<template>
  <t-modal
    v-model:visible="showModal"
    :closable="false"
    :width="520"
    :height="600"
    class="label-modal-container"
    body-class="label-modal-body"
    :ok-loading="props.confirmLoading"
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
        :default-value="getDetaultTransferData(state.treeData)"
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
            :data="getTargetTreeData(data)"
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

const emits = defineEmits(['onConfirm', 'onCancel']);

const targetTreeRef = ref(null);

const state = reactive<{
  labelLoading: boolean;
  transferData: Record<string, any>[];
  treeData: Record<string, any>[];
  sourceTreeData: Record<string, any>[];
  targetTreeData: Record<string, any>[];
  selectedKeys: Record<string, any>[];
  limit: boolean;
  checkedValues: Record<string, any>[];
}>({
  labelLoading: true,
  transferData: [],
  treeData: [],
  sourceTreeData: [],
  targetTreeData: [],
  selectedKeys: [],
  limit: false,
  checkedValues: [],
});

const props = defineProps({
  labelVisible: Boolean,
  recordData: Object,
  confirmLoading: Boolean,
});

const showModal = computed(() => props.labelVisible);

// 回显使用
const getDetaultTransferData = (
  treeData: any[] = [],
  transferDataSource: any[] = []
) => {
  treeData.forEach((item) => {
    if (item.children) {
      getDetaultTransferData(item.children, transferDataSource);
    } else {
      transferDataSource.push({
        label: item.name,
        value: item.id,
        hasChecked: item.hasChecked,
      });
    }
  });
  const result = transferDataSource
    .filter((item) => item.hasChecked)
    .map((i) => i.value);
  return result;
};

const getSourceTreeData = (data: any[] = []) => {
  const values = data.map((item) => item.value);
  const travel = (_treeData = []) => {
    const treeDataSource = [];
    _treeData.forEach((item) => {
      if (item.children || values.includes(item.id)) {
        treeDataSource.push({
          title: item.name,
          key: item.id,
          checkable: item.checkable,
          children: travel(item.children),
        });
      }
    });
    return treeDataSource;
  };

  return travel(state.treeData).filter((i) => i.children[0]);
};

const getTargetTreeData = (data: any[] = []) => {
  const values = data.map((item) => item.value);
  const travel = (_treeData = []) => {
    const treeDataSource = [];
    _treeData.forEach((item) => {
      if (item.children || values.includes(item.id)) {
        treeDataSource.push({
          title: item.name,
          key: item.id,
          checkable: item.checkable,
          // 这里需要加下最多只能选3个限制
          disableCheckbox:
            state.limit &&
            !state.checkedValues.includes(item.id) &&
            !!state.checkedValues[0],
          children: travel(item.children),
        });
      }
    });
    return treeDataSource;
  };
  return travel(state.treeData).filter((i) => i.children[0]);
};

const getTransferData = (
  treeData: any[] = [],
  transferDataSource: any[] = [],
  level = 0
) => {
  treeData.forEach((item) => {
    if (level === 0) {
      // 第一层没有复选框
      item.checkable = false;
    }
    if (item.children) {
      getTransferData(item.children, transferDataSource, level + 1);
    } else {
      transferDataSource.push({
        label: item.name,
        value: item.id,
      });
    }
  });
  return transferDataSource;
};

const handleOk = () => {
  emits(
    'onConfirm',
    targetTreeRef.value?.getCheckedNodes(),
    props.recordData?.id
  );
};

const handleCancel = () => {
  emits('onCancel');
};

const fetchLabelData = () => {
  return new Promise((resolve) => {
    fetchLabel({ productId: props.recordData?.id }).then((res: any) => {
      state.labelLoading = false;
      if (res.code === 200) {
        state.treeData = res.data;
        resolve(res.data);
      } else {
        resolve([]);
      }
    });
  });
};

const handleTransferSelectChange = (values: []) => {
  state.checkedValues = values;
  // 因为source和target共用一个values存储，所以还需要判断target本身是否有值
  if (values.length >= 3 && targetTreeRef.value?.getCheckedNodes().length > 0) {
    state.limit = true;
  } else {
    state.limit = false;
  }
};

onMounted(async () => {
  const result = await fetchLabelData();
  // 获取编辑默认选中的节点
  const r = getDetaultTransferData(result);
  // 初始化选中的节点
  setTimeout(() => {
    targetTreeRef?.value?.checkNode(r, true);
    state.limit = r.length >= 3;
  }, 200);
});
</script>

<style lang="less" scoped>
.label-modal-container {
  .content {
    :deep(.tele-tree-node) {
      .tele-tree-node-indent {
        .tele-tree-node-indent-block {
          width: 0;
          margin-right: 0;
        }
      }
    }

    :deep(.tele-transfer-view-body) {
      padding: 4px 12px;
    }

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
