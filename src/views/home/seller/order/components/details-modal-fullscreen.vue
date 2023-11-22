<template>
  <div id="modalWrapIds" class="modalWraps">
    <t-modal
      v-model:visible="showModal"
      fullscreen
      title-align="start"
      :closable="false"
      :footer="null"
      popup-container="#modalWrapIds"
      @back="goback"
    >
      <template #title>
        <span style="margin-left: 42%"> 订单详情 </span>
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
              <t-step>订单完成</t-step>
            </t-steps>
          </div>
        </div>
        <div class="centers">
          <div class="asjhdg">
            <div class="asjhdg-title">
              <span
                style="
                  float: left;
                  width: 4px;
                  height: 12px;
                  margin-right: 8px;
                  background-color: #1664ff;
                "
              >
              </span>
              <span
                style="
                  float: left;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 22px;
                "
                >订单状态</span
              >
            </div>
            <div class="statusinfo">
              <div v-if="dataList.orderStatus === 0">
                <t-space class="order-success">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待支付：商品已下单，待买家上传支付凭证并提交审核。
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 1">
                <t-space class="order-success">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text"
                    >待审核：买家已提交支付凭证，请进行审核。
                  </div>
                  <div class="return-ok">
                    <t-button
                      type="primary"
                      status="danger"
                      style="margin-right: 10px"
                      @click="turndownsyhn"
                      >驳回</t-button
                    >
                    <t-button type="primary" @click="passok(dataList.id)"
                      >通过</t-button
                    >
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 4">
                <t-space class="order-success">
                  <div class="order-success-icon is-danger">
                    <icon-close-circle-fill />
                  </div>

                  <div class="order-success-text">
                    已驳回：支付凭证已驳回，待买家重新上传
                  </div>
                </t-space>
                <div class="order-item-deploy">
                  <t-space>
                    <div class="order-item-left">驳回原因</div>
                    <!-- <div class="order-item-right">{{
                      dataList.rejectReasonDetail
                    }}</div> -->
                    <t-typography-paragraph
                      style="float: right; margin-bottom: 0"
                      :ellipsis="{
                        rows: 1,
                        showTooltip: true,
                      }"
                    >
                      {{ dataList.rejectReasonDetail }}
                    </t-typography-paragraph>
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
              </div>
              <div v-if="dataList.orderStatus === 2">
                <t-space class="order-success">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待交付：已确认收款，请完成订单交付。
                  </div>
                  <t-button type="primary" @click="delivery">立即交付</t-button>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 5">
                <t-space class="order-success">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待确认交付：已完成交付，待买家确认交付信息。
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 3">
                <t-space class="order-success">
                  <div class="order-success-icon">
                    <icon-check-circle-fill />
                  </div>

                  <div class="order-success-text">已完成：订单已完成。</div>
                </t-space>

                <div class="order-item-deploy">
                  <t-space>
                    <div class="order-item-left">部署状态</div>
                    <div class="order-item-right">{{
                      dataList.deploymentStatusName
                    }}</div>
                  </t-space>
                </div>
                <div class="order-item-due-date">
                  <t-space>
                    <div class="order-item-left">服务到期时间</div>
                    <div class="order-item-right">{{
                      dataList.dueDate || '-'
                    }}</div>
                  </t-space>
                </div>
              </div>
            </div>
            <div class="asjhdg-title" style="margin-top: 24px">
              <span
                style="
                  float: left;
                  width: 4px;
                  height: 12px;
                  margin-right: 8px;
                  background-color: #1664ff;
                "
              >
              </span>
              <span
                style="
                  float: left;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 22px;
                "
                >订单信息</span
              >
            </div>

            <div class="information">
              <div class="informationlist">
                <t-space>
                  <div>订单号</div>
                  <t-typography-paragraph copyable>
                    {{ dataList.orderNum }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>订单来源</div>
                  <t-typography-paragraph>
                    {{ dataList.orderSource === 0 ? '本平台' : '跨平台' }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>买家信息</div>
                  <t-typography-paragraph>
                    {{ dataList.customerName }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>联系方式</div>
                  <t-typography-paragraph copyable>
                    {{ dataList.userMobile }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space align="start">
                  <div>支付凭证</div>

                  <div v-if="dataList.attachmentAddressArr.length === 0"
                    >待上传</div
                  >
                  <div
                    v-if="dataList.attachmentAddressArr.length !== 0"
                    style="float: left"
                  >
                    <img
                      v-for="(item, index) in dataList.attachmentAddressArr"
                      :key="index"
                      style="width: 70px; height: 70px; margin-right: 10px"
                      :src="`/server/web/file/orderDownload?name=${item}`"
                      alt=""
                    />
                  </div>
                </t-space>
              </div>
            </div>
            <div class="asjhdg-title" style="margin-top: 24px">
              <span
                style="
                  float: left;
                  width: 4px;
                  height: 12px;
                  margin-right: 8px;
                  background-color: #1664ff;
                "
              >
              </span>
              <span
                style="
                  float: left;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 22px;
                "
                >商品信息</span
              >
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
                <t-col
                  :span="
                    dataList.orderStatus === 0 || dataList.orderStatus === 4
                      ? 3
                      : 5
                  "
                >
                  <div class="grid-content">实付金额</div>
                </t-col>
                <t-col
                  v-if="
                    dataList.orderStatus === 0 || dataList.orderStatus === 4
                  "
                  :span="3"
                >
                  <div class="grid-content">操作</div>
                </t-col>
              </t-row>
              <!-- justify="end" -->
              <t-row type="flex" class="row-titlelrd aligntextback">
                <t-col :span="7">
                  <div class="grid-content">
                    <div
                      class="imgs"
                      style="float: left; width: 100px; margin: 0 10px 0 16px"
                    >
                      <!-- dataList.productLogo -->
                      <!-- src="https://img1.baidu.com/it/u=2757919892,1293727771&fm=253&fmt=auto?w=366&h=702" -->
                      <img
                        style="width: 100px; height: 100px"
                        :src="`/server/web/file/download?name=${dataList.productLogo}&productId=${dataList.productId}`"
                        alt=""
                      />
                    </div>
                    <div
                      style="
                        float: left;
                        width: 50%;
                        margin-top: 5px;
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
                    {{ dataList.deliveryType === 0 ? 'SAAS' : '独立部署' }}
                    <!-- <p style="color: #86909c"
                      >({{ dataList.accountCount
                      }}{{ dataList.buyDuration }})</p
                    > -->
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
                  <div class="grid-content">{{
                    dataList.saleType === 0
                      ? dataList.accountCount + '个'
                      : '不限'
                  }}</div>
                </t-col>
                <t-col :span="2">
                  <div class="grid-content">
                    {{
                      dataList.saleType === 0
                        ? dataList.buyDuration + '个月'
                        : '不限'
                    }}</div
                  >
                </t-col>
                <t-col
                  :span="
                    dataList.orderStatus === 0 || dataList.orderStatus === 4
                      ? 3
                      : 5
                  "
                >
                  <div v-if="dataList.saleType !== 2" class="grid-content">
                    ¥{{ dataList.realityPrice }}
                    <!-- {{
                      String(dataList.couponMoney).indexOf('.') > -1 ? '' : '元'
                    }} -->
                    <p style="color: #86909c"
                      >(已优惠：{{ dataList.couponMoney }}
                      <!-- {{
                        String(dataList.couponMoney).indexOf('.') > -1
                          ? ''
                          : '元'
                      }} -->元 )</p
                    ></div
                  >
                  <div v-if="dataList.saleType === 2" class="grid-content">
                    面议
                  </div>
                </t-col>
                <t-col
                  v-if="
                    (dataList.orderStatus === 0 && dataList.saleType !== 2) ||
                    dataList.orderStatus === 4
                  "
                  :span="3"
                >
                  <div class="grid-content">
                    <t-button
                      type="text"
                      style="width: 100%"
                      @click="modificationamount"
                      >修改优惠金额</t-button
                    >
                  </div>
                </t-col>
              </t-row>
            </div>
          </div>
        </div>
      </div>
    </t-modal>
    <!-- 修改金额 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.updataamount"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisibleflag"
    ></EditModal>
    <!-- 驳回弹窗 -->
    <EditModalTurndown
      v-if="turndownVisible"
      :data="state.editData"
      @confirm="turndownModalConfirm"
      @cancel="turndownVisible = false"
    ></EditModalTurndown>
    <!-- 订单交付 -->
    <EditModalDelivery
      v-if="deliveryVisible"
      :data="state.editData"
      @confirm="ondeliveryModalConfirm"
      @cancel="deliveryVisible = false"
    ></EditModalDelivery>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, defineEmits, ref, onMounted } from 'vue';
import { utilsCopy } from '@/utils/tools';
import { sellerDetail, sellerPass, merchantSub } from '@/api/seller/order';

import { Message, Modal } from '@tele-design/web-vue';

import EditModal from './edit-modal.vue';
import EditModalTurndown from './edit-modal-turndown.vue';
import EditModalDelivery from './edit-modal-delivery.vue';

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});
const state = reactive({
  editData: {
    id: '',
  },
  updataamount: {
    id: '',
    currentamount: 0,
    amount: '',
    orderid: '',
  },
});
const emit = defineEmits(['confirm', 'cancel', 'turndowns']);
const showModal = ref(true);
const dataList = ref({
  id: '1', // 订单id
  orderNum: '1', // 订单号
  productName: '双皮奶', // 商品名称
  customerName: '硕', // 买家名称
  productLogo: '', // 商品logo
  merchantName: '商品所属商家名称', // 卖家名称
  deliveryTypeName: 'SAAS', // 交付类型名称
  deliveryType: 1, // 交付类型:0-saas类,1-独立部署类
  productPrice: 10000, // 商品价格
  accountCount: '10个账号', // 账号数量
  buyDuration: '5个月', // 购买时长
  realityPrice: 10000, // 实付金额
  orderStatus: 5, // 订单状态code 0-待支付,1-待审核,2-待交付,3-已完成,4-已驳回,5-卖家交付
  orderStatusName: '已完成', // 状态名称
  orderStatusInfo: null, // 订单当前所属状态信息(显示内容)
  orderSteps: 6, // 订单步骤
  rejectType: null, // 拒绝类型
  rejectReasonDetail: '未收到支付款；支付金额有误', // 支付凭证审核失败，展示驳回原因
  deploymentStatusName: null, // 交付类型为「部署类」部署完成显示该状态
  deploymentStatusCode: null, // 交付类型为「部署类」部署完成显示该状态 code
  couponMoney: null, // 优惠金额
  userMobile: '15663872182', // 联系方式
  orderSource: 0, // 订单来源：0-本平台，1-跨平台
  effectTime: '2023-10-23 16:24:32', // 成交时间
  createTime: '2023-10-23 16:24:32', // 创建时间
  dueDate: '2023-10-23 18:20:00', // 到期日期
  voucherRejectTime: '2023-10-23 18:24:34', // 驳回时间
  payCompleteTime: null, // 支付完成时间
  voucherSubmitTime: '2023-10-23 18:20:00', // 提交凭证时间&买家支付时间
  confirmDeployedTime: '2023-10-24 10:36:56', // 确认部署时间
  merchantDeliverTime: '2023-09-24 10:23:45', // 服务商交付时间
  saleType: 0, // 1-一口价定价,2-面议
  attachmentAddressArr: [], // 支付凭证
  productId: '', // 商品id
});
// 修改金额 弹窗 开关
const editModalVisible = ref(false);
// 驳回弹窗 开关
const turndownVisible = ref(false);
// 交付应用 弹窗 开关
const deliveryVisible = ref(false);
const goback = () => {
  emit('cancel');
};

const init = () => {
  sellerDetail({ id: props.data.id }).then((res) => {
    // @ts-ignore
    dataList.value = res;
  });
};

// 点击复制
const clickCopy = (Num: string) => {
  utilsCopy(Num);
  Message.success('复制成功');
};

// 修改金额 弹窗
const modificationamount = () => {
  state.updataamount.id = dataList.value.id;
  state.updataamount.currentamount = dataList.value.realityPrice;
  state.updataamount.orderid = dataList.value.orderNum;
  editModalVisible.value = true;
};
// 修改金额 完成
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  init();
  Message.success('金额修改成功');
};
const editModalVisibleflag = () => {
  editModalVisible.value = false;
};
// 驳回
const turndownsyhn = () => {
  state.editData.id = dataList.value.id;
  turndownVisible.value = true;
};
// 驳回 完成
const turndownModalConfirm = () => {
  turndownVisible.value = false;
  init();
  Message.success('驳回成功');
};

