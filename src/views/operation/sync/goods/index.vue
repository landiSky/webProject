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
                  max-length="20"
                  allow-clear
                  @change="clickSearchBtn"
                />
              </t-form-item>
            </t-col>
            <t-col flex="240px">
              <t-form-item field="companyName" hide-label>
                <t-input
                  v-model.trim="state.formModel.companyName"
                  placeholder="请输入商家名称"
                  max-length="20"
                  allow-clear
                  @change="clickSearchBtn"
                />
              </t-form-item>
            </t-col>
            <t-col flex="240px">
              <t-form-item field="platformPrefix" hide-label>
                <t-input
                  v-model.trim="state.formModel.platformPrefix"
                  placeholder="请输入所属平台前缀"
                  max-length="20"
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
      ref="tableRef"
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
      <template #empty>
        <div
          v-if="formModelIsEmpty()"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 140px;
            margin-top: 160px;
          "
        >
          <div>
            <img :src="noData" alt="" />
            <div class="nodata">暂无数据</div>
          </div>
        </div>
        <div
          v-else
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 140px;
            margin-top: 160px;
          "
        >
          <img :src="noSearch" alt="" />
          <div class="nodata">
            暂无查询结果
            <t-link @click="handleReset">清空查询项</t-link>
          </div>
        </div>
      </template>
      <template #tag="{ record }">
        <div class="tag-div">
          <div
            v-for="(item, index) in record?.tagMap"
            :key="index"
            class="product-labels"
          >
            <t-typography-paragraph
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
            >
              {{ item.tagName }}
            </t-typography-paragraph>
          </div>
          <div v-if="!record?.tagMap?.length">-</div>
        </div>
      </template>
      <template #productTypeId="{ record }">
        {{
          `${record.productTypeParentName ?? '-'}/${
            record.productTypeName ?? '-'
          }`
        }}
      </template>
      <template #type="{ record }">
        {{ AppTypeEnum[record.type] ?? '-' }}
      </template>
      <template #deliveryType="{ record }">
        {{ DeliveryTypeEnum[record.deliveryType] ?? '-' }}
      </template>
      <template #saleType="{ record }">
        {{ SaleTypeEnum[record.saleType] ?? '-' }}
      </template>
      <template #status="{ record }">
        <span v-if="record.status === StatusEnum.WTB" class="circle red"></span>
        <span v-else class="circle green"></span>
        {{ StatusEnum[record.status] ?? '-' }}
      </template>

      <template #operations="{ record }">
        <t-link @click="clickDetailBtn(record)"> 详情 </t-link>
        <t-link @click="handleLabel(record)"> 打标 </t-link>
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

  <Label
    v-if="labelVisible"
    :label-visible="labelVisible"
    :confirm-loading="state.confirmLoading"
    :record-data="recordData"
    @on-confirm="handleLabelConfirm"
    @on-cancel="handleLabelCancel"
  />
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
import { comfirmLabel } from '@/api/inventory/fetchLabel';
import noSearch from '@/assets/images/noSearch.png';
import noData from '@/assets/images/noData.png';
import Detail from './components/goods-detail.vue';
import Label from './components/label.vue';

const tableRef = ref();
const recordData = ref();
const defaultFormModel: Record<string, string | number | undefined> = {
  name: '',
  companyName: '',
  platformPrefix: '',
  productTypeId: undefined,
  type: undefined,
  deliveryType: undefined,
  status: undefined,
};

const state = reactive<{
  tableLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
  editData: Record<string, any> | undefined; // 要编辑的数据
  detailData: Record<string, any>; // 详情数据，如果是从列表获取，同editData字段，如果是从接口获取，请完善接口逻辑
  confirmLoading: boolean;
}>({
  tableLoading: false,
  formModel: { ...defaultFormModel },
  tableData: [],
  editData: {},
  detailData: {},
  confirmLoading: false,
});

const formModelIsEmpty = () => {
  return !(
    state.formModel.name ||
    state.formModel.source ||
    state.formModel.productTypeId ||
    state.formModel.type ||
    state.formModel.deliveryType ||
    state.formModel.status ||
    state.formModel.upShelfTime
  );
};
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
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SaaS',
  1: '独立部署',
};

const DeliveryTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: 'SaaS',
    value: 0,
  },
  {
    text: '独立部署',
    value: 1,
  },
];

// 定价方式
const SaleTypeEnum: { [name: string]: any } = {
  0: '套餐定价',
  1: '一口价',
  2: '价格面议',
  3: '免费',
};

const SaleTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '套餐定价',
    value: 0,
  },
  {
    text: '一口价',
    value: 1,
  },
  {
    text: '价格面议',
    value: 2,
  },
  {
    text: '免费',
    value: 3,
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

const columns = [
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
    dataIndex: 'tagMap',
    slotName: 'tag',
    width: 270,
  },

  {
    title: '所属分类',
    dataIndex: 'productTypeId',
    slotName: 'productTypeId',
    width: 200,
    ellipsis: true,
    tooltip: true,
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
      filters: DeliveryTypeList,
    },
  },
  {
    title: '定价方式',
    dataIndex: 'saleType',
    slotName: 'saleType',
    width: 120,
    filterable: {
      filters: SaleTypeList,
    },
  },
  {
    title: '商品ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 160,
    // fixed: 'left',
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

const labelVisible = ref(false);

function fetchData() {
  const { current, pageSize } = pagination;
  const params = {
    pageNum: current,
    pageSize,
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

// 打标
const handleLabel = (record: any) => {
  recordData.value = record;
  labelVisible.value = true;
};

const handleLabelConfirm = (data = [], productId = '') => {
  state.confirmLoading = true;

  // if (data.length === 0) {
  //   state.confirmLoading = false;
  //   return Message.warning('未选择标签');
  // }
  return comfirmLabel({
    productId,
    tagIdList: data,
  })
    .then(() => {
      state.confirmLoading = false;
      Message.success('打标成功');
      labelVisible.value = false;
      fetchData();
    })
    .catch((e) => {
      state.confirmLoading = false;
      Message.error(e.message);
    });
};

const handleLabelCancel = () => {
  labelVisible.value = false;
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

const filterChange = (dataIndex: string, filteredValues: string[]) => {
  const f = filteredValues[0];
  if (typeof f === 'boolean') {
    state.formModel[`${dataIndex}`] = null;
  } else {
    state.formModel[`${dataIndex}`] = f;
  }
  onPageChange(1);
};

const clickSearchBtn = () => {
  onPageChange(1);
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  state.formModel = { ...defaultFormModel };
  tableRef.value?.clearFilters();
  tableRef.value?.clearSorters();
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

  .product-labels {
    display: inline-block;
    width: 72px;
    height: 20px;
    margin-left: 8px;
    padding: 0 8px;
    color: rgba(29, 33, 41, 1);
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 20px;
    text-align: center;
    background: rgba(242, 243, 248, 1);
    border-radius: 2px 0 0 0;
  }

  .product-labels:first-child {
    margin-left: 0;
  }
}

:deep(.tele-form-item) {
  margin-bottom: 16px;
}

.nodata {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

:deep(.tele-typography) {
  margin-bottom: 0;
}
</style>
