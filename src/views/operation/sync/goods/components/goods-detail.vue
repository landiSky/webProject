<template>
  <t-modal
    v-model:visible="showModal"
    fullscreen
    title-align="start"
    :closable="false"
    :body-style="{ padding: 0 }"
    :loadding="loading"
    :footer="
      props.data.status != StatusEnum.YBH && props.data.status != StatusEnum.WSJ
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
          v-if="props.data.status === StatusEnum.WTB"
          type="primary"
          @click="start"
          >开启同步</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.TBZ"
          type="primary"
          status="danger"
          @click="stop"
          >停止同步</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.WTB"
          @click="Message.warning('敬请期待')"
          >打标</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.TBZ"
          type="primary"
          @click="Message.warning('敬请期待')"
          >打标</t-button
        >
      </div>
    </template>
    <div>
      <div class="status-div" :style="{ backgroundColor: statusColor }">
        <iconpark-icon
          v-if="props.data.status === StatusEnum.TBZ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.WTB"
          name="wait"
        ></iconpark-icon>
        商品同步状态：{{ StatusEnum[props.data.status] }}
        <div class="seprator-line">丨</div>
        <div> 上架时间 {{ props.data.upShelfTime }}</div>
      </div>

      <div class="modal-body">
        <div class="archor"
          ><t-affix :offset-top="180">
            <t-anchor>
              <t-anchor-link href="#base">基本信息</t-anchor-link>
              <t-anchor-link href="#sale">售卖设置</t-anchor-link>
              <t-anchor-link
                v-for="(_, index) of props.data.productDeliverySetList"
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
                {{ props.data.name }}
              </t-descriptions-item>
              <t-descriptions-item label="商品ID">
                {{ props.data.id }}
              </t-descriptions-item>
              <t-descriptions-item label="商家名称">
                {{ props.data.companyName }}
              </t-descriptions-item>
              <t-descriptions-item label="所属平台">
                {{ '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品Logo">
                <img
                  class="first-img"
                  :alt="props.data.logo"
                  :src="`/web/file/download?name=${props.data.logo}`"
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="详情展示图">
                <img
                  v-for="url of detailImageList"
                  :key="url"
                  :alt="url"
                  class="first-img"
                  :src="`/web/file/download?name=${url}`"
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="商品分类">
                {{ classDes }}
              </t-descriptions-item>
              <t-descriptions-item label="商品标签">
                {{ '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用类型">
                {{ TypeEnum[props.data.type] }}
              </t-descriptions-item>
              <t-descriptions-item label="商品简介">
                {{ props.data.introduction }}
              </t-descriptions-item>
              <t-descriptions-item label="产品使用说明">
                <a
                  :href="`/web/file/download?name=${props.data.useExplain}`"
                  download
                  >产品使用说明</a
                >
              </t-descriptions-item>
              <t-descriptions-item label="详情展示信息">
                {{ props.data.detail }}
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
                {{ DeliveryTypeEnum[props.data.deliveryType] }}
              </t-descriptions-item>
              <t-descriptions-item label="商品定价方式">
                {{ PriceTypeEnum[props.data.saleType] }}
              </t-descriptions-item>
            </t-descriptions>
            <t-descriptions
              v-for="(st, index) of props.data.productDeliverySetList"
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
                v-if="props.data.deliveryType == 0"
                label="应用服务地址"
              >
                {{ st.url }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="props.data.deliveryType === 0"
                label="套餐定价设置"
              >
                <div v-for="(p, pIndex) of st.accountNumList" :key="p">
                  套餐{{ pIndex + 1 }}：账号数 {{ p.accountNum }} 个，账号单价
                  {{ p.price }} 元</div
                >
              </t-descriptions-item>
              <t-descriptions-item
                v-if="props.data.deliveryType === 0"
                label="可选购买时长"
              >
                {{ desDeuration(st.durationList) }}
              </t-descriptions-item>
              <t-descriptions-item
                v-if="props.data.deliveryType === 1"
                label="一口价金额"
              >
                {{ st.accountNumList[0].price }} 元
              </t-descriptions-item>
              <t-descriptions-item label="应用秘钥">
                <a
                  :href="`/web/file/download?name=${props.data.useExplain}`"
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
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
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
const formRef = ref();

const formModel = ref();
const detailImageList = ref<string[]>([]);

const refreshData = async () => {
  formModel.value = await goodsDetail(props.data?.id);
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
      refreshData();
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

const getDetail = () => {
  // 调后端接口
  loading.value = true;
  goodsDetail(props.data?.id)
    .then((res) => {
      if (res.code === 200) {
        formModel.value = res || {};
        detailImageList.value = res.detailImg.split(',');
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
  if (props.data.status === StatusEnum.YSJ) {
    return '#E8F4FF';
  }
  if (props.data.status === StatusEnum.YSJ) {
    return '#FFECE8';
  }
  return '#FFFAE8';
});

onMounted(() => {
  console.log(props.data);
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