// 通过

const passok = (id: string) => {
  // function onBeforeOk(done: (closed: boolean) => void) {
  //   setTimeout(() => {
  //     done(true);
  //     Message.success('审核成功');
  //   }, 2 * 1000);
  // }
  Modal.warning({
    title: '我已收到交易款项，同意通过该凭证。',
    content: '审核通过后，订单将交易完成。',
    titleAlign: 'start',
    okText: ' 确定',
    hideCancel: false,
    // onBeforeOk,
    // okButtonProps: {
    //   status: 'danger',
    // },
    onOk: () => {
      // deleteUsers(params);
      // onBeforeOk;
      sellerPass({
        id: dataList.value.id,
      }).then((res) => {
        Message.success('已通过');
        init();
      });
    },
    onCancel: () => {
      // Message.success('取消交付成功');
    },
  });
};
// 交付应用
const delivery = () => {
  if (dataList.value.deliveryType === 0) {
    Modal.warning({
      title: '我已完成账号重置，确定交付该应用',
      content: '交付订单流转到买家确定状态。',
      titleAlign: 'start',
      okText: ' 确定',
      hideCancel: false,
      // okButtonProps: {
      //   status: 'danger',
      // },
      onOk: () => {
        // deleteUsers(params);
        merchantSub({
          id: dataList.value.id,
        }).then((res) => {
          init();
          Message.success('交付成功');
        });
      },
      onCancel: () => {
        // Message.success('取消交付成功');
      },
    });
  } else if (dataList.value.deliveryType === 1) {
    state.editData.id = dataList.value.id;
    deliveryVisible.value = true;
  }
};
// 交付应用 完成
const ondeliveryModalConfirm = () => {
  deliveryVisible.value = false;
  init();
};

