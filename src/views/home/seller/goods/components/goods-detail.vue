<template>
  <t-modal
    v-model:visible="visible"
    fullscreen
    title-align="start"
    :closable="false"
    :body-style="{ padding: 0 }"
    class="fullscreen-modal"
    :footer="dataInfo.status != StatusEnum.DSH"
    @edit="emit('edit')"
    @back="emit('cancel')"
  >
    <template #title>
      <div style="width: 100%; text-align: center"> 商品详情 </div>
    </template>
    <template #footer>
      <div class="footer">
        <t-button
          v-if="dataInfo.status === StatusEnum.YBH"
          type="primary"
          @click="clickEdit"
          >编辑</t-button
        >
        <t-button v-if="dataInfo.status === StatusEnum.YBH" @click="clickDelete"
          >删除</t-button
        >
        <t-button
          v-if="dataInfo.status === StatusEnum.WSJ"
          type="primary"
          @click="clickUp"
          >上架</t-button
        >
        <t-button
          v-if="dataInfo.status === StatusEnum.WSJ"
          type="outline"
          @click="clickPreview"
          >预览</t-button
        >
        <t-button v-if="dataInfo.status === StatusEnum.WSJ" @click="clickEdit"
          >编辑</t-button
        >
        <t-button v-if="dataInfo.status === StatusEnum.WSJ" @click="clickDelete"
          >删除</t-button
        >

        <t-button
          v-if="dataInfo.status === StatusEnum.YSJ"
          type="primary"
          @click="clickView"
          >查看</t-button
        >
        <t-button
          v-if="dataInfo.status === StatusEnum.YSJ"
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
          v-if="dataInfo.status === StatusEnum.YSJ"
          name="success"
        ></iconpark-icon>
        <iconpark-icon
          v-if="dataInfo.status === StatusEnum.YBH"
          name="error"
        ></iconpark-icon>
        <iconpark-icon
          v-if="dataInfo.status === StatusEnum.WSJ"
          name="alert"
        ></iconpark-icon>
        <iconpark-icon
          v-if="dataInfo.status === StatusEnum.DSH"
          name="wait"
        ></iconpark-icon>
        <div style="margin-left: 8px">
          商品状态：{{ StatusEnum[dataInfo.status] || '-' }}
        </div>
        <div v-if="dataInfo.status === StatusEnum.DSH">
          ，通过审核后，将同时在本平台和标识网络其他平台同步上架。</div
        >
        <div v-if="dataInfo.status === StatusEnum.YBH">
          ，驳回原因：{{ dataInfo.rejectReason }}</div
        >
      </div>

      <div class="modal-body">
        <div class="archor"
          ><t-affix :offset-top="180">
            <t-anchor>
              <t-anchor-link href="#base" @click.prevent="toAnchor('#base')"
                >基本信息</t-anchor-link
              >
              <t-anchor-link href="#sale" @click.prevent="toAnchor('#sale')"
                >售卖设置</t-anchor-link
              >
              <t-anchor-link
                v-for="(_, index) of dataInfo.productDeliverySetList"
                :key="index"
                :href="'#st' + index"
                @click.prevent="toAnchor('#st' + index)"
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
                {{ dataInfo.name || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品ID">
                {{ dataInfo.id || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品Logo">
                <div class="file-list">
                  <div class="file-container">
                    <div class="file-image">
                      <div class="image-div">
                        <t-image
                          width="100px"
                          height="100px"
                          fit="cover"
                          :src="`/server/web/file/download?name=${dataInfo.logo}`"
                          :preview-visible="imageVisible[`${dataInfo.logo}`]"
                          :preview-props="{
                            src: `/server/web/file/download?name=${dataInfo.logo}`,
                          }"
                          @preview-visible-change="
                            () => (imageVisible[`${dataInfo.logo}`] = false)
                          "
                        />
                        <div class="image-hover">
                          <div class="hover-bg"> </div>
                          <div class="icon-list">
                            <icon-eye
                              :style="{
                                fontSize: '20px',
                                color: '#fff',
                                cursor: 'pointer',
                              }"
                              @click="
                                () => (imageVisible[`${dataInfo.logo}`] = true)
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </t-descriptions-item>
              <t-descriptions-item label="详情展示图">
                <div v-if="detailImageList.length > 0" class="file-list">
                  <div
                    v-for="url of detailImageList"
                    :key="url"
                    class="file-container"
                  >
                    <div class="file-image">
                      <div class="image-div">
                        <t-image
                          width="100px"
                          height="100px"
                          fit="cover"
                          :src="`/server/web/file/download?name=${url}`"
                          :preview-visible="imageVisible[`${url}`]"
                          :preview-props="{
                            src: `/server/web/file/download?name=${url}`,
                          }"
                          @preview-visible-change="
                            () => (imageVisible[`${url}`] = false)
                          "
                        />
                        <div class="image-hover">
                          <div class="hover-bg"> </div>
                          <div class="icon-list">
                            <icon-eye
                              :style="{
                                fontSize: '20px',
                                color: '#fff',
                                cursor: 'pointer',
                              }"
                              @click="() => (imageVisible[`${url}`] = true)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </t-descriptions-item>
              <t-descriptions-item label="商品分类">
                {{ dataInfo.productTypeParentName }} /
                {{ dataInfo.productTypeName }}
              </t-descriptions-item>
              <t-descriptions-item label="商品标签">
                {{ '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="应用类型">
                {{ TypeEnum[dataInfo.type] || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品简介">
                {{ dataInfo.introduction || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="产品使用说明">
                <a
                  :href="`/server/web/file/download?name=${dataInfo.useExplain}`"
                  download
                  >产品使用说明</a
                >
              </t-descriptions-item>
              <t-descriptions-item label="详情展示信息">
                {{
                  dataInfo.detail
                    ? JSON.parse(dataInfo.detail)
                        .map((item: any) => item.moduleName)
                        .join(',')
                    : '-'
                }}
              </t-descriptions-item>
            </t-descriptions>
            <div class="line"></div>
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
                {{ DeliveryTypeEnum[dataInfo.deliveryType ?? 0] }}
              </t-descriptions-item>
              <t-descriptions-item label="商品定价方式">
                {{ PriceTypeEnum[dataInfo.saleType ?? 0] }}
              </t-descriptions-item>
            </t-descriptions>
            <div class="line"></div>
            <div
              v-for="(st, index) of dataInfo.productDeliverySetList"
              :key="index"
              class="line-width"
            >
              <t-descriptions
                :id="'st' + index"
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
                  v-if="dataInfo.deliveryType == 0"
                  label="应用服务地址"
                >
                  {{ st.url }}
                </t-descriptions-item>
                <t-descriptions-item
                  v-if="dataInfo.saleType === 0"
                  label="套餐定价设置"
                >
                  <div
                    v-for="(p, pIndex) of st.accountNumList"
                    :key="p"
                    class="ap"
                    :style="{
                      marginBottom:
                        pIndex == st.accountNumList.length - 1 ? '0' : '8px',
                    }"
                  >
                    套餐{{ pIndex + 1 }}：账号数 {{ p.accountNum }} 个，账号单价
                    {{ p.price }} 元</div
                  >
                </t-descriptions-item>
                <t-descriptions-item
                  v-if="dataInfo.saleType === 0"
                  label="可选购买时长"
                >
                  {{ desDeuration(st.durationList) }}
                </t-descriptions-item>
                <t-descriptions-item
                  v-if="dataInfo.saleType === 1"
                  label="一口价金额"
                >
                  {{ st.accountNumList[0].price }} 元
                </t-descriptions-item>
                <t-descriptions-item label="应用密钥">
                  <a
                    :href="`data:text/plain;charset=utf-8,${encodeURIComponent(
                      st.appSecret
                    )}`"
                    download
                    >下载密钥文件</a
                  >
                </t-descriptions-item>
              </t-descriptions>
              <div
                v-if="
                  dataInfo.productDeliverySetList &&
                  index + 1 !== dataInfo.productDeliverySetList.length
                "
                class="line"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import { Message, Modal } from '@tele-design/web-vue';
import {
  deleteGoods,
  upGoods,
  downGoods,
  goodsDetail,
  preUp,
} from '@/api/goods-manage';

const visible = ref(true);
// 状态
const StatusEnum: { [name: string]: any } = {
  WSJ: 3,
  DSH: 0,
  YBH: 2,
  YSJ: 1,
  3: '未上架',
  0: '上架审核中',
  2: '上架已驳回',
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

const dataInfo = ref<Record<string, any>>({});
const emit = defineEmits(['cancel', 'edit', 'preview']);
const detailImageList = ref<string[]>([]);
const imageVisible: Record<string, any> = ref({});

const statusColor = computed(() => {
  if (dataInfo.value.status === StatusEnum.YSJ) {
    return '#E8F4FF';
  }
  if (dataInfo.value.status === StatusEnum.YSJ) {
    return '#FFECE8';
  }
  return '#FFFAE8';
});

// 交付方式
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SaaS',
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
  dataInfo.value = await goodsDetail(props.data?.id);
  detailImageList.value = dataInfo.value.detailImg
    ? dataInfo.value.detailImg.split(',')
    : [];
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
    emit('cancel');
  });
};
const clickDelete = () => {
  // doDelete(dataInfo.value.id);
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
      doDelete(dataInfo.value.id);
    },
  });
};
const doUp = (id: any) => {
  upGoods(id).then(() => {
    Message.success('上架成功');
    refreshData();
  });
};
const clickUp = async () => {
  // doUp(dataInfo.value.id);
  const r = await preUp(dataInfo.value.id);
  if (r) {
    Modal.warning({
      title: '确定上架该商品吗？',
      titleAlign: 'start',
      content: '商品通过上架审核后，将同时在本平台和标识网络其他平台同步上架。',
      okText: '上架商品',
      hideCancel: false,
      onOk: () => {
        doUp(dataInfo.value.id);
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
        emit('edit');
      },
    });
  }
};

// 下架
const doDown = (id: any) => {
  downGoods(id).then(() => {
    Message.success('商品已下架');
    refreshData();
  });
};
const clickDown = () => {
  // doDown(dataInfo.value.id);
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
      doDown(dataInfo.value.id);
    },
  });
};

const clickView = () => {
  emit('preview', dataInfo.value.id);
};

const toAnchor = (link: string) => {
  const ele = document.getElementById(link);
  ele && ele.scrollIntoView({ block: 'start', behavior: 'smooth' });
};
</script>

<style lang="less" scoped>
.status-div {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
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

      a {
        text-decoration: none;
      }
    }
  }
}

.footer {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.file-container {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100px;
  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }

  .file-image {
    position: relative;
    width: 100px;
    height: 100px;
    background: #f6f7fb;
    border-radius: 2px;

    .image-div {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border: 1px solid #e5e8ef;
      border-radius: 2px;

      .image-hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        padding: 40px 20px;
        border-radius: 2px;
        opacity: 0;

        .hover-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 40px 20px;
          background: #1d2129;
          border-radius: 2px;
          opacity: 0.5;
        }

        .icon-list {
          position: relative;
          z-index: 999;
          display: flex;
          flex-direction: row;
          justify-content: center;
          height: 20px;
        }
      }

      .image-hover:hover {
        opacity: 1;
      }
    }
  }
}
// 线
.line-width {
  width: 100%;
}

.line {
  width: 100%;
  height: 1px;
  margin-bottom: 20px;
  background: #e5e8ef;
}

.ap {
  color: #1d2129;
  font-size: 12px;
  line-height: 20px;
}
</style>
