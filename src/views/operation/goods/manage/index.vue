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
      :scroll="{ x: 1448 }"
      bordered
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @filter-change="filterChange"
      @sorter-change="sorterChanged"
    >
      <template #source="{ record }">
        <span
          v-if="record.source === PlatformEnum.SELF"
          class="circle blue"
        ></span>
        <span v-else class="circle light-blue"></span>
        {{ PlatformEnum[record.source] ?? '-' }}
      </template>
      <template #productTypeId="{ record }">
        {{
          `${record.productTypeParentName ?? '-'}/${
            record.productTypeName ?? '-'
          } `
        }}
      </template>
      <template #type="{ record }">
        {{ AppTypeEnum[record.type] ?? '-' }}
      </template>
      <template #deliveryType="{ record }">
        {{ SaleTypeEnum[record.deliveryType] ?? '-' }}
      </template>
      <template #status="{ record }">
        <span v-if="record.status === StatusEnum.YBH" class="circle red"></span>
        <span
          v-else-if="record.status === StatusEnum.WSJ"
          class="circle gray"
        ></span>
        <span
          v-else-if="record.status === StatusEnum.DSH"
          class="circle orange"
        ></span>
        <span v-else class="circle green"></span>
        {{ StatusEnum[record.status] ?? '-' }}
      </template>

      <template #operations="{ record }">
        <t-link class="action-list" @click="clickDetailBtn(record)">
          详情
        </t-link>
        <t-link class="action-list" @click="clickPreviewBtn(record)">
          预览
        </t-link>
        <t-link
          v-if="record.status === StatusEnum.DSH"
          class="action-list"
          @click="clickDetailBtn(record)"
        >
          审核
        </t-link>
        <t-link
          v-if="record.status === StatusEnum.YSJ"
          class="action-down action-list"
          @click="clickDownBtn(record)"
        >
          下架
        </t-link>
        <t-link
          v-if="
            record.status === StatusEnum.WSJ &&
            record.source === PlatformEnum.OTHER
          "
          class="action-list"
          @click="clickUpBtn(record)"
        >
          上架
        </t-link>
        <t-link
          v-if="
            record.status === StatusEnum.WSJ &&
            record.source === PlatformEnum.OTHER
          "
          class="action-list"
          @click="clickDeleteBtn(record)"
        >
          删除
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
import { Message, Modal } from '@tele-design/web-vue';
import {
  deleteGoods,
  downGoods,
  goodsList,
  upGoods,
} from '@/api/operation/goods';
import { classList } from '@/api/operation/sync-class';
import { useRouter } from 'vue-router';
import Detail from './components/goods-detail.vue';

const router = useRouter();

const defaultFormModel: Record<string, string | number | undefined> = {
  name: '',
};
const state = reactive<{
  tableLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
  detailData: Record<string, any>;
}>({
  tableLoading: false,
  formModel: { ...defaultFormModel },
  tableData: [],
  detailData: {},
});

// 平台
const PlatformEnum: { [name: string]: any } = {
  SELF: 0, // 本平台
  OTHER: 1, // 跨平台
  0: '本平台',
  1: '跨平台',
};

const PlatformList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '本平台',
    value: 0,
  },
  {
    text: '跨平台',
    value: 1,
  },
];

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
  0: 'SaaS',
  1: '独立部署',
};

const SaleTypeList = [
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

// 状态
const StatusEnum: { [name: string]: any } = {
  WSJ: 3,
  DSH: 0,
  YBH: 2,
  YSJ: 1,
  3: '未上架',
  0: '待审核',
  2: '已驳回',
  1: '已上架',
};

const StatusList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '未上架',
    value: 3,
  },
  {
    text: '待审核',
    value: 0,
  },
  {
    text: '已驳回',
    value: 2,
  },
  {
    text: '已上架',
    value: 1,
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
    title: '所属商家',
    dataIndex: 'companyName',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },

  {
    title: '来源平台',
    dataIndex: 'source',
    slotName: 'source',
    width: 120,
    filterable: {
      filters: PlatformList,
    },
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
    width: 102,
    filterable: {
      filters: SaleTypeList,
    },
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 120,
    filterable: {
      filters: StatusList,
    },
  },
  {
    title: '上架时间',
    dataIndex: 'upShelfTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
    width: 188,
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
    pageNum: current, // 从0开始
    pageSize,
    ...state.formModel,
  };

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

const sorterChanged = (_: any, direction: string) => {
  if (direction === 'descend') {
    state.formModel.upShelfTimeSort = 1;
  } else if (direction === 'ascend') {
    state.formModel.upShelfTimeSort = 0;
  } else {
    state.formModel.upShelfTimeSort = null;
  }
  onPageChange(1);
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
  clickSearchBtn();
};

// 编辑全屏展示成功
const onModalConfirm = () => {
  modalVisible.value = false;
  fetchData();
};

// 详情/审核
const clickDetailBtn = (record: Record<string, any>) => {
  state.detailData = record;
  modalVisible.value = true;
};

// 预览
const clickPreviewBtn = (record: Record<string, any>) => {
  // TODO 跳转预览页面
  const routeData = router.resolve({
    name: 'wowMallPreview',
    params: { id: record.id },
  });
  window.open(routeData?.href, '_blank');
};

// 下架操作
const doDown = (id: any) => {
  downGoods(id).then((res) => {
    if (res.code === 200) {
      Message.success('商品已下架');
      fetchData();
    }
  });
};
const clickDownBtn = (record: Record<string, any>) => {
  doDown;
  Modal.warning({
    title: '确定下架该商品吗？',
    titleAlign: 'start',
    content: '',
    okText: '下架商品',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      doDown(record.id);
    },
  });
};
// 上架
const clickUpBtn = (record: Record<string, any>) => {
  upGoods(record.id).then((res) => {
    if (res.code === 200) {
      Message.success('上架成功');
      fetchData();
    }
  });
};

// 删除操作
const doDelete = (id: any) => {
  deleteGoods(id).then((res) => {
    if (res.code === 200) {
      Message.success('删除成功');
      fetchData();
    }
  });
};

const clickDeleteBtn = (record: Record<string, any>) => {
  Modal.warning({
    title: '确定删除该商品吗？',
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

.action-list {
  margin-right: 10px;
}
</style>
