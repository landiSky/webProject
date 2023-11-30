<template>
  <t-page-header
    class="authentication_manage"
    flex
    title="认证管理"
    :show-back="false"
  >
    <t-row :wrap="false">
      <t-col flex="auto">
        <t-form :model="state.formModel">
          <t-row :gutter="12" justify="start">
            <t-col flex="240px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model.trim="state.formModel.phone"
                  placeholder="请输入企业主账号"
                  max-length="20"
                  allow-clear
                  @change="clickSearchBtn"
                />
              </t-form-item>
            </t-col>
            <t-col flex="240px">
              <t-form-item field="name" hide-label>
                <t-input
                  v-model.trim="state.formModel.companyName"
                  placeholder="请输入企业名称"
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
      bordered
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @filter-change="filterChange"
      @sorter-change="sorterChanged"
    >
      <template #empty>
        <div
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
      <template #userPhone="{ record }">
        {{ record.phone || record.userPhone || '-' }}
      </template>
      <template #entStatus="{ record }">
        <span
          v-if="record.companyStatus === EntStatusEnum.YBH"
          class="circle red"
        ></span>
        <span
          v-else-if="record.companyStatus === EntStatusEnum.WRZ"
          class="circle gray"
        ></span>
        <span
          v-else-if="record.companyStatus === EntStatusEnum.DSH"
          class="circle orange"
        ></span>
        <span v-else class="circle green"></span>
        {{ EntStatusEnum[record.companyStatus] }}
        <span
          v-if="record.companyStatus === EntStatusEnum.DSH"
          class="action"
          @click="showDetail(record, EntTypeEnum.ENT, ActionTypeEnum.VERIFY)"
          >去审核</span
        >
        <span v-else-if="record.companyStatus === EntStatusEnum.WRZ"></span>
        <span
          v-else
          class="action"
          @click="showDetail(record, EntTypeEnum.ENT, ActionTypeEnum.DETAIL)"
          >详情</span
        >
      </template>
      <template #entPointStatus="{ record }">
        <span
          v-if="record.nodeStatus === EntStatusEnum.YBH"
          class="circle red"
        ></span>
        <span
          v-else-if="record.nodeStatus === EntStatusEnum.WRZ"
          class="circle gray"
        ></span>
        <span
          v-else-if="record.nodeStatus === EntStatusEnum.DSH"
          class="circle orange"
        ></span>
        <span v-else class="circle green"></span>
        {{ EntStatusEnum[record.nodeStatus] }}
        <span
          v-if="record.nodeStatus === EntStatusEnum.DSH"
          class="action"
          @click="
            showDetail(record, EntTypeEnum.ENTPOINT, ActionTypeEnum.VERIFY)
          "
          >去审核</span
        >
        <span v-else-if="record.nodeStatus === EntStatusEnum.WRZ"></span>
        <span
          v-else
          class="action"
          @click="
            showDetail(record, EntTypeEnum.ENTPOINT, ActionTypeEnum.DETAIL)
          "
          >详情</span
        >
      </template>
    </t-table>
  </t-page-header>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue';
import { verifyList, getCreditCodeByCompany } from '@/api/operation/user';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import noSearch from '@/assets/images/noSearch.png';

const tableRef = ref();
const router = useRouter();
const userStore = useUserStore();

// 状态
const EntStatusEnum: { [name: string]: any } = {
  WRZ: 3,
  DSH: 0,
  YBH: 2,
  YRZ: 1,
  3: '未认证',
  0: '待审核',
  2: '已驳回',
  1: '已认证',
};

const EntStatusList = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '未认证',
    value: 3,
  },
  {
    text: '待审核',
    value: 0,
  },
  {
    text: '已认证',
    value: 1,
  },
  {
    text: '已驳回',
    value: 2,
  },
];

const EntTypeEnum: { [name: string]: any } = {
  ENT: 0, // 企业
  ENTPOINT: 1, // 企业节点
};

const ActionTypeEnum: { [name: string]: any } = {
  DETAIL: 0, // 详情
  VERIFY: 1, // 审核
};

const defaultFormModel: Record<string, any> = {
  phone: '',
  companyName: '',
  product: null,
  member: null,
  companyStatus: null,
  nodeStatus: null,
};

const state = reactive<{
  tableLoading: boolean;
  formModel: Record<string, any>;
  tableData: Record<string, any>[];
}>({
  tableLoading: false,
  formModel: { ...defaultFormModel },
  tableData: [],
});

const columns = [
  {
    title: '企业主账号',
    dataIndex: 'phone',
    slotName: 'userPhone',
    ellipsis: true,
    tooltip: true,
    width: 170,
    fixed: 'left',
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    ellipsis: true,
    tooltip: true,
    width: 250,
    fixed: 'left',
  },
  {
    title: '企业账号数',
    dataIndex: 'memberCount',
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    width: 170,
  },

  {
    title: '发布商品数',
    dataIndex: 'productCount',
    ellipsis: true,
    tooltip: true,
    width: 170,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: '企业认证状态',
    dataIndex: 'companyStatus',
    ellipsis: true,
    tooltip: true,
    slotName: 'entStatus',
    width: 220,
    filterable: {
      filters: EntStatusList,
    },
  },
  {
    title: '企业节点认证状态',
    dataIndex: 'nodeStatus',
    ellipsis: true,
    tooltip: true,
    slotName: 'entPointStatus',
    width: 220,
    filterable: {
      filters: EntStatusList,
    },
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

function fetchData() {
  const { current, pageSize } = pagination;
  const params = {
    pageNum: current, // 从0开始
    pageSize,
    ...state.formModel,
  };
  // 接口请求
  state.tableLoading = true;
  verifyList(params)
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

const showDetail = (
  record: Record<string, string>,
  entType: number,
  actionType: number
) => {
  if (entType === EntTypeEnum.ENTPOINT) {
    const { snmsUrls } = userStore.userInfo || {};

    getCreditCodeByCompany(record.companyId).then((creditCode) => {
      console.log('index.vue:330', creditCode);
      window.open(`${snmsUrls.auditNode}&orgCrtCode=${creditCode}`, '_blank'); // 跳转到二级的企业节点审核页面
    });

    return;
  }
  router
    .push({
      name: 'verify-detail',
      query: {
        id: record.companyId ?? 0,
      },
    })
    .then(() => {
      fetchData();
    });
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

const sorterChanged = (dataIndex: string, direction: string) => {
  if (direction === 'descend') {
    if (dataIndex === 'memberCount') {
      state.formModel.member = 0;
    } else {
      state.formModel.product = 0;
    }
  } else if (direction === 'ascend') {
    if (dataIndex === 'memberCount') {
      state.formModel.member = 1;
    } else {
      state.formModel.product = 1;
    }
  } else if (dataIndex === 'memberCount') {
    state.formModel.member = null;
  } else {
    state.formModel.product = null;
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
  state.formModel = { ...defaultFormModel };
  tableRef.value?.clearFilters();
  tableRef.value?.clearSorters();
  clickSearchBtn();
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.action {
  margin-left: 8px;
  color: #1664ff;
  font-weight: 400;
  font-size: 12px;
  font-family: PingFang SC;
  font-style: normal;
  line-height: 20px;
  cursor: pointer;
}

.authentication_manage {
  :deep(.tele-form-item) {
    margin-bottom: 16px;
  }
}

.nodata {
  color: #86909c;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
</style>
