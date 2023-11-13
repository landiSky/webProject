<template>
  <t-modal
    v-model:visible="showModal"
    :loading="loading"
    fullscreen
    title-align="start"
    :closable="false"
    :body-style="{ padding: 0 }"
    class="fullscreen-modal"
    :footer="
      props.data.status != StatusEnum.YBH &&
      props.data.status != StatusEnum.WSJ &&
      props.data.source != PlatformEnum.OTHER
    "
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <template #title>
      <div style="width: 100%; text-align: center"> 商品详情 </div>
    </template>
    <template #footer>
      <div class="footer">
        <t-button
          v-if="
            formModel.status === StatusEnum.DSH &&
            formModel.source === PlatformEnum.SELF
          "
          type="primary"
          @click="clickPassBtn"
          >通过</t-button
        >
        <t-button
          v-if="
            formModel.status === StatusEnum.DSH &&
            formModel.source === PlatformEnum.SELF
          "
          type="primary"
          status="danger"
          @click="clickRejectBtn"
          >驳回</t-button
        >
        <t-button
          v-if="
            (formModel.status === StatusEnum.DSH &&
              formModel.source === PlatformEnum.SELF) ||
            (formModel.status === StatusEnum.WSJ &&
              formModel.source === PlatformEnum.OTHER)
          "
          @click="clickPreviewBtn"
          >预览</t-button
        >
        <t-button
          v-if="formModel.status === StatusEnum.YSJ"
          type="primary"
          @click="clickViewBtn"
          >查看</t-button
        >
        <t-button
          v-if="formModel.status === StatusEnum.YSJ"
          type="primary"
          status="danger"
          @click="clickDownBtn"
          >下架</t-button
        >
        <t-button
          v-if="
            formModel.status === StatusEnum.WSJ &&
            formModel.source === PlatformEnum.OTHER
          "
          type="primary"
          status="danger"
          @click="clickDeleteBtn"
          >删除</t-button
        >
        <t-button
          v-if="
            formModel.status === StatusEnum.WSJ &&
            formModel.source === PlatformEnum.OTHER
          "
          type="primary"
          @click="clickUpBtn"
          >上架</t-button
        >
      </div>
    </template>
    <div>
      <div class="status-div" :style="{ backgroundColor: statusColor }">
        <iconpark-icon
          v-if="formModel.status === StatusEnum.YSJ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="formModel.status === StatusEnum.YBH"
          name="error"
        ></iconpark-icon>
        <iconpark-icon
          v-if="formModel.status === StatusEnum.WSJ"
          name="alert"
        ></iconpark-icon>
        <iconpark-icon
          v-if="formModel.status === StatusEnum.DSH"
          name="wait"
        ></iconpark-icon>
        <div style="margin-left: 8px">
          商品状态：{{ StatusEnum[formModel.status] }}。
        </div>
        <div v-if="formModel.status === StatusEnum.DSH">
          通过审核后，将同时在本平台和标识网络其他平台同步上架。</div
        >
        <div v-if="formModel.status === StatusEnum.YBH">
          驳回原因：{{ formModel.rejectReason }}</div
        >
      </div>

      <div class="modal-body">
        <div class="archor"
          ><t-affix :offset-top="180">
            <t-anchor>
              <t-anchor-link href="#base">基本信息</t-anchor-link>
              <t-anchor-link href="#sale">售卖设置</t-anchor-link>
              <t-anchor-link
                v-for="(_, index) of formModel.productDeliverySetList"
                :key="index"
                :href="'#st' + index"
              >
                交付版本{{ index + 1 }}
              </t-anchor-link>
            </t-anchor>
          </t-affix></div
        >
        <div class="content">
          <div class="center">
            <t-descriptions
              id="base"
              title="基本信息"
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
              <t-descriptions-item label="商品名称">
                {{ formModel.name }}
              </t-descriptions-item>
              <t-descriptions-item label="商品ID">
                {{ formModel.id }}
              </t-descriptions-item>
              <t-descriptions-item label="商品Logo">
                <img
                  class="first-img"
                  :alt="formModel.logo"
                  :src="`/server/web/file/download?name=${formModel.logo}&productId=${formModel.id}`"
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="详情展示图">
                <img
                  v-for="url of detailImageList"
                  :key="url"
                  :alt="url"
                  class="first-img"
                  :src="`/server/web/file/download?name=${url}&productId=${formModel.id}`"
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="商品分类">
                {{ formModel.productTypeParentName }}/{{
                  formModel.productTypeName
                }}
              </t-descriptions-item>
              <t-descriptions-item label="商品标签">
                {{ '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用类型">
                {{ TypeEnum[formModel.type] }}
              </t-descriptions-item>
              <t-descriptions-item label="商品简介">
                {{ formModel.introduction }}
              </t-descriptions-item>
              <t-descriptions-item label="产品使用说明">
                <a
                  :href="`/server/web/file/download?name=${formModel.useExplain}&productId=${formModel.id}`"
                  download
                  >产品使用说明</a
                >
              </t-descriptions-item>
              <t-descriptions-item label="详情展示信息">
                {{ formModel.detail ? JSON.parse(formModel.detail).map((item: any)=>item.moduleName).join(',') : '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="服务商名称">
                {{ formModel.companyName }}
              </t-descriptions-item>
              <t-descriptions-item label="所属平台">
                {{ formModel.platformOperationCompany }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              id="sale"
              title="售卖设置"
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
              <t-descriptions-item label="服务交付类型">
                {{ DeliveryTypeEnum[formModel.deliveryType] }}
              </t-descriptions-item>
              <t-descriptions-item label="商品定价方式">
                {{ PriceTypeEnum[formModel.saleType] }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              v-for="(st, index) of formModel.productDeliverySetList"
              :id="'st' + index"
              :key="index"
              :title="'交付版本' + (index + 1)"
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
              <t-descriptions-item label="交付版本名称">
                {{ st.name }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.deliveryType == 0"
                label="应用服务地址"
              >
                {{ st.url }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.deliveryType === 0"
                label="套餐定价设置"
              >
                <div v-for="(p, pIndex) of st.accountNumList" :key="p">
                  套餐{{ pIndex + 1 }}：账号数 {{ p.accountNum }} 个，账号单价
                  {{ p.price }} 元</div
                >
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.deliveryType === 0"
                label="可选购买时长"
              >
                {{ desDeuration(st.durationList) }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.deliveryType === 1"
                label="一口价金额"
              >
                {{ st.accountNumList[0].price }} 元
              </t-descriptions-item>
              <t-descriptions-item label="应用秘钥">
                <a
                  :href="`/server/web/file/download?name=${formModel.useExplain}`"
                  download
                  >应用秘钥</a
                >
              </t-descriptions-item>
            </t-descriptions>
          </div>
        </div>
      </div>
    </div>
  </t-modal>
  <RejectModal
    v-if="rejectVisible"
    :id="props.data?.id"
    @cancel="rejectVisible = false"
    @confirm="clickReject"
  ></RejectModal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import {
  goodsDetail,
  deleteGoods,
  upGoods,
  downGoods,
  verifyGoods,
} from '@/api/operation/goods';
import { Message, Modal } from '@tele-design/web-vue';

const loading = ref(true);
const detailImageList = ref<string[]>([]);
const rejectVisible = ref(false);
// 交付方式
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SAAS',
  1: '独立部署',
};

// 定价方式
const PriceTypeEnum: { [name: string]: any } = {
  0: '套餐定价(账号+时长)',
  1: '一口价定价',
  2: '价格面议',
};
// 平台
const PlatformEnum: { [name: string]: any } = {
  SELF: 0, // 本平台
  OTHER: 1, // 跨平台
  0: '本平台',
  1: '跨平台',
};
const DurationEnum: { [name: string]: string } = {
  1: '1个月',
  2: '2个月',
  3: '3个月',
  6: '6个月',
  12: '1年',
  24: '2年',
  36: '3年',
  0: '不限',
};
const desDeuration = (array: any[]) => {
  return array.map((item) => DurationEnum[item.duration]).join(' ');
};
// 应用分类
const TypeEnum: { [name: string]: any } = {
  PT: 0,
  BS: 1,
  0: '普通应用',
  1: '标识应用',
};
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

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);
const formModel = ref<Record<string, any>>({});

const getDetail = () => {
  goodsDetail(props.data?.id).then((res) => {
    if (res.code === 200) {
      formModel.value = res.data || {};
      detailImageList.value = (res.data.detailImg as string).split(',');
    }
  });
};

const statusColor = computed(() => {
  if (formModel.value.status === StatusEnum.YSJ) {
    return '#E8F4FF';
  }
  if (formModel.value.status === StatusEnum.YSJ) {
    return '#FFECE8';
  }
  return '#FFFAE8';
});

onMounted(() => {
  if (props.data?.id) {
    getDetail();
  }
});

// 通过
const clickPassBtn = () => {
  verifyGoods({ id: props.data?.id, status: 1 }).then((res) => {
    if (res.code === 200) {
      Message.success('审核已通过');
      getDetail();
    }
  });
};

const clickReject = () => {
  rejectVisible.value = false;
  getDetail();
};
// 驳回
const clickRejectBtn = () => {
  rejectVisible.value = true;
};
// 预览
const clickPreviewBtn = () => {
  // TODO 预览
};
// 查看
const clickViewBtn = () => {
  // TODO 查看
};
// 下架操作
const doDown = (id: any) => {
  downGoods(id).then((res) => {
    if (res.code === 200) {
      Message.success('商品已下架');
      getDetail();
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
      getDetail();
    }
  });
};

// 删除操作
const doDelete = (id: any) => {
  deleteGoods(id).then((res) => {
    if (res.code === 200) {
      Message.success('删除成功');
      emit('confirm');
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
</script>

<style lang="less" scoped>
.status-div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 62px;
}

.modal-body {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: 24px 20px;
  overflow: auto;
  background-color: #fff;

  .archor {
    z-index: 999;
    width: 70px;
    margin-left: 80px;
  }

  .content {
    display: flex;
    flex: 1;
    justify-content: center;
    margin-right: 150px;

    .center {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      width: 632px;
    }
  }
}

.footer {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
