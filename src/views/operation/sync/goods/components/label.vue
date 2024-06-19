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
    <div class="container">
      <t-spin v-if="state.labelLoading" class="label-spin" />
      <div v-if="!state.labelLoading" class="tree-box">
        <div class="left-side">
          <div class="header-title"
            ><span>全部标签</span
            ><span class="num">{{ state.tagNum }}</span></div
          >
          <div class="content">
            <t-tree
              :checkable="true"
              :checked-keys="state.selectedKeys"
              :data="getSourceTreeData"
              @check="handleSourceSelect"
            />
          </div>
        </div>
        <div class="right-side">
          <div class="header-title"
            ><span>已选择标签</span
            ><span class="num">{{ state.selectedKeys.length }}</span></div
          >
          <ul class="content">
            <li
              v-for="item in state.targetData"
              :key="item.key"
              class="node-item"
            >
              <span>{{ item.title }}</span
              ><icon-close
                size="10"
                class="close"
                @click="handleDel(item.key)"
              />
            </li>
          </ul>
        </div>
      </div>
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
  targetData: Record<string, any>[];
  selectedKeys: Record<string, any>[];
  checkedValues: Record<string, any>[];
  tagNum: number;
}>({
  labelLoading: true,
  transferData: [],
  treeData: [],
  sourceTreeData: [],
  targetData: [],
  selectedKeys: [],
  checkedValues: [],
  tagNum: 0,
});

const props = defineProps({
  labelVisible: Boolean,
  recordData: Object,
  confirmLoading: Boolean,
});

const showModal = computed(() => props.labelVisible);

const handleSourceSelect = (selectedKeys, data) => {
  state.selectedKeys = selectedKeys;
  state.targetData = data.checkedNodes;
};

const getSourceTreeData = () => {
  const travel = (_treeData = [], level = 0) => {
    const treeDataSource = [];
    _treeData.forEach((item) => {
      treeDataSource.push({
        title: item.name,
        key: item.id,
        checkable: level, // 第一层不显示复选框
        // 这里需要加下最多只能选3个限制
        disableCheckbox:
          state.selectedKeys.includes(item.id) ||
          state.selectedKeys.length >= 3,
        children: item.children?.length ? travel(item.children, level + 1) : [],
      });
    });
    return treeDataSource;
  };
  return travel(state.treeData);
};

// 回显使用
const getDetaultTreeData = (treeData: any[] = [], dataSource: any[] = []) => {
  treeData.forEach((item) => {
    if (item.children) {
      getDetaultTreeData(item.children, dataSource);
    } else {
      dataSource.push({
        title: item.name,
        key: item.id,
        hasChecked: item.hasChecked,
      });
    }
  });
  const result = dataSource.filter((item) => item.hasChecked);
  state.selectedKeys = result.map((i) => i.key);
  state.targetData = result;
};

const handleDel = (key: any) => {
  state.selectedKeys = state.selectedKeys.filter((id) => id !== key);
  state.targetData = state.targetData.filter((item) => item.key !== key);
};

const handleOk = () => {
  emits('onConfirm', state.selectedKeys, props.recordData?.id);
};

const handleCancel = () => {
  emits('onCancel');
};

const fetchLabelData = () => {
  return new Promise((resolve) => {
    fetchLabel({ productId: props.recordData?.id })
      .then((res: any) => {
        state.labelLoading = false;
        console.log('fetchLabelData', res);
        if (res.code === 200) {
          state.treeData = res.data?.groupTagVOList || [];
          state.tagNum = res.data?.tagCount || 0;
          resolve(res.data?.groupTagVOList || []);
        } else {
          resolve([]);
        }
      })
      .catch(() => {
        state.labelLoading = false;
        resolve([]);
      });
  });
};

onMounted(async () => {
  const result = await fetchLabelData();
  // 获取编辑默认选中的节点
  getDetaultTreeData(result);
});
</script>

<style lang="less" scoped>
.label-modal-container {
  .container {
    .tree-box {
      display: flex;

      .left-side {
        margin-right: 8px;
      }

      .left-side,
      .right-side {
        width: 236px;
        height: 419px;
        border: 1px solid #e5e8ef;
      }

      .header-title {
        display: flex;
        justify-content: space-between;
        height: 40px;
        padding: 0 12px;
        color: #1d2129;
        font-weight: 500;
        line-height: 40px;
        background: #f6f7fb;
      }
    }

    .content {
      padding: 8px 20px 8px 16px;

      .node-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 36px;
        line-height: 36px;

        .close {
          cursor: pointer;
        }
      }
    }

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
