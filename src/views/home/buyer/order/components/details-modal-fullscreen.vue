<template>
  <div id="modalWrapId" class="modalWrap">
    <t-modal
      v-model:visible="showModal"
      fullscreen
      title-align="center"
      :closable="false"
      :footer="null"
      popup-container="#modalWrapId"
      @back="goback"
    >
      <template #title>
        <span> 订单详情 </span>
      </template>

      <div class="modal-body">
        <div class="toperror">
          <div style="width: 90%; margin: 30px auto">
            <t-steps
              :current="dataList.orderSteps"
              style=""
              label-placement="horizontal"
            >
              <t-step :description="dataList.createTime">商品下单</t-step>
              <t-step :description="dataList.voucherSubmitTime"
                >买家支付</t-step
              >
              <t-step :description="dataList.payCompleteTime"
                >服务商收款</t-step
              >
              <t-step :description="dataList.merchantDeliverTime"
                >服务商交付</t-step
              >
              <t-step :description="dataList.confirmDeployedTime"
                >买家确认交付</t-step
              >
              <t-step>订单已交付</t-step>
            </t-steps>
          </div>
        </div>
        <div class="centers">
          <div class="asjhdg">
            <div class="asjhdg-title">
              <span class="color-box"></span>
              <span class="text-cls">订单状态</span>
            </div>
            <div class="statusinfo">
              <div v-if="dataList.orderStatus === 0">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div
                    v-if="dataList.sceleType !== 2"
                    class="order-success-text"
                  >
                    待支付：商品已下单，请买家上传支付凭证并提交服务商审核。
                  </div>
                  <div
                    v-if="
                      dataList.saleType === 2 && dataList.alterPriceStatus === 0
                    "
                  >
                    待支付-待卖家修改金额
                  </div>
                </t-space>
                <div
                  v-if="
                    dataList.saleType !== 2 ||
                    (dataList.saleType === 2 && dataList.alterPriceStatus === 1)
                  "
                  class="margintop-16"
                >
                  <t-button
                    type="primary"
                    @click="modificationamount(dataList.id)"
                    >上传凭证
                  </t-button>
                </div>
              </div>
              <div v-if="dataList.orderStatus === 1">
                <t-space class="order-success spacing remove-margin">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>
                  <div class="order-success-text">
                    待审核：支付凭证已提交，待服务商进行审核。
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 2">
                <t-space class="order-success spacing remove-margin">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>
                  <div class="order-success-text">
                    待交付：服务商已确认收款，待完成交付。
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 3">
                <t-space class="order-success spacing">
                  <div class="order-success-icon">
                    <icon-check-circle-fill />
                  </div>

                  <div
                    v-if="dataList.evaluateStatus === 0"
                    class="order-success-text"
                    >已交付：订单已交付，请评价
                  </div>
                  <div v-else class="order-success-text"
                    >已交付：订单已交付。
                  </div>
                </t-space>
                <!-- 后续改为 ===0 -->
                <div
                  v-if="dataList.evaluateStatus !== 0"
                  class="order-item-deploy margintop-16"
                >
                  <t-button type="primary" @click="review(dataList.id)"
                    >立即评价</t-button
                  >
                </div>
                <!-- <div class="order-item-deploy">
                  <t-space>
                    <div class="order-item-left">部署状态</div>
                    <div class="order-item-right">{{
                      dataList.deploymentStatusName
                    }}</div>
                  </t-space>
                </div>
                <div class="order-item-due-date remove-margin">
                  <t-space>
                    <div class="order-item-left">服务到期时间</div>
                    <div class="order-item-right">{{
                      dataList.saleType === 2 || dataList.saleType === 1
                        ? '不限'
                        : dataList.dueDate || '不限'
                    }}</div>
                  </t-space>
                </div> -->
              </div>
              <div v-if="dataList.orderStatus === 4">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-danger">
                    <icon-close-circle-fill />
                  </div>

                  <div class="order-success-text">
                    已驳回：支付凭证已被服务商驳回，请买家重新上传支付凭证。
                  </div>
                </t-space>
                <div class="order-item-deploy margintop-16">
                  <t-space align="start">
                    <div class="order-item-left">驳回原因</div>
                    <!-- <div class="order-item-right">{{
                      dataList.rejectReasonDetail
                    }}</div> -->
                    <div class="text-wrap">
                      {{ dataList.rejectReasonDetail }}
                    </div>
                  </t-space>
                </div>
                <div class="order-item-due-date">
                  <t-space>
                    <div class="order-item-left">驳回时间</div>
                    <div class="order-item-right">{{
                      dataList.voucherRejectTime || '-'
                    }}</div>
                  </t-space>
                </div>
                <t-button
                  class="button-top"
                  type="primary"
                  anew
                  @click="anewupload"
                  >重新上传凭证</t-button
                >
              </div>
              <div v-if="dataList.orderStatus === 5">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待确认交付：服务商已完成交付，请买家确认交付信息。
                  </div>
                </t-space>
                <div class="margintop-16">
                  <t-button type="primary" @click="delivery(dataList.id)"
                    >确认已交付</t-button
                  >
                </div>
              </div>
            </div>
            <div class="asjhdg-title" style="margin-top: 24px">
              <span class="color-box"></span>
              <span class="text-cls">订单信息</span>
            </div>

            <div class="information">
              <div class="informationlist">
                <t-space>
                  <div>订单号</div>
                  <t-typography-paragraph copyable copy-delay="800">
                    {{ dataList.orderNum }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>商家信息</div>

                  <t-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                      showTooltip: true,
                    }"
                  >
                    {{ dataList.merchantName }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>联系方式</div>
                  <t-typography-paragraph copyable copy-delay="800">
                    {{ dataList.sellerPhone }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space align="start">
                  <div>支付凭证</div>

                  <div v-if="dataList?.attachmentAddressArr?.length === 0"
                    >待上传</div
                  >
                  <div
                    v-if="dataList?.attachmentAddressArr?.length !== 0"
                    style="float: left"
                  >
                    <img
                      v-for="(item, index) in dataList?.attachmentAddressArr"
                      :key="index"
                      class="pay-img"
                      style="width: 100px; height: 100px; margin-right: 10px"
                      :src="`/server/web/file/orderDownload?name=${item}`"
                      alt=""
                    />
                  </div>
                </t-space>
              </div>
            </div>

            <div class="asjhdg-title" style="margin-top: 24px">
              <span class="color-box"></span>
              <span class="text-cls">商品信息</span>
            </div>
            <div class="cardContent">
              <t-row type="flex" class="row-title aligntext">
                <t-col :span="7">
                  <div class="grid-content bg-purple-light"></div>
                </t-col>
                <t-col :span="3">
                  <div class="grid-content bg-purple-light">交付类型</div>
                </t-col>
                <t-col :span="3">
                  <div class="grid-content">商品金额</div>
                </t-col>

                <t-col :span="3">
                  <div class="grid-content">账号数量</div>
                </t-col>
                <t-col :span="2">
                  <div class="grid-content">购买时长</div>
                </t-col>
                <t-col :span="5">
                  <div class="grid-content">实付金额</div>
                </t-col>
                <!-- <t-col v-if="dataList.orderStatus === 0" :span="3">
                  <div class="grid-content">操作</div>
                </t-col> -->
              </t-row>
              <!-- justify="end" -->
              <t-row type="flex" class="row-titlelrd aligntextback">
                <t-col :span="7">
                  <div class="grid-content">
                    <div
                      class="imgs"
                      style="float: left; width: 80px; margin: 0 12px"
                    >
                      <!-- dataList.productLogo -->
                      <!-- src="https://img1.baidu.com/it/u=2757919892,1293727771&fm=253&fmt=auto?w=366&h=702" -->
                      <!-- :src="`/server/web/file/download?name=${dataList.productLogo}&productId=${dataList.productId}`" -->
                      <img
                        class="pay-img"
                        style="width: 80px; height: 80px"
                        :src="`/server/web/file/orderDownloadBySource?name=${dataList.productLogo}&source=${dataList.orderSource}&serverId=${dataList.productServerId}`"
                        alt=""
                      />
                    </div>
                    <div
                      style="
                        float: left;
                        width: calc(100% - 104px);
                        margin-top: 10px;
                        line-height: 20px;
                        text-align: left;
                      "
                    >
                      <!-- {{ item.productInfo }} -->
                      {{ dataList.productName }}
                    </div>
                  </div>
                </t-col>
                <t-col :span="3">
                  <div class="grid-content bg-purple-light">
                    {{ dataList.deliveryType === 0 ? 'SaaS' : '独立部署' }}
                    <p v-if="dataList.accountCount" style="color: #86909c"
                      >(
                      <span>{{ dataList.accountCount }}个账号</span>
                      <span v-if="dataList.buyDuration !== '0'"
                        >{{ dataList.buyDuration }}个月</span
                      >
                      <span v-else>不限</span>
                      )</p
                    >
                  </div>
                </t-col>
                <t-col :span="3">
                  <div v-if="dataList.saleType !== 2" class="grid-content"
                    >¥{{ dataList.productPrice }}
                    <!-- {{
                      String(dataList.productPrice).indexOf('.') > -1
                        ? ''
                        : '元'
                    }} -->
                  </div>
                  <div v-if="dataList.saleType === 2" class="grid-content">
                    面议
                  </div>
                </t-col>

                <t-col :span="3">
                  <div class="grid-content">
                    {{
                      dataList.saleType === 0
                        ? dataList.accountCount + '个'
                        : '不限'
                    }}
                  </div>
                </t-col>
                <t-col :span="2">
                  <div class="grid-content">
                    <span v-if="dataList.saleType === 0">
                      {{
                        dataList.buyDuration === '0'
                          ? '不限'
                          : dataList.buyDuration + '个月'
                      }}
                    </span>
                    <span v-else>不限</span>
                  </div>
                </t-col>
                <t-col :span="5">
                  <!--  v-if="dataList.saleType !== 2" -->
                  <div class="grid-content">
                    ¥{{ dataList.realityPrice || 0 }}
                  </div>
                </t-col>
                <!-- <t-col v-if="dataList.orderStatus === 0" :span="3">
                  <div class="grid-content">
                    <t-button
                      type="text"
                      style="width: 100%"
                      @click="modificationamount"
                      >修改金额</t-button
                    >
                  </div>
                </t-col> -->
              </t-row>
            </div>
            <div v-if="dataList.orderStatus === 3">
              <div class="asjhdg-title" style="margin-top: 24px">
                <span class="color-box"></span>
                <span class="text-cls">买家评价</span>
              </div>
              <div v-if="2 == 3" class="reviewContent">
                <div class="row-review">
                  <div>总体评价</div>
                  <t-rate
                    v-model="reviewContent.total"
                    :default-value="0"
                    allow-half
                  />
                  <span v-if="reviewContent.total !== 0"
                    >{{ reviewContent.total }}星
                  </span>
                </div>
                <div class="row-review">
                  <div>产品评价</div>
                  <t-rate
                    v-model="reviewContent.product"
                    :default-value="0"
                    allow-half
                  />
                  <span v-if="reviewContent.product !== 0"
                    >{{ reviewContent.product }}星</span
                  >
                </div>
                <div class="row-review">
                  <div>服务评价</div>
                  <t-rate
                    v-model="reviewContent.server"
                    :default-value="0"
                    allow-half
                  />
                  <span v-if="reviewContent.server !== 0"
                    >{{ reviewContent.server }}星</span
                  >
                </div>
                <div class="row-review">
                  <div>交付评价</div>
                  <t-rate
                    v-model="reviewContent.logistics"
                    :default-value="0"
                    allow-half
                  />
                  <span v-if="reviewContent.logistics !== 0"
                    >{{ reviewContent.logistics }}星</span
                  >
                </div>

                <div class="row-review-content">
                  <div>评价详情</div>
                  <span> {{ reviewContent.content || '-' }}</span>
                </div>
                <div class="row-review-content">
                  <div>评价时间</div>
                  <span> {{ reviewContent.date || '-' }}</span>
                </div>
              </div>
              <div v-else class="nodata-cls">
                <img :src="noData" alt="" />
                <div> 暂无评价，订单将在7天后自动评价</div>
                <div class="review-btn" @click="review(dataList.id)"
                  >立即评价
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </t-modal>
    <!-- 上传支付凭证 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.updataamount"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    ></EditModal>

    <ReviewModal
      v-if="reviewModalVisible"
      :data="state.updataamount"
      @confirm="onRevieModalConfirm"
      @cancel="reviewModalVisible = false"
    >
    </ReviewModal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, defineEmits, ref, onMounted } from 'vue';

import { utilsCopy } from '@/utils/tools';
import { buyerOrderDetail, buyerDeployed } from '@/api/buyer/order';
import { Message, Modal } from '@tele-design/web-vue';
import { useRouter, useRoute } from 'vue-router';
import noData from '@/assets/images/noData.png';
import EditModal from './edit-modal.vue';
import ReviewModal from './review-modal.vue';

const router = useRouter();

const props = defineProps({
  orderId: {
    type: String,
    default: undefined,
  },
});
const state = reactive({
  editData: {
    id: '',
  },
  updataamount: {
    id: '',
    currentamount: [{}],
    // amount: '',
  },
});
const reviewContent = ref({
  total: 0,
  product: 0,
  server: 0,
  logistics: 0,
  content: '8989898989898989',
  date: '2024-10-20',
});

const emit = defineEmits(['confirm', 'cancel', 'turndowns']);
const showModal = ref(true);
const dataList: Record<string, any> = ref({});
const reviewModalVisible = ref(false);
// 上传凭证 弹窗 开关
const editModalVisible = ref(false);
const onRevieModalConfirm = () => {
  reviewModalVisible.value = false;
};
const goback = () => {
  // emit('cancel');
  router.push({
    name: 'buyerOrder',
  });
};

const init = () => {
  // 调后端接口
  buyerOrderDetail({ id: props.orderId }).then((res) => {
    // @ts-ignore
    dataList.value = res;
    console.log('0000', dataList.value);
  });
};

// 点击复制
const clickCopy = (Num: string) => {
  utilsCopy(Num);

  Message.success('复制成功');
};

// 上传支付凭证 弹窗
const modificationamount = (id: string) => {
  // dataList.value.id
  state.updataamount.id = id;
  // state.updataamount.currentamount = dataList.value.attachmentAddressArr;
  editModalVisible.value = true;
};
// 上传支付凭证 完成
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  Message.success('上传成功');
  init();
};
// 重新上传
const anewupload = () => {
  state.updataamount.id = dataList.value.id;
  state.updataamount.currentamount = dataList.value.attachmentAddressArr;
  editModalVisible.value = true;
};
// 确认已交付
const delivery = (id: string) => {
  buyerDeployed({ id }).then((res) => {
    init();
  });
};
const review = (id: string) => {
  console.log('立即评价000');
  reviewModalVisible.value = true;
};