onMounted(() => {
  if (props.data?.id) {
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

.modalWraps {
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
    margin-left: -36px;
  }
}

.modal-body {
  height: 100%;
  padding-top: 0;
  overflow: auto;
  background-color: #fff;

  .tele-form {
    max-width: 652px;
  }

  .centers {
    display: flex;
    width: 74%;
    height: 100%;
    margin-left: 13%;

    .asjhdg {
      width: 100%;
      height: 100%;
      margin: 36px auto;

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
            padding: 10px 0 0 0;
            // height: 20px;
            color: #1d2129;
            font-weight: 400;
            font-size: 12px;
            font-family: 'PingFang SC';
            font-style: normal;
            line-height: 20px;
            // background-color: #fff;
          }
        }

        .aligntextback {
          text-align: center;
          border: 1px solid #e5e8ef;
          border-top: none;
          // background: #f2f3f8;
        }
      }
    }
  }

  .toperror {
    float: left;
    width: 100%;
    height: 90px;
    background-color: #f2f3f8;
  }
}

.asjhdg-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
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

    .return-ok {
      width: 100%;
    }
  }
}

.order-item-deploy {
  margin-top: 16px;
}

.order-item-due-date {
  margin-top: 12px;
}

.order-item-left {
  margin-right: 12px;
  color: #4e5969;
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
  line-height: 20px;
  text-align: right;
}

.order-item-right {
  color: #1d2129;
  font-weight: 400;
  font-size: 12px;
  font-style: normal;
  line-height: 20px;
}
</style>
