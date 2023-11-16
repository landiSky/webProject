<template>
  <t-page-header flex title="商品管理" :show-back="false">
    <t-row :wrap="false">
      <t-col flex="auto">
        <t-form :model="state.formModel">
          <t-row :gutter="12" justify="start">
            <t-col flex="240px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model.trim="state.formModel.name"
                  placeholder="请输入商品名称"
                  allow-clear
                  @change="clickSearchBtn"
                />
              </t-form-item>
            </t-col>
            <t-col flex="240px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model.trim="state.formModel.companyName"
                  placeholder="请输入商家名称"
                  allow-clear
                  @change="clickSearchBtn"
                />
              </t-form-item>
            </t-col>
            <t-col flex="70px">
              <t-button type="primary" @click="clickSearchBtn"> 查询 </t-button>
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
      :scroll="{ x: 1800 }"
      bordered
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @filter-change="filterChange"
    >
      <template #tag="{ record }">
        <div class="tag-div">
          <div v-if="record.tag">
            <t-tag v-for="t in record.tag" :key="t"> {{ t }}</t-tag>
          </div>
          <div v-else>-</div>
        </div>
      </template>
      <template #productTypeId="{ record }">
        {{ `${record.productTypeParentName}/${record.productTypeName}` }}
      </template>
      <template #type="{ record }">
        {{ AppTypeEnum[record.type] }}
      </template>
      <template #deliveryType="{ record }">
        {{ SaleTypeEnum[record.deliveryType] }}
      </template>
      <template #status="{ record }">
        <span v-if="record.status === StatusEnum.WTB" class="circle red"></span>
        <span v-else class="circle green"></span>
        {{ StatusEnum[record.status] }}
      </template>

      <template #operations="{ record }">
        <t-link @click="clickDetailBtn(record)"> 详情 </t-link>
        <t-link @click="Message.warning('敬请期待')"> 打标 </t-link>
        <t-link v-if="record.status === StatusEnum.WTB" @click="start(record)">
          开启同步
        </t-link>
        <t-link v-else class="action-down" @click="stop(record)">
          停止同步
        </t-link>
      </template>
    </t-table>
  </t-page-header>

  <Detail
    v-if="modalVisible"
    :data="state.detailData"
    @confirm="onModalConfirm"
    @cancel="onModalConfirm"
  ></Detail>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';
import {
  goodsList,
  startSync,
  stopSync,
  classList,
} from '@/api/operation/sync-class';
import Detail from './components/goods-detail.vue';

const defaultFormModel: Record<string, string | number | undefined> = {
  name: '',
  companyName: '',
};

const state = reactive<{
  tableLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
}>({
  tableLoading: false,
  formModel: { ...defaultFormModel },
  tableData: [],
  editData: {},
  detailData: {},
});

const TypeList = ref([
  {
    text: '全部',
    value: null,
  },
]);

// 应用分类
const AppTypeEnum: { [name: string]: any } = {
  PT: 0,
  BS: 1,
  0: '普通应用',
  1: '标识应用',
};

const AppTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '普通应用',
    value: 0,
  },
  {
    text: '标识应用',
    value: 1,
  },
];

// 交付方式
const SaleTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SAAS',
  1: '独立部署',
};

const SaleTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: 'SAAS',
    value: 0,
  },
  {
    text: '独立部署',
    value: 1,
  },
];

// 状态
const StatusEnum: { [name: string]: any } = {
  WTB: 0,
  TBZ: 1,
  0: '未同步',
  1: '同步中',
};

const StatusList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '未同步',
    value: 0,
  },
  {
    text: '同步中',
    value: 1,
  },
];

const PrefixList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '88.111',
    value: '88.111',
  },
  {
    text: '88.112',
    value: '88.112',
  },
];