// 关闭弹窗
const closeModal = () => {
  emit('cancel');
};

// 确认弹窗
const confirmModal = () => {
  emit('confirm');
};

// 关闭弹窗
const turndowns = () => {
  emit('turndowns');
};
onMounted(() => {
  if (props.orderId) {
    init();
  }
});
</script>

<style lang="less" scoped>
.title-left {
  margin-left: 10px;
  cursor: pointer;

  span {
    margin-left: 15px;
  }
}

.modalWrap {
  :deep(.tele-modal-body) {
    margin: 0 0 !important;
    padding: 0 0;
  }

  :deep(.tele-steps-item-wait .tele-steps-icon) {
    background-color: #ffff;
  }

  :deep(.tele-steps-item-finish .tele-steps-icon) {
    background-color: #ffff;
  }

  :deep(.tele-steps-item-finish .tele-steps-item-description) {
    // float: left;
    margin-left: -36px;
  }
}

.modal-body {
  height: 100%;
  padding-top: 0;
  // overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }

  .centers {
    display: flex;
    width: 1000px;
    height: 100%;
    margin: 0 auto;

    .asjhdg {
      width: 100%;
      height: 100%;
      margin: 36px auto;
      // margin-top: 15px;
      .pay-img {
        border: 1px solid #e5e8ef;
        border-radius: 2px;
      }

      .information {
        .informationlist {
          margin-bottom: 12px;

          :deep(.tele-space-item) {
            &:first-child {
              margin-right: 12px !important;
              color: #4e5969;
            }
          }

          .tele-typography {
            margin-bottom: 0;
          }
        }
      }

      .statusinfo {
        width: 100%;
        padding: 20px;
        border: 1px solid #e5e8ef;
        border-radius: 2px;
      }

      .cardContent {
        margin-bottom: 20px;

        .row-title {
          width: 100%;
          height: 40px;
          // margin-bottom: 12px;
          border-radius: 2px;

          .grid-content {
            height: 40px;
            color: #4e5969;
            font-weight: 400;
            font-size: 12px;
            font-family: 'PingFang SC';
            font-style: normal;
            line-height: 35px;
            // background-color: #f2f3f8;
          }
        }

        .aligntext {
          text-align: center;
          background: #f2f3f8;
        }

        .row-titlelrd {
          width: 100%;
          margin-bottom: 6px;
          border-radius: 2px;

          .grid-content {
            padding: 12px 0;
            // height: 20px;
            color: #1d2129;
            font-weight: 400;
            font-size: 12px;
            font-family: 'PingFang SC';
            font-style: normal;
            line-height: 20px;
            // background-color: #fff;
            &::after {
              display: block;
              clear: both;
              height: 0;
              visibility: hidden;
              content: '';
            }

            .imgs {
              height: 80px;
            }
          }
        }

        .aligntextback {
          text-align: center;
          border: 1px solid #e5e8ef;
          border-top: none;
          // background: #f2f3f8;
        }
      }

      .reviewContent {
        padding: 16px;
        background-color: #f6f7fb;

        .row-review {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 4px;
          color: #4e5969;
          font-size: 12px;

          > div {
            margin-right: 12px;
          }

          ::v-deep(.tele-icon) {
            width: 20px;
            height: 20px;
          }
        }

        .row-review-content {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin: 10px 0;
          color: #4e5969;
          font-size: 12px;

          > div {
            margin-right: 12px;
          }

          > span {
            max-width: 600px;
            overflow: hidden;
            color: #1d2129;
            white-space: normal;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .row-review-content:last-of-type {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin: 0;
          color: 1d2129;
          font-size: 12px;

          > div {
            margin-right: 12px;
          }

          > span {
            color: #1d2129;
          }
        }
      }

      .nodata-cls {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        padding: 16px;
        color: #86909c;
        font-size: 12px;
        background-color: #f6f7fb;

        .review-btn {
          margin-top: 4px;
          color: #1664ff;
          cursor: pointer;
        }
      }
    }
  }

  .toperror {
    float: left;
    width: 100%;
    // height: 110px;
    background-color: #f2f3f8;
  }
}

.asjhdg-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;

  .color-box {
    float: left;
    width: 4px;
    height: 12px;
    margin-right: 8px;
    background-color: #1664ff;
  }

  .text-cls {
    float: left;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }
}

.margintop-16 {
  margin-top: 16px;
}

.order-success {
  .order-success-icon {
    color: #00aa2a;
    font-size: 16px;

    &.is-primary {
      color: #1664ff;
    }

    &.is-warning {
      color: #fa9600;
    }

    &.is-danger {
      color: #e63f3f;
    }
  }

  .order-success-text {
    color: #1d2129;
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
  }
}

:deep(.tele-space-item) {
  margin-right: 12px !important;
}

.spacing {
  :deep(.tele-space-item) {
    margin-right: 8px !important;
  }
}

.order-success {
  // margin-bottom: 16px;
  color: var(--t-41-d-2129, #1d2129);
  font-weight: 500;
  font-size: 14px;

  /* CN/标题/14-Medium-迷你 */
  font-family: PingFang SC;
  font-style: normal;
  line-height: 22px; /* 157.143% */
}

.remove-margin {
  margin-bottom: 0 !important;
}

.order-item-due-date,
.order-item-deploy {
  margin-bottom: 12px;
}

.order-item-left {
  color: var(--f-64-e-5969, #4e5969);
  font-weight: 400;
  font-size: 12px;
  font-family: PingFang SC;
  font-style: normal;
  line-height: 20px; /* 166.667% */
  text-align: right;
}

.order-item-right {
  color: var(--f-71-d-2129, #1d2129);
  font-weight: 400;
  font-size: 12px;

  /* 12/CN-Regular-pingfang */
  font-family: PingFang SC;
  font-style: normal;
  line-height: 20px; /* 166.667% */
}

.text-wrap {
  width: 886px;
  word-wrap: break-word;
  word-break: normal;
}

.button-top {
  margin-top: 4px;
}
</style>
