<template>
  <div :loading="currentData.loading">
    <t-page-header flex :show-back="false" @back="goBack">
      <template #title>
        <t-breadcrumb :routes="breadcrumbList" />
      </template>
    </t-page-header>
    <t-row class="grid-demo">
      <t-col :span="18" class="modal-body">
        <t-descriptions
          id="apply"
          class="content"
          title="License申请信息"
          :title-style="{
            fontSize: '14px',
            lineHeight: '22px',
            marginBottom: '16px',
          }"
          :title-divider-style="{ height: '12px' }"
          :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
          size="medium"
          :column="1"
        >
          <t-descriptions-item label="企业前缀">
            {{ currentData.itemInfo.entPrefix || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="企业名称">
            {{ currentData.itemInfo.companyName || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="IDHub版本">
            {{ editionList[currentData.itemInfo.idHubVersion] }}
          </t-descriptions-item>
          <t-descriptions-item label="申请时间">
            {{ currentData.itemInfo.createTime || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="生效时间">
            {{ currentData.itemInfo.effectTime || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="备注">
            {{ currentData.itemInfo.remark || '-' }}
          </t-descriptions-item>
        </t-descriptions>
        <div class="line"></div>
        <t-descriptions
          id="operatingscale"
          class="content"
          title="运营规模"
          :title-style="{
            fontSize: '14px',
            lineHeight: '22px',
            marginBottom: '16px',
          }"
          :title-divider-style="{ height: '12px' }"
          :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
          size="medium"
          :column="1"
        >
          <t-descriptions-item label="预估标识注册量">
            <t-statistic
              v-if="currentData.itemInfo.estimateRegisterCount"
              :value="Number(currentData.itemInfo.estimateRegisterCount)"
              show-group-separator
              :value-style="{
                'font-family': 'PingFang SC',
                'font-size': '12px',
                'font-weight': '400',
                'line-height': '20px',
                'text-align': 'left',
                'color': 'rgba(29, 33, 41, 1)',
              }"
            />
            <div v-else>-</div>
          </t-descriptions-item>
          <t-descriptions-item label="预估标识日解析量">
            <t-statistic
              v-if="currentData.itemInfo.estimateParseCount"
              :value="Number(currentData.itemInfo.estimateParseCount)"
              show-group-separator
              :value-style="{
                'font-family': 'PingFang SC',
                'font-size': '12px',
                'font-weight': '400',
                'line-height': '20px',
                'text-align': 'left',
                'color': 'rgba(29, 33, 41, 1)',
              }"
            />
            <div v-else>-</div>
          </t-descriptions-item>
        </t-descriptions>
        <div class="line"></div>
        <t-descriptions
          id="contacts"
          class="content"
          title="企业联系人"
          :title-style="{
            fontSize: '14px',
            lineHeight: '22px',
            marginBottom: '16px',
          }"
          :title-divider-style="{ height: '12px' }"
          :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
          size="medium"
          :column="1"
        >
          <t-descriptions-item label="姓名">
            {{ currentData.itemInfo.name || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="手机号">
            {{ currentData.itemInfo.phone || '-' }}
          </t-descriptions-item>
          <t-descriptions-item label="邮箱">
            {{ currentData.itemInfo.email || '-' }}
          </t-descriptions-item>
        </t-descriptions>
        <div class="line"></div>
        <t-descriptions
          id="code"
          class="content"
          title="设备指纹码"
          :title-style="{
            fontSize: '14px',
            lineHeight: '22px',
            marginBottom: '16px',
          }"
          :title-divider-style="{ height: '12px' }"
          :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
          size="medium"
          :column="1"
        >
          <t-table
            :loading="tableLoading"
            :columns="columnsCode"
            :data="currentData.itemInfo.fingerPrintList"
            :pagination="false"
            style="width: 441px"
            :scroll="{
              y: 220,
            }"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #code="{ record }">
              {{ record }}
            </template>
          </t-table>
        </t-descriptions>
        <div class="line"></div>
        <t-descriptions
          id="history"
          class="content"
          title="license发放信息"
          :title-style="{
            fontSize: '14px',
            lineHeight: '22px',
            marginBottom: '16px',
          }"
          :title-divider-style="{ height: '12px' }"
          :label-style="{ textAlign: 'left', verticalAlign: 'top' }"
          size="medium"
          :column="1"
        >
          <t-table
            :loading="tableLoading"
            :columns="columnsHistory"
            :data="state.dataHistory"
            :pagination="false"
            :scroll="{
              y: 220,
            }"
          >
            <template #status="{ record }">
              <div class="state-center">
                <span
                  class="circle circle-right"
                  :class="stateType[record.status].color"
                ></span>
                {{ stateType[record.status].name }}
                <t-tooltip
                  v-if="record.status === 2"
                  :content="`拒绝原因：${record.rejectRemark}`"
                  position="top"
                >
                  <div class="icon-info-circle"></div>
                </t-tooltip>
              </div>
            </template>
            <template #authCycle="{ record }">
              {{
                record.authCycle >= 0 && record.authCycle != null
                  ? stateType[record.authCycle]?.time
                  : '-'
              }}
            </template>
          </t-table>
        </t-descriptions>
      </t-col>
      <t-col :span="4">
        <div class="anchor-top">
          <t-anchor :change-hash="false" scroll-container="#scrollMain">
            <t-anchor-link href="#apply">License申请信息</t-anchor-link>
            <t-anchor-link href="#operatingscale">运营规模</t-anchor-link>
            <t-anchor-link href="#contacts"> 企业联系人 </t-anchor-link>
            <t-anchor-link href="#code"> 设备指纹码 </t-anchor-link>
            <t-anchor-link href="#history"> license发放信息 </t-anchor-link>
          </t-anchor>
        </div>
      </t-col>
    </t-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { manageLicenseDetail } from '@/api/identifying/license';

const router = useRouter();
const route = useRoute();
// 面包屑展示
const breadcrumbList = reactive([
  {
    path: '/license/index',
    label: 'License管理',
  },
  {
    path: null,
    label: '详情',
  },
]);
const goBack = () => {
  router.go(-1);
};
// 设备码
const columnsCode = [
  {
    title: '编号',
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: '设备指纹码',
    dataIndex: 'code',
    slotName: 'code',
    ellipsis: true,
    tooltip: true,
  },
];
// License发放信息
const columnsHistory = [
  {
    title: '编号',
    dataIndex: 'code',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'License状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '授权周期',
    dataIndex: 'authCycle',
    slotName: 'authCycle',
    width: 180,
  },
  {
    title: '发放时间',
    dataIndex: 'approveTime',
    width: 180,
  },
];
// License状态 授权周期 集合
const stateType: any = {
  0: {
    name: '审核中',
    color: 'orange',
    time: '6个月',
  },
  1: {
    name: '已生效',
    color: 'green',
    time: '1年',
  },
  2: {
    name: '已拒绝',
    color: 'danger',
    time: '2年',
  },
  3: {
    name: '已过期',
    color: 'gray',
    time: '3年',
  },
  4: {
    name: '待生效',
    color: 'blue',
    time: '4年',
  },
};
// IDHub版本集合
const editionList: any = {
  1: '标准版',
  2: '社区版',
  3: '中间件版',
};

const tableLoading = ref(false);
const state = reactive<{
  dataHistory: Array<any>;
}>({
  dataHistory: [],
});
// 详情数据集合
const currentData = reactive<{
  loading: boolean;
  itemInfo: Record<string, any>;
}>({
  loading: true,
  itemInfo: {},
});
// 详情接口
const getInfo = async () => {
  const params = {
    licenseId: route.query.id,
  };
  currentData.loading = true;
  manageLicenseDetail(params)
    .then((res: any) => {
      currentData.itemInfo = res.data;
      state.dataHistory = [
        {
          code: res.data?.code,
          status: res.data?.status,
          authCycle: res.data?.authCycle,
          approveTime: res.data?.approveTime,
        },
      ];
    })
    .finally(() => {
      currentData.loading = false;
    });
};

onMounted(() => {
  getInfo();
});
</script>

<style scoped lang="less">
:deep(.tele-page-header.tele-page-header-flex) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-body {
  padding: 16px 24px;
}

.anchor-top {
  margin-top: 65px;
  padding-left: 174px;
}

.state-center {
  display: flex;
  align-items: center;
}

.line {
  width: 100%;
  height: 1px;
  margin-top: 4px;
  margin-bottom: 20px;
  background: #e5e8ef;
}

.model-button {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.circle-right {
  width: 4px;
  height: 4px;
  margin-right: 8px;
}

.icon-info-circle {
  width: 13px;
  height: 13px;
  margin-left: 8px;
  background: url(@/assets/images/license/info-circle.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

:deep(.tele-table-empty .tele-empty) {
  padding: 0;
}

:deep(.tele-statistic-content .tele-statistic-value-integer) {
  font-size: 12px;
}
</style>
