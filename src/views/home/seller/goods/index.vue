<template>
  <t-page-header flex title="商品管理" :show-back="false">
    <t-row :wrap="false">
      <t-col flex="auto">
        <t-form :model="state.formModel">
          <t-row :gutter="12" justify="space-between">
            <t-col flex="70px">
              <t-button type="primary" @click="addModalVisible = true">
                新建商品
              </t-button>
            </t-col>
            <t-col flex="200px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model="state.formModel.name"
                  placeholder="搜索商品名称"
                  allow-clear
                />
              </t-form-item>
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
    >
      <template #platform="{ record }">
        <span
          v-if="record.platform === PlatformEnum.SELF"
          class="circle blue"
        ></span>
        <span v-else class="circle light-blue"></span>
        {{ PlatformEnum[record.platform] }}
      </template>
      <template #type="{ record }">
        {{ TypeEnum[record.type] }}
      </template>
      <template #appType="{ record }">
        {{ AppTypeEnum[record.appType] }}
      </template>
      <template #saleType="{ record }">
        {{ SaleTypeEnum[record.saleType] }}
      </template>
      <template #status="{ record }">
        <span
          v-if="record.status === StatusEnum.YBH"
          class="circle danger"
        ></span>
        <span
          v-else-if="record.status === StatusEnum.WSJ"
          class="circle gray"
        ></span>
        <span
          v-else-if="record.status === StatusEnum.DSH"
          class="circle orange"
        ></span>
        <span v-else class="circle green"></span>
        {{ StatusEnum[record.status] }}
      </template>

      <template #operations="{ record }">
        <t-link @click="clickDetailBtn(record)"> 详情 </t-link>
        <t-link class="action-down" @click="clickDownBtn(record)">
          下架
        </t-link>
        <t-link
          v-if="record.status === StatusEnum.WSJ"
          @click="clickUpBtn(record)"
        >
          上架
        </t-link>
        <t-dropdown position="bl">
          <t-link>
            <icon-more />
          </t-link>
          <template #content>
            <t-doption @click="clickEditBtn(record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </t-doption>
            <t-doption @click="clickDelBtn(record)">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </t-doption>
          </template>
        </t-dropdown>
      </template>
    </t-table>
  </t-page-header>
  <Detail
    v-if="modalVisible"
    :data="state.detailData"
    @confirm="onModalConfirm"
    @cancel="modalVisible = false"
  ></Detail>
  <Add
    v-if="addModalVisible"
    @confirm="onAddModalConfirm"
    @cancel="addModalVisible = false"
  ></Add>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import Detail from './components/goods-detail.vue';
import Add from './components/goods-add.vue';

const defaultFormModel: Record<string, string | number | undefined> = {
  name: undefined,
};

const addModalVisible = ref(false);

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

const filterChange = (dataIndex: string, filteredValues: string[]) => {
  console.log(dataIndex);
  const f = filteredValues[0];
  if (typeof f === 'number') {
    console.log(f);
  } else {
    console.log('clear');
  }
};

// 平台
const PlatformEnum: { [name: string]: any } = {
  SELF: 1, // 本平台
  OTHER: 2, // 跨平台
  1: '本平台',
  2: '跨平台',
};

const PlatformList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '本平台',
    value: 1,
  },
  {
    text: '跨平台',
    value: 2,
  },
];

// 分类
const TypeEnum: { [name: string]: any } = {
  RJPT: 1,
  SJGLZ: 2,
  1: '软件/平台',
  2: '数据管理者',
};

const TypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '软件/平台',
    value: 1,
  },
  {
    text: '数据管理者',
    value: 2,
  },
];

// 应用分类
const AppTypeEnum: { [name: string]: any } = {
  PT: 1,
  BS: 2,
  1: '普通应用',
  2: '标识应用',
};

const AppTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '普通应用',
    value: 1,
  },
  {
    text: '标识应用',
    value: 2,
  },
];

// 交付方式
const SaleTypeEnum: { [name: string]: any } = {
  SAAS: 1,
  DLBS: 2,
  1: 'SAAS',
  2: '独立部署',
};

const SaleTypeList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: 'SAAS',
    value: 1,
  },
  {
    text: '独立部署',
    value: 2,
  },
];

// 状态
const StatusEnum: { [name: string]: any } = {
  WSJ: 0,
  DSH: 1,
  YBH: 2,
  YSJ: 3,
  0: '未上架',
  1: '待审核',
  2: '已驳回',
  3: '已上架',
};

