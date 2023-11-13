<template>
  <t-modal
    v-model:visible="visible"
    fullscreen
    title-align="start"
    :closable="false"
    :body-style="{ padding: 0 }"
    class="fullscreen-modal"
    :footer="props.data.status != StatusEnum.DSH"
    @cancel="emit('cancel')"
    @close="emit('cancel')"
    @edit="emit('edit')"
    @back="emit('cancel')"
  >
    <template #title>
      <div style="width: 100%; text-align: center"> 商品详情 </div>
    </template>
    <template #footer>
      <div class="footer">
        <t-button
          v-if="props.data.status === StatusEnum.YBH"
          type="primary"
          @click="clickEdit"
          >编辑</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.YBH"
          @click="clickDelete"
          >删除</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.WSJ"
          type="primary"
          @click="clickUp"
          >上架</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.WSJ"
          type="outline"
          @click="clickPreview"
          >预览</t-button
        >
        <t-button v-if="props.data.status === StatusEnum.WSJ" @click="clickEdit"
          >编辑</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.WSJ"
          @click="clickDelete"
          >删除</t-button
        >

        <t-button
          v-if="props.data.status === StatusEnum.YSJ"
          type="primary"
          @click="clickView"
          >查看</t-button
        >
        <t-button
          v-if="props.data.status === StatusEnum.YSJ"
          type="primary"
          status="danger"
          @click="clickDown"
          >下架</t-button
        >
      </div>
    </template>
    <div>
      <div class="status-div" :style="{ backgroundColor: statusColor }">
        <iconpark-icon
          v-if="props.data.status === StatusEnum.YSJ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.YBH"
          name="error"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.WSJ"
          name="alert"
        ></iconpark-icon>
        <iconpark-icon
          v-if="props.data.status === StatusEnum.DSH"
          name="wait"
        ></iconpark-icon>
        <div style="margin-left: 8px">
          商品状态：{{ StatusEnum[props.data.status] }}。
        </div>
        <div v-if="props.data.status === StatusEnum.DSH">
          通过审核后，将同时在本平台和标识网络其他平台同步上架。</div
        >
        <div v-if="props.data.status === StatusEnum.YBH">
          驳回原因：{{ props.data.rejectReason }}</div
        >
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
              <t-descriptions-item label="商品Logo">
                <img
                  class="first-img"
                  :alt="props.data.logo"
                  :src="`/server/web/file/download?name=${props.data.logo}`"
                  style="width: 158px; height: 100px; background-color: #999"
                />
              </t-descriptions-item>
              <t-descriptions-item label="详情展示图">
                <img
                  v-for="url of detailImageList"
                  :key="url"
                  :alt="url"
                  class="first-img"
                  :src="`/server/web/file/download?name=${url}`"
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
                  :href="`/server/web/file/download?name=${props.data.useExplain}`"
                  download
                  >产品使用说明</a
                >
              </t-descriptions-item>
              <t-descriptions-item label="详情展示信息">
                {{ JSON.parse(props.data.detail).map((item: any)=>item.moduleName).join(',') }}
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
                  :href="`/server/web/file/download?name=${props.data.useExplain}`"
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
import { Message } from '@tele-design/web-vue';
import {
  deleteGoods,
  upGoods,
  downGoods,
  goodsDetail,
} from '@/api/goods-manage';

const visible = ref(true);
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
    default: () => {
      return {};
    },
  },
  classDes: {
    type: String,
    default: () => '',
  },
});

const dataInfo = ref();
const emit = defineEmits(['confirm', 'cancel', 'edit', 'preview']);
const info = ref<any>();
const detailImageList = ref<string[]>([]);

const statusColor = computed(() => {
  if (props.data.status === StatusEnum.YSJ) {
    return '#E8F4FF';
  }
  if (props.data.status === StatusEnum.YSJ) {
    return '#FFECE8';
  }
  return '#FFFAE8';
});

// 交付方式
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SAAS',
  1: '独立部署',
};
// 应用分类
const TypeEnum: { [name: string]: any } = {
  PT: 0,
  BS: 1,
  0: '普通应用',
  1: '标识应用',
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

// 预览
const clickPreview = () => {
  if (props.data?.id) {
    emit('preview', props.data?.id);
  }
};

const desDeuration = (array: any[]) => {
  return array.map((item) => DurationEnum[item.duration]).join(' ');
};

const refreshData = async () => {
  dataInfo.value = await goodsDetail(props.data.id);
  detailImageList.value = dataInfo.value.detailImg.split(',');
};

onMounted(() => {
  refreshData();
});

const clickEdit = () => {
  emit('edit');
};
// 删除操作
const doDelete = (id: any) => {
  deleteGoods(id).then(() => {
    Message.success('删除成功');
    emit('confirm');
  });
};
const clickDelete = () => {
  doDelete(props.data.id);
};
const doUp = (id: any) => {
  upGoods(id).then(() => {
    Message.success('上架成功');
    refreshData();
  });
};
const clickUp = () => {
  doUp(props.data.id);
};

// 下架
const doDown = (id: any) => {
  downGoods(id).then(() => {
    Message.success('商品已下架');
    refreshData();
  });
};
const clickDown = () => {
  doDown(props.data.id);
};

const clickView = () => {
  console.log('view');
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
