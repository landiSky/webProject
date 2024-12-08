<template>
  <t-page-header flex title="商品管理" :show-back="false">
    <t-row :wrap="false">
      <t-col flex="auto">
        <t-form :model="state.formModel">
          <t-row :gutter="12" justify="space-between">
            <t-col flex="70px">
              <t-button type="primary" @click="addGoods"> 新建商品 </t-button>
            </t-col>
            <t-col flex="200px">
              <t-form-item field="name" hide-label class="search-form">
                <t-input
                  v-model.trim="state.formModel.name"
                  placeholder="搜索商品名称"
                  allow-clear
                  @change="clickSearchBtn"
                >
                  <template #suffix>
                    <icon-search
                      style="cursor: pointer"
                      @click="clickSearchBtn"
                    ></icon-search>
                  </template>
                </t-input>
              </t-form-item>
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
      :scroll="{ x: 1448 }"
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
      <template #productTypeId="{ record }">
        {{ record.productTypeParentName }} / {{ record.productTypeName }}
      </template>
      <template #type="{ record }">
        {{ TypeEnum[record.type] }}
      </template>
      <template #deliveryType="{ record }">
        {{ DeliveryTypeEnum[record.deliveryType] || '-' }}
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
      <!-- 测试定价方式 -->
      <template #saleType="{ record }">
        {{
          (record.deliveryType === 2 || record.deliveryType === 3) &&
          record.saleType === 1
            ? '付费'
            : SaleTypeList[record.saleType] || '-'
        }}
      </template>
      <template #operations="{ record }">
        <t-link @click="clickDetailBtn(record)"> 详情 </t-link>
        <!-- <t-link
          v-if="record.status === StatusEnum.YSJ && record.tagStatus === 1"
          @click="certificateBtn(record)"
        >
          证书下载
        </t-link> -->
        <!-- <t-tooltip
          v-if="record.status !== StatusEnum.YSJ || record.tagStatus === 0"
          content="该商品未上架或未打标，无法证书下载"
          position="top"
        >
          <t-link disabled style="color: #86909c"> 证书下载 </t-link>
        </t-tooltip> -->
        <t-link
          v-if="record.status === StatusEnum.YSJ"
          class="action-down"
          @click="clickDownBtn(record)"
        >
          下架
        </t-link>
        <t-link
          v-if="record.status !== StatusEnum.YSJ"
          :style="{
            color: record.status === StatusEnum.WSJ ? '#1664FF' : '#C9CDD4',
          }"
          @click="clickUpBtn(record)"
        >
          上架
        </t-link>
        <t-dropdown position="br">
          <t-link>
            <icon-more />
          </t-link>
          <template #content>
            <!-- <t-doption @click="clickDetailBtn(record)">
              <template #icon>
                <icon-common />
              </template>
              详情
            </t-doption> -->
            <t-doption @click="clickEditBtn(record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </t-doption>
            <t-doption
              v-if="!record?.publicService"
              @click="clickDelBtn(record)"
            >
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
    @cancel="onModalConfirm"
    @edit="infoToEdit"
    @preview="onPreview"
  ></Detail>
  <Add
    v-if="addModalVisible"
    :data="state.detailData"
    @cancel="onAddModalConfirm"
    @preview="onPreview"
  ></Add>

  <div style="position: absolute; top: -999999px; z-index: -1; width: 732px">
    <Certificate
      v-if="certificateVisible"
      :data="certificateData"
      @cancel="onCertificate"
    ></Certificate>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message, Modal } from '@tele-design/web-vue';
import {
  goodsList,
  upGoods,
  downGoods,
  deleteGoods,
  preUp,
  fetchClassList,
  certDownload,
} from '@/api/goods-manage';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import noSearch from '@/assets/images/noSearch.png';
import noData from '@/assets/images/noData.png';

import Certificate from '@/components/certificate/index.vue';
import Detail from './components/goods-detail.vue';
import Add from './components/goods-add.vue';

const tableRef = ref();
const userStore = useUserStore();
const { userInfoByCompany, configInfo }: Record<string, any> =
  storeToRefs(userStore);

const defaultFormModel: Record<string, string | null> = {
  name: null,
  productTypeId: null,
  type: null,
  deliveryType: null,
  status: null,
};

const router = useRouter();
const route = useRoute();
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