const columns = [
  {
    title: '商品ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 160,
    fixed: 'left',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    width: 160,
    fixed: 'left',
  },
  {
    title: '商品标签',
    dataIndex: 'tag',
    slotName: 'tag',
    width: 270,
  },

  {
    title: '所属分类',
    dataIndex: 'productTypeId',
    slotName: 'productTypeId',
    width: 160,
    filterable: {
      filters: TypeList,
    },
  },
  {
    title: '同步状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
    filterable: {
      filters: StatusList,
    },
  },
  {
    title: '所属平台前缀',
    dataIndex: 'platformPrefix',
    width: 126,
    filterable: {
      filters: PrefixList,
    },
  },
  {
    title: '应用类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 120,
    filterable: {
      filters: AppTypeList,
    },
  },
  {
    title: '交付方式',
    dataIndex: 'deliveryType',
    slotName: 'deliveryType',
    width: 120,
    filterable: {
      filters: SaleTypeList,
    },
  },
  {
    title: '所属商家',
    dataIndex: 'companyName',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '平台运营机构',
    dataIndex: 'platformOperationCompany',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
    width: 180,
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

const modalVisible = ref(false); // 编辑全屏展示弹窗

function fetchData() {
  const { current, pageSize } = pagination;
  const params = {
    pageNum: current,
    pageSize,
    type: 0,
    ...state.formModel,
  };

  // 接口请求
  state.tableLoading = true;
  goodsList(params)
    .then((res: any) => {
      if (res.code === 200) {
        state.tableData = res.data.records;
        pagination.total = res.data.total;
      }
    })
    .finally(() => {
      state.tableLoading = false;
    });
}

const filterChange = (dataIndex: string, filteredValues: string[]) => {
  const f = filteredValues[0];
  if (typeof f === 'boolean') {
    state.formModel[`${dataIndex}`] = null;
  } else {
    state.formModel[`${dataIndex}`] = f;
  }
};

// 每页显示条数发生变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchData();
};

// 页码发生变化
const onPageChange = (current: number) => {
  pagination.current = current;
  fetchData();
};

const clickSearchBtn = () => {
  onPageChange(1);
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  state.formModel = { ...defaultFormModel };
  clickSearchBtn();
};

// 编辑全屏展示成功
const onModalConfirm = () => {
  modalVisible.value = false;
  fetchData();
};

const doStop = (id: any) => {
  stopSync(id).then((res) => {
    if (res.code === 200) {
      Message.success('同步已停止');
      fetchData();
    }
  });
};
// 停止
const stop = (record: any) => {
  Modal.warning({
    title: '确定停止同步该商品吗？',
    titleAlign: 'start',
    content: '停止同步后，该商品从标识网络的订阅商品中移除。',
    okText: '停止同步',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      doStop(record.id);
    },
  });
};

const doStart = (id: any) => {
  startSync(id).then((res) => {
    if (res.code === 200) {
      Message.success('同步已开启');
      fetchData();
    }
  });
};
// 开启同步
const start = (record: any) => {
  Modal.warning({
    title: '确定开启同步该商品吗？',
    titleAlign: 'start',
    content: '开启同步后，该商品将展示在标识网络订阅商品中。',
    okText: '开启同步',
    hideCancel: false,
    onOk: () => {
      doStart(record.id);
    },
  });
};

// 详情/审核
const clickDetailBtn = (record: Record<string, any>) => {
  state.detailData = record;
  modalVisible.value = true;
};

const reBuildClassList = (data: any[]) => {
  TypeList.value = [
    {
      text: '全部',
      value: null,
    },
  ];
  for (const fc of data) {
    const fn = fc.name;
    for (const sc of fc.children) {
      const sn = sc.name;
      const value = sc.id;
      TypeList.value.push({ text: `${fn}/${sn}`, value });
    }
  }
};

const fetchClassList = () => {
  classList().then((res) => {
    if (res.code === 200 && res.data) {
      reBuildClassList(res.data);
    }
  });
};
onMounted(() => {
  fetchClassList();
  fetchData();
});
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
</style>
