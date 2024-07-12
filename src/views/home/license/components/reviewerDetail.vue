<template>
  <div :loading="currentData.loading">
    <t-page-header flex :show-back="true" @back="goBack">
      <template #title> 审批 </template>
      <template #breadcrumb>
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
            <t-tooltip
              content="跳转国家顶级节点查询企业前缀注册时间、所属二级等信息"
              position="bottom"
            >
              <t-link
                :hoverable="false"
                @click="query(currentData.itemInfo.entPrefix)"
                >查询</t-link
              >
            </t-tooltip>
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
          id="order"
          class="content"
          title="企业节点订单信息"
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
            :columns="columnsOrder"
            :data="currentData.itemInfo.orderList"
            :pagination="false"
            :scroll="{
              y: 220,
            }"
          >
            <template #deliveryType="{ record }">
              {{ DeliveryTypeEnum[record.deliveryType] || '-' }}
            </template>
            <template #realityPrice="{ record }">
              ¥{{ record.realityPrice || '0.00' }}
            </template>
            <template #orderStatus="{ record }">
              <iconpark-icon
                :name="orderStatusSelect[record.orderStatus]?.color"
                size="10px"
              />
              {{ orderStatusSelect[record.orderStatus]?.label || '-' }}
            </template>
          </t-table>
        </t-descriptions>
        <div class="line"></div>
        <t-descriptions
          id="history"
          class="content"
          title="历史License申请信息"
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
            :data="currentData.itemInfo.historyLicenseList"
            :pagination="false"
            :scroll="{
              y: 220,
            }"
          >
            <template #idHubVersion="{ record }">
              {{ editionList[record.idHubVersion] }}
            </template>
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
            <t-anchor-link href="#order"> 企业节点订单信息 </t-anchor-link>
          </t-anchor>
        </div>
      </t-col>
    </t-row>
    <div class="model-button">
      <t-space>
        <t-button type="primary" status="danger" @click="rejectVisible = true"
          >拒绝</t-button
        >
        <t-button type="primary" @click="adoptVisible = true">通过</t-button>
      </t-space>
    </div>
  </div>

  <AdoptModal
    v-if="adoptVisible"
    :id="(route.query.id as string)"
    @cancel="adoptVisible = false"
    @confirm="clickAdopt"
  ></AdoptModal>

  <RejectModal
    v-if="rejectVisible"
    :id="(route.query.id as string)"
    @cancel="rejectVisible = false"
    @confirm="clickReject"
  ></RejectModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@tele-design/web-vue';
import { manageLicenseInfoDetail } from '@/api/identifying/license';

import AdoptModal from './adopt-model.vue';
import RejectModal from './reject-modal.vue';

const router = useRouter();
const route = useRoute();
// 面包屑
const breadcrumbList = reactive([
  {
    path: '/license/index',
    label: 'License管理',
  },
  {
    path: null,
    label: '审批',
  },
]);
// 审批旁边图标回退
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
// 企业节点订单信息
const columnsOrder = [
  {
    title: '订单编号',
    dataIndex: 'orderNum',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '交付类型',
    dataIndex: 'deliveryType',
    slotName: 'deliveryType',
  },
  {
    title: '实付金额',
    dataIndex: 'realityPrice',
    slotName: 'realityPrice',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    slotName: 'orderStatus',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    ellipsis: true,
    tooltip: true,
  },
];
// 历史License申请信息
const columnsHistory = [
  {
    title: '编号',
    dataIndex: 'code',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'IDHub版本',
    dataIndex: 'idHubVersion',
    slotName: 'idHubVersion',
  },
  {
    title: '剩余有效期',
    dataIndex: 'remainingValidDate',
  },
  {
    title: '申请状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '生效时间',
    dataIndex: 'effectTime',
    width: 180,
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: 180,
  },
];

// 交付方式
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SaaS（免费）',
  1: '独立部署',
};
// 企业节点订单信息 集合
const orderStatusSelect: any = {
  0: {
    label: '待支付',
    color: 'wait',
  },
  1: {
    label: '待审核',
    color: 'waitblue',
  },
  2: {
    label: '待交付',
    color: 'waitblue',
  },
  3: {
    label: '已交付',
    color: 'success',
  },
  4: {
    label: ' 已驳回',
    color: 'error',
  },
  5: {
    label: ' 待确认交付',
    color: 'wait',
  },
};
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

const adoptVisible = ref(false);
const rejectVisible = ref(false);
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
  manageLicenseInfoDetail(params)
    .then((res: any) => {
      currentData.itemInfo = res.data;
    })
    .finally(() => {
      currentData.loading = false;
    });
};
// 弹窗 通过
const clickAdopt = () => {
  adoptVisible.value = false;
  // getInfo();
  goBack();
};
// 弹窗 拒绝
const clickReject = () => {
  rejectVisible.value = false;
  goBack();
  // getInfo();
};
// 企业前缀 参看跳转
const query = (value: any) => {
  window.open(
    `https://dms.idfactory.cn/whois/ui/searchResult?identity=${value}`
  );
};

onMounted(() => {
  getInfo();
});

onUnmounted(() => {});
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