const formModelIsEmpty = () => {
  return !(
    state.formModel.name ||
    state.formModel.productTypeId ||
    state.formModel.type ||
    state.formModel.deliveryType ||
    state.formModel.status
  );
};

// 应用分类
const TypeEnum: { [name: string]: any } = {
  PT: 0,
  BS: 1,
  0: '普通应用',
  1: '标识应用',
};

const typeList = [
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
  LightApp: 2, // 标识轻应用
  PluginClass: 3, // 插件
  0: 'SaaS',
  1: '独立部署',
  2: '标识轻应用',
  3: '插件',
};

const deliveryTypeList = computed(() => {
  const data = [
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
    {
      text: '插件',
      value: 3,
    },
  ];
  if (configInfo.value?.qingFlowSwitch) {
    const app = {
      text: '标识轻应用',
      value: 2,
    };
    data.splice(3, 0, app);
  }
  return data;
});

// 状态
const StatusEnum: { [name: string]: any } = {
  WSJ: 3,
  DSH: 0,
  YBH: 2,
  YSJ: 1,
  3: '未上架',
  0: '审核中',
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
    text: '审核中',
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

// 测试定价方式
const SaleTypeList: { [name: string]: any } = {
  0: '套餐定价',
  1: '一口价',
  2: '价格面议',
  3: '免费',
};
const PricingMethodList = [
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
  {
    text: '付费',
    value: 4,
  },
];

const classList = ref([
  {
    text: '全部',
    value: ' ',
  },
]);

const columns = [
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    width: 200,
    fixed: 'left',
  },
  {
    title: '商品ID',
    dataIndex: 'id',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '所属分类（一级、二级）',
    dataIndex: 'productTypeId',
    slotName: 'productTypeId',
    width: 180,
    filterable: {
      filters: classList,
    },
  },
  {
    title: '应用类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 160,
    filterable: {
      filters: typeList,
    },
  },
  {
    title: '交付方式',
    dataIndex: 'deliveryType',
    slotName: 'deliveryType',
    width: 160,
    filterable: {
      filters: deliveryTypeList,
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
  // 测试定价方式
  {
    title: '定价方式',
    dataIndex: 'saleType',
    slotName: 'saleType',
    width: 140,
    filterable: {
      filters: PricingMethodList,
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
  current: 1,
  pageSize: 10,
  total: 0,
});

// 分页，总页数不到10页，不显示分页器
const hideOnSinglePage = computed(() => pagination.total <= 10);

const modalVisible = ref(false); // 编辑全屏展示弹窗

const certificateVisible = ref(false);
const certificateData = ref({});

// 证书下载
const certificateBtn = (record: any) => {
  const params = {
    id: record.id,
  };
  certDownload(params)
    .then((res: any) => {
      if (res?.certificateNum) {
        certificateData.value = res;
        certificateVisible.value = true;
      } else {
        Modal.warning({
          title: '该商品未进行打标操作',
          content: '请联系运营人员进行IDInside打标后可进行下载',
          titleAlign: 'start',
          okText: '知道了',
          hideCancel: true,
          okButtonProps: {
            type: 'primary',
          },
        });
      }
    })
    .catch(() => {});
};
const onCertificate = () => {
  certificateVisible.value = false;
  certificateData.value = {};
};

function fetchData() {
  const { current, pageSize } = pagination;
  const companyId = String(userInfoByCompany.value?.companyId);
  const params = {
    pageNum: current,
    pageSize,
    companyId,
    ...state.formModel,
    saleType: state.formModel.saleType === 4 ? 1 : state.formModel.saleType,
  };
  state.tableLoading = true;
  goodsList(params)
    .then((res: any) => {
      state.tableData = res.records;
      pagination.total = res.total;
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

const filterChange = (dataIndex: string, filteredValues: string[]) => {
  const f = filteredValues[0];
  if (typeof f === 'boolean') {
    state.formModel[`${dataIndex}`] = null;
  } else {
    state.formModel[`${dataIndex}`] = f;
  }
  onPageChange(1);
};

// 详情/审核
const clickDetailBtn = async (record: any) => {
  state.detailData = record;
  modalVisible.value = true;
};

const infoToEdit = () => {
  router.push({ name: 'sellerGoods' });
  modalVisible.value = false;
  addModalVisible.value = true;
};

const onModalConfirm = () => {
  router.push({ name: 'sellerGoods' });
  modalVisible.value = false;
  fetchData();
};

// 下架
const doDown = (id: any) => {
  downGoods(id).then(() => {
    Message.success('商品已下架');
    fetchData();
  });
};

// 下架
const clickDownBtn = (record: any) => {
  Modal.warning({
    title: '确定下架该商品吗？',
    titleAlign: 'start',
    content: '下架后本商品将同步从标识网络其他平台下架。',
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

const addGoods = () => {
  state.detailData = {};
  addModalVisible.value = true;
};
const doEdit = (record: any) => {
  state.detailData = record;
  addModalVisible.value = true;
};

const doUp = (id: any) => {
  upGoods(id).then(() => {
    Message.success('上架成功');
    fetchData();
  });
};
// 上架
const clickUpBtn = async (record: any) => {
  if (record.status !== StatusEnum.WSJ) {
    return;
  }
  const r = await preUp(record.id);
  if (r) {
    Modal.warning({
      title: '确定上架该商品吗？',
      titleAlign: 'start',
      content: '商品通过上架审核后，将同时在本平台和标识网络其他平台同步上架。',
      okText: '上架商品',
      hideCancel: false,
      onOk: () => {
        doUp(record.id);
      },
    });
  } else {
    Modal.warning({
      title: '商品信息未完善，请先完善商品信息',
      titleAlign: 'start',
      content: '',
      okText: '完善商品信息',
      hideCancel: false,
      onOk: () => {
        doEdit(record);
      },
    });
  }
};

const clickEditBtn = (record: any) => {
  if (record.status === StatusEnum.YSJ) {
    Modal.warning({
      title: '该商品已上架，暂无法编辑。',
      titleAlign: 'start',
      content: '',
      okText: '好的',
      hideCancel: true,
    });
    return;
  }
  if (record.status === StatusEnum.DSH) {
    Modal.warning({
      title: '该商品正在审核中，暂无法编辑。',
      titleAlign: 'start',
      content: '',
      okText: '好的',
      hideCancel: true,
    });
    return;
  }
  doEdit(record);
};

// 删除操作
const doDelete = (id: any) => {
  deleteGoods(id).then(() => {
    Message.success('删除成功');
    fetchData();
  });
  // mock数据
};
const clickDelBtn = (record: any) => {
  if (record.status === StatusEnum.YSJ) {
    Modal.warning({
      title: '该商品已上架，暂无法删除。',
      titleAlign: 'start',
      content: '',
      okText: '好的',
      hideCancel: true,
    });
    return;
  }
  if (record.status === StatusEnum.DSH) {
    Modal.warning({
      title: '该商品正在审核中，暂无法删除。',
      titleAlign: 'start',
      content: '',
      okText: '好的',
      hideCancel: true,
    });
    return;
  }

  Modal.warning({
    title: '确定删除该商品吗？',
    titleAlign: 'start',
    content: '',
    okText: '删除商品',
    hideCancel: false,
    okButtonProps: {
      status: 'danger',
    },
    onOk: () => {
      doDelete(record.id);
    },
  });
};

// 跳转到前台商品详情页
const onPreview = (productId: string) => {
  const routeData = router.resolve({
    name: 'wowMallPreview',
    params: { id: productId },
  });
  window.open(routeData?.href, '_blank');
};

watch(
  () => route.query.goodsDetailID,
  (newV) => {
    if (newV) {
      clickDetailBtn({ id: newV });
    }
  },
  {
    immediate: true,
  }
);

const reBuildClassList = (data: any[]) => {
  classList.value = [
    {
      text: '全部',
      value: ' ',
    },
  ];
  for (const fc of data) {
    const fn = fc.name;
    for (const sc of fc.children) {
      const sn = sc.name;
      const value = sc.id;
      classList.value.push({ text: `${fn}/${sn}`, value });
    }
  }
};

const getClassList = () => {
  fetchClassList().then((res: any) => {
    if (res) {
      reBuildClassList(res);
    }
  });
};

onMounted(() => {
  getClassList();
  fetchData();
});

const onAddModalConfirm = () => {
  addModalVisible.value = false;
  fetchData();
};
</script>

<style lang="less" scoped>
.action-down {
  color: #e63f3f;
}

.search-form {
  margin-bottom: 16px;
}

.nodata {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
</style>
