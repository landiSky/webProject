<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    :body-style="{ padding: 0 }"
    :loadding="loading"
    :footer="
      formModel.status != StatusEnum.YBH && formModel.status != StatusEnum.WSJ
    "
    class="fullscreen-modal"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
  >
    <template #title>
      <div style="width: 100%; text-align: center"> 商品详情 </div>
    </template>
    <template #footer>
      <div class="footer">
        <t-button
          v-if="formModel.status === StatusEnum.WTB"
          type="primary"
          @click="start"
          >开启同步</t-button
        >
        <t-button
          v-if="formModel.status === StatusEnum.TBZ"
          type="primary"
          status="danger"
          @click="stop"
          >停止同步</t-button
        >
        <t-button
          v-if="formModel.status === StatusEnum.WTB"
          @click="Message.warning('敬请期待')"
          >打标</t-button
        >
        <t-button
          v-if="formModel.status === StatusEnum.TBZ"
          type="primary"
          @click="Message.warning('敬请期待')"
          >打标</t-button
        >
      </div>
    </template>
    <div>
      <div class="status-div" :style="{ backgroundColor: statusColor }">
        <iconpark-icon
          v-if="formModel.status === StatusEnum.TBZ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="formModel.status === StatusEnum.WTB"
          name="wait"
        ></iconpark-icon>
        商品同步状态：{{ StatusEnum[formModel.status] }}
        <div class="seprator-line">丨</div>
        <div> 上架时间 {{ formModel.upShelfTime }}</div>
      </div>

      <div class="modal-body">
        <div class="archor"
          ><t-affix :offset-top="180">
            <t-anchor>
              <t-anchor-link href="#sbase">基本信息</t-anchor-link>
              <t-anchor-link href="#ssale">售卖设置</t-anchor-link>
              <t-anchor-link
                v-for="(_, index) of formModel.productDeliverySetList"
                :key="index"
                :href="'#sst' + index"
              >
                交付版本{{ index + 1 }}
              </t-anchor-link>
            </t-anchor>
          </t-affix></div
        >
        <div class="content">
          <div class="center">
            <t-descriptions
              id="sbase"
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
              <t-descriptions-item label="商家名称">
                {{ formModel.companyName }}
              </t-descriptions-item>
              <t-descriptions-item label="所属平台">
                {{ formModel.platformOperationCompany }}
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
                {{
                  formModel.detail
                    ? JSON.parse(formModel.detail)
                        .map((item: any) => item.moduleName)
                        .join(',')
                    : '-'
                }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              id="ssale"
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
              :id="'sst' + index"
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
                v-if="formModel.saleType === 0"
                label="套餐定价设置"
              >
                <div v-for="(p, pIndex) of st.accountNumList" :key="p">
                  套餐{{ pIndex + 1 }}：账号数 {{ p.accountNum }} 个，账号单价
                  {{ p.price }} 元</div
                >
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.saleType === 0"
                label="可选购买时长"
              >
                {{ desDeuration(st.durationList) }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="formModel.saleType === 1"
                label="一口价金额"
              >
                {{
                  st.accountNumList && st.accountNumList.length > 0
                    ? st.accountNumList[0].price
                    : '-'
                }}
                元
              </t-descriptions-item>
              <t-descriptions-item label="应用秘钥">
                <a
                  :href="`data:text/plain;charset=utf-8,${encodeURIComponent(
                    st.appSecret
                  )}`"
                  download
                  >下载秘钥文件</a
                >
              </t-descriptions-item>
            </t-descriptions>
          </div>
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { goodsDetail, startSync, stopSync } from '@/api/operation/sync-class';
import { Message, Modal } from '@tele-design/web-vue';

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

const loading = ref(false);
// 状态
const StatusEnum: { [name: string]: any } = {
  WTB: 0,
  TBZ: 1,
  0: '未同步',
  1: '同步中',
};

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  classDes: {
    type: String,
    default: () => '',
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const showModal = ref(true);

const formModel = ref<Record<string, any>>({});
const detailImageList = ref<string[]>([]);

const refreshData = async () => {
  goodsDetail(props.data?.id).then((res) => {
    if (res.code === 200) {
      formModel.value = res.data;
    }
  });
};

onMounted(() => {
  refreshData();
});

const doStop = (id: any) => {
  stopSync(id).then((res) => {
    if (res.code === 200) {
      Message.success('同步已停止');
      refreshData();
    }
  });
};
// 停止
const stop = () => {
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
      doStop(props.data?.id);
    },
  });
};

const doStart = (id: any) => {
  startSync(id).then((res) => {
    if (res.code === 200) {
      Message.success('同步已开启');
      refreshData();
    }
  });
};
// 开启同步
const start = () => {
  Modal.warning({
    title: '确定开启同步该商品吗？',
    titleAlign: 'start',
    content: '开启同步后，该商品将展示在标识网络订阅商品中。',
    okText: '开启同步',
    hideCancel: false,
    onOk: () => {
      doStart(props.data?.id);
    },
  });
};

const getDetail = () => {
  // 调后端接口
  loading.value = true;
  goodsDetail(props.data?.id)
    .then((res) => {
      if (res.code === 200) {
        formModel.value = res.data || {};
        detailImageList.value = res.data.detailImg
          ? res.data.detailImg.split(',')
          : [];
      }
    })
    .catch((e) => {
      Message.error(e);
    })
    .finally(() => {
      loading.value = false;
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
</script>

<style lang="less" scoped>
.status-div {
  display: flex;
  gap: 0 8px;
  align-items: center;
  justify-content: center;
  height: 62px;

  .seprator-line {
    // margin: 0 8px;
    color: var(--f-71-d-2129, #1d2129);
    font-weight: 500;
    font-size: 14px;

    /* CN/标题/14-Medium-迷你 */
    font-family: PingFang SC;
    font-style: normal;
    line-height: 22px;
  }
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
