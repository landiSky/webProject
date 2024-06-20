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
      !(
        props.data.status == StatusEnum.YBH ||
        (props.data.status == StatusEnum.WSJ &&
          props.data.source == PlatformEnum.SELF)
      )
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
                {{ formModel.name || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品ID">
                {{ formModel.id || '-' }}
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
                          :src="`/server/web/file/download?name=${formModel.logo}&productId=${formModel.id}`"
                          :preview-visible="imageVisible[`${formModel.logo}`]"
                          :preview-props="{
                            src: `/server/web/file/download?name=${formModel.logo}&productId=${formModel.id}`,
                          }"
                          @preview-visible-change="
                            () => (imageVisible[`${formModel.logo}`] = false)
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
                                () => (imageVisible[`${formModel.logo}`] = true)
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
                          :src="`/server/web/file/download?name=${url}&productId=${formModel.id}`"
                          :preview-visible="imageVisible[`${url}`]"
                          :preview-props="{
                            src: `/server/web/file/download?name=${url}&productId=${formModel.id}`,
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
                {{ formModel.productTypeParentName }}/{{
                  formModel.productTypeName
                }}
              </t-descriptions-item>
              <t-descriptions-item label="商品标签">
                <div
                  v-for="(item, index) in formModel?.tagMap"
                  :key="index"
                  class="product-labels"
                >
                  <t-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                      showTooltip: true,
                    }"
                  >
                    {{ item.tagName }}
                  </t-typography-paragraph>
                </div>
                <div v-if="!formModel?.tagMap?.length">-</div>
              </t-descriptions-item>
              <t-descriptions-item label="应用类型">
                {{ TypeEnum[formModel.type] || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品简介">
                {{ formModel.introduction || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="产品使用说明">
                <a
                  v-for="item in formModel.useExplainMap"
                  :key="item"
                  class="link-href"
                  :href="`/server/web/file/download?name=${item.useExplain}&productId=${formModel.id}`"
                  download
                  >{{ item.useExplainOriginal }}</a
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
              <t-descriptions-item label="服务商名称">
                {{ formModel.companyName || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="所属平台">
                {{ formModel.platformOperationCompany || '-' }}
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
                {{ DeliveryTypeEnum[formModel.deliveryType] || '-' }}
              </t-descriptions-item>
              <t-descriptions-item label="商品定价方式">
                {{ PriceTypeEnum[formModel.saleType] || '-' }}
              </t-descriptions-item>
            </t-descriptions>
            <div
              v-for="(st, index) of formModel.productDeliverySetList"
              :key="index"
              style="width: 100%"
            >
              <div class="line"></div>
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
                  {{ st.name || '-' }}
                </t-descriptions-item>
                <t-descriptions-item
                  v-if="formModel.deliveryType == 0 && formModel.saleType == 3"
                  label="对接SaaS应用"
                >
                  {{ st.application
                  }}<t-link
                    :hoverable="false"
                    style="margin-left: 8px"
                    @click="applicationlink(st.saasAppId)"
                    >查看应用接入信息</t-link
                  >
                </t-descriptions-item>
                <!-- <t-descriptions-item
                  v-if="formModel.deliveryType == 0"
                  label="应用服务地址"
                >
                  {{ st.url || '-' }}
                </t-descriptions-item> -->
                <t-descriptions-item
                  v-if="formModel.saleType === 0"
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
                  v-if="formModel.saleType === 0"
                  label="可选购买时长"
                >
                  {{ desDeuration(st.durationList) || '-' }}
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
                <t-descriptions-item
                  v-if="formModel.saleType !== SaleType.FREE"
                  label="是否支持试用"
                >
                  {{ st.isTry === 1 ? '是' : '否' }}
                </t-descriptions-item>
                <t-descriptions-item v-if="st.isTry === 1" label="试用版本地址">
                  <t-link
                    :hoverable="false"
                    @click="
                      (ev:any) => {
                        ev.view.open(st.tryUrl);
                      }
                    "
                  >
                    {{ st.tryUrl }}
                  </t-link>
                </t-descriptions-item>
                <t-descriptions-item v-if="st.isTry === 1" label="试用账号">
                  {{ st.tryAccount }}
                </t-descriptions-item>
                <t-descriptions-item v-if="st.isTry === 1" label="试用密码">
                  {{ st.tryPwd }}
                </t-descriptions-item>
              </t-descriptions>
              <div
                v-if="
                  formModel.productDeliverySetList &&
                  index + 1 !== formModel.productDeliverySetList.length
                "
                class="line"
              ></div>
            </div>
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
import { operationLogin } from '@/api/operation/sync-class';
import { SaleType } from '@/enums/common';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@tele-design/web-vue';
import RejectModal from './reject-modal.vue';

const router = useRouter();
const loading = ref(true);
const detailImageList = ref<string[]>([]);
const imageVisible: Record<string, any> = ref({});
const rejectVisible = ref(false);
// 交付方式
const DeliveryTypeEnum: { [name: string]: any } = {
  SAAS: 0,
  DLBS: 1,
  0: 'SaaS',
  1: '独立部署',
};

// 定价方式
const PriceTypeEnum: { [name: string]: any } = {
  0: '套餐定价(账号+时长)',
  1: '一口价定价',
  2: '价格面议',
  3: '免费',
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
      detailImageList.value = res.data.detailImg
        ? (res.data.detailImg as string).split(',')
        : [];
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

const doPass = () => {
  verifyGoods({ id: props.data?.id, status: 1 }).then((res) => {
    if (res.code === 200) {
      Message.success('审核已通过');
      getDetail();
    }
  });
};
// 通过
const clickPassBtn = () => {
  Modal.warning({
    title: '确定通过该认证申请吗？',
    titleAlign: 'start',
    content: '',
    okText: '通过',
    hideCancel: false,
    onOk: () => {
      doPass();
    },
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
  const routeData = router.resolve({
    name: 'wowMallPreview',
    params: { id: props.data.id },
  });
  window.open(routeData?.href, '_blank');
};
// 查看
const clickViewBtn = () => {
  clickPreviewBtn();
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
const clickDownBtn = () => {
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
      doDown(props.data?.id);
    },
  });
};
// 上架
const clickUpBtn = () => {
  upGoods(props.data?.id).then((res) => {
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

const clickDeleteBtn = () => {
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
      doDelete(props.data?.id);
    },
  });
};
// 应用跳转详情
const applicationlink = (saasAppId: any) => {
  operationLogin({ appInfoId: saasAppId }).then((res: any) => {
    window.open(res);
  });
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

      .product-labels {
        display: inline-block;
        width: 72px;
        height: 20px;
        margin-left: 8px;
        padding: 0 8px;
        color: rgba(29, 33, 41, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
        text-align: center;
        background: rgba(242, 243, 248, 1);
        border-radius: 2px 0 0 0;
      }

      .product-labels:first-child {
        margin-left: 0;
      }

      a {
        color: #1664ff;
        text-decoration: none;
      }

      .line {
        width: 100%;
        height: 1px;
        margin-top: 4px;
        margin-bottom: 20px;
        background: #e5e8ef;
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

.ap {
  color: #1d2129;
  font-size: 12px;
  line-height: 20px;
}

:deep(.tele-typography) {
  margin-bottom: 0;
}

.link-href {
  margin-left: 12px;
}

.link-href:first-child {
  margin-left: 0;
}
</style>
