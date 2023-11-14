<template>
  <t-page-header flex title="商品分类管理" :show-back="false">
    <t-row :wrap="false">
      <t-col flex="104px">
        <t-button type="primary" @click="addClass(0)"> 新建一级分类 </t-button>
      </t-col>
    </t-row>
    <div style="height: 16px"></div>
    <t-table
      row-key="id"
      :loading="state.tableLoading"
      :columns="columns"
      :data="state.tableData"
      :pagination="false"
      bordered
      :draggable="{ type: 'handle', width: 40 }"
      @filter-change="filterChange"
      @change="handleChange"
    >
      <template #operations="{ record }">
        <div class="operation">
          <t-link v-if="record.parentId === '0'" @click="addClass(record.id)">
            添加子分类
          </t-link>
          <t-link @click="editClass(record)"> 编辑 </t-link>
          <t-link @click="deleteClass(record)"> 删除 </t-link>
        </div>
      </template>
    </t-table>
  </t-page-header>

  <ClassModal
    v-if="editModalVisible"
    :data="state.editData"
    :parent-id="state.parentId"
    @confirm="onEditModalConfirm"
    @cancel="editModalVisible = false"
  ></ClassModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';
import { classList, delClass, dragClass } from '@/api/operation/sync-class';
import ClassModal from './components/class-modal.vue';

const state = reactive<{
  tableLoading: boolean;
  tableData: Record<string, any>[];
  oriTableData: Record<string, any>[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  parentId: number | null;
}>({
  tableLoading: false,
  tableData: [],
  oriTableData: [],
  editData: {},
  parentId: null,
});

const filterChange = (dataIndex: string, filteredValues: string[]) => {
  console.log(dataIndex);
  const f = filteredValues[0];
  if (typeof f === 'number') {
    console.log(f);
  } else {
    console.log('clear');
  }
};

const columns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    fixed: 'left',
  },
  {
    title: '分类ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 340,
    fixed: 'left',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    tooltip: true,
    width: 340,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
    width: 195,
  },
];

const editModalVisible = ref(false);

function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments');
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

function fetchData() {
  state.tableLoading = true;
  classList()
    .then((res: any) => {
      if (res.code === 200) {
        state.oriTableData = res.data;
        state.tableData = deepClone(state.oriTableData);
      }
    })
    .finally(() => {
      state.tableLoading = false;
    });
}

onMounted(() => {
  fetchData();
});

const changeOrder = (list: any[]) => {
  dragClass(list)
    .then((res) => {
      if (res.code === 200) {
        fetchData();
      } else {
        Message.error('移动失败');
        state.tableData = deepClone(state.oriTableData);
      }
    })
    .catch(() => {
      state.tableData = deepClone(state.oriTableData);
    });
};

const findChange = (leftList: any[], rightList: any[]): any[] => {
  for (let index = 0; index < leftList.length; index += 1) {
    const element1 = leftList[index];
    const element2 = rightList[index];
    if (element1.id !== element2.id) {
      return leftList.map((e) => e.id);
    }
    if (element1.children && element1.children.length > 0) {
      const cl = findChange(element1.children, element2.children);
      if (cl.length > 0) {
        return cl;
      }
    }
  }
  return [];
};

const handleChange = (_data: any) => {
  const list = findChange(_data, state.oriTableData);
  if (list.length > 0) {
    changeOrder(list);
  }
};

const editClass = (record: any) => {
  state.editData = record;
  state.parentId = null;
  editModalVisible.value = true;
};

// 新增编辑弹窗确定后的回调
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  fetchData();
};

// 删除接口
const doDelete = (id: any) => {
  delClass(id)
    .then((res) => {
      if (res.code === 200) {
        Message.success('删除成功');
        fetchData();
      }
    })
    .catch(() => {});
};

const childrenIsUse = (record: any) => {
  if (record.children) {
    for (const r of record.children) {
      if (r.isUse) {
        return true;
      }
    }
  }
  return false;
};

const deleteClass = (record: any) => {
  let desc = '该分类下已有商品，暂无法删除。';

  if (record.isUse || childrenIsUse(record)) {
    Modal.warning({
      title: desc,
      content: '',
      titleAlign: 'start',
      okText: '好的',
      hideCancel: true,
      okButtonProps: {
        status: 'normal',
      },
    });
    return;
  }

  desc = '确定删除该分类吗？';
  if (record.children && record.children.length > 0) {
    desc = '确定删除该分类及其所有子分类吗？';
  }

  Modal.warning({
    title: desc,
    titleAlign: 'start',
    content: '',
    okText: '删除',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      doDelete(record.id);
    },
  });
};

const addClass = (parentId: any) => {
  state.editData = {};
  state.parentId = parentId;
  editModalVisible.value = true;
};
</script>

<style lang="less" scoped>
.action-down {
  color: #e63f3f;
}

.tag-div {
  display: flex;
  flex-direction: row;
  gap: 4px 4px;
}

.operation {
  display: flex;
  justify-content: flex-end;
}
</style>