const StatusList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '未上架',
    value: 0,
  },
  {
    text: '待审核',
    value: 1,
  },
  {
    text: '已驳回',
    value: 2,
  },
  {
    text: '已上架',
    value: 3,
  },
];
const columns = [
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    ellipsis: true,
    tooltip: true,
    width: 200,
    fixed: 'left',
  },
  {
    title: '商品ID',
    dataIndex: 'goodsId',
    ellipsis: true,
    tooltip: true,
    width: 200,
    fixed: 'left',
  },
  {
    title: '所属分类（一级、二级）',
    dataIndex: 'type',
    slotName: 'type',
    width: 180,
    filterable: {
      filters: TypeList,
    },
  },
  {
    title: '应用类型',
    dataIndex: 'appType',
    slotName: 'appType',
    width: 160,
    filterable: {
      filters: AppTypeList,
    },
  },
  {
    title: '交付方式',
    dataIndex: 'saleType',
    slotName: 'saleType',
    width: 160,
    filterable: {
      filters: SaleTypeList,
    },
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 140,
    filterable: {
      filters: StatusList,
    },
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
    width: 160,
  },
];

const pagination = reactive<{
  current: number; // 当前页码
  pageSize: number;
  total: number;
}>({
  current: 0,
  pageSize: 10,
  total: 0,
});

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const modalVisible = ref(false); // 编辑全屏展示弹窗

function fetchData() {
  const { current, pageSize } = pagination;
  const params = {
    page: current - 1, // 从0开始
    size: pageSize,
    ...state.formModel,
  };

  state.tableLoading = true;
  // TODO 接口请求
  // roleList(params)
  //   .then((data: any) => {
  //     state.tableData = data.content;
  //     pagination.page = data.pageNumber;
  //     pagination.total = data.totalCount;
  //   })
  //   .finally(() => {
  //     state.tableLoading = false;
  //   });
  // mock数据
  const data = {
    content: [
      {
        id: 1,
        goodsId: 1,
        goodsName: '商品1',
        saler: '商家1',
        platform: 1,
        type: 1,
        appType: 1,
        saleType: 1,
        status: 0,
        createdTime: '2022-12-07 20:29',
      },
      {
        id: 2,
        goodsId: 2,
        goodsName: '商品2',
        saler: '商家2',
        platform: 1,
        type: 1,
        appType: 1,
        saleType: 1,
        status: 1,
        createdTime: '2022-12-07 20:29',
      },
      {
        id: 3,
        goodsId: 3,
        goodsName: '商品3',
        saler: '商家3',
        platform: 2,
        type: 2,
        appType: 2,
        saleType: 2,
        status: 2,
        createdTime: '2022-12-07 20:29',
      },
      {
        id: 4,
        goodsId: 4,
        goodsName: '商品4',
        saler: '商家4',
        platform: 2,
        type: 2,
        appType: 2,
        saleType: 2,
        status: 3,
        createdTime: '2022-12-07 20:29',
      },
    ],
    pageNumber: 1,
    totalCount: 11,
  };

  state.tableData = data.content || [];
  pagination.total = data.totalCount;
  state.tableLoading = false;
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

const clickSearchBtn = () => {
  onPageChange(1);
};

// 重置后，触发一次查询
const handleReset = () => {
  // 如果都没有默认项，可以使用state.formModel.resetFields()函数
  state.formModel = { ...defaultFormModel };
  clickSearchBtn();
};

// 详情/审核
const clickDetailBtn = (record: Record<string, any>) => {
  state.detailData = record;
  modalVisible.value = true;
};

// 编辑全屏展示成功
const onModalConfirm = () => {
  modalVisible.value = false;
  fetchData();
};

// 下架
const clickDownBtn = (record: any) => {};

// 下架
const doDown = (id: any) => {
  // TODO 调后端接口
  // deleteIdentify(deleteId.value)
  //   .then(() => {
  //     done(true);
  //     Message.success('删除成功!');
  //     refresh();
  //   })
  //   .catch(() => {
  //     done(false);
  //   });
  // mock数据
  Message.success('商品已下架');
  fetchData();
};

// 上架
const clickUpBtn = (record: Record<string, any>) => {
  // TODO API
};

const clickEditBtn = (record: any) => {};
const clickDelBtn = (record: any) => {};

// 删除操作
const doDelete = (id: any) => {
  // TODO 调后端接口
  // deleteIdentify(deleteId.value)
  //   .then(() => {
  //     done(true);
  //     Message.success('删除成功!');
  //     refresh();
  //   })
  //   .catch(() => {
  //     done(false);
  //   });
  // mock数据
  Message.success('商品已删除');
  fetchData();
};

onMounted(() => {
  fetchData();
});

const onAddModalConfirm = () => {};
</script>

<style lang="less" scoped>
.action-down {
  color: #e63f3f;
}
</style>
