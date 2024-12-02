<template>
  <div id="modalWrapIds" class="modalWraps">
    <t-modal
      v-model:visible="showModal"
      fullscreen
      title-align="center"
      :closable="false"
      :footer="null"
      popup-container="#modalWrapIds"
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
              <t-step
                :description="
                  dataList.deliveryType === 0
                    ? ''
                    : dataList.confirmDeployedTime
                "
                >买家确认交付</t-step
              >
              <t-step
                :description="
                  dataList.deliveryType === 0
                    ? dataList.confirmDeployedTime
                    : ''
                "
                >订单已交付</t-step
              >
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
                <t-space class="order-success spacing remove-margin">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>
                  <div
                    v-if="dataList.saleType !== 2"
                    class="order-success-text"
                  >
                    待支付：商品已下单，待买家上传支付凭证并提交审核。
                  </div>

                  <div v-else>
                    <span v-if="dataList.alterPriceStatus === 0">
                      <!-- 待支付-待修改金额 -->
                      待修改金额：尽快修改金额，未修改买家将无法支付。
                    </span>
                    <span v-else>
                      待支付：商品已下单，待买家上传支付凭证并提交审核。
                    </span>
                  </div>
                </t-space>
                <!-- <div
                  v-if="
                    dataList.saleType === 2 && dataList.alterPriceStatus === 0
                  "
                  class="margintop-16"
                >
                  <t-button type="primary" @click="modificationamount"
                    >修改金额
                  </t-button>
                </div> -->
              </div>
              <div v-if="dataList.orderStatus === 1">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text"
                    >待审核：买家已提交支付凭证，请进行审核。
                  </div>
                </t-space>
                <div class="return-ok margintop-16">
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
              </div>
              <div v-if="dataList.orderStatus === 4">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-danger">
                    <icon-close-circle-fill />
                  </div>

                  <div class="order-success-text">
                    已驳回：支付凭证已驳回，待买家重新上传
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
                <div class="order-item-due-date remove-margin">
                  <t-space>
                    <div class="order-item-left">驳回时间</div>
                    <div class="order-item-right">{{
                      dataList.voucherRejectTime || '-'
                    }}</div>
                  </t-space>
                </div>
              </div>
              <div v-if="dataList.orderStatus === 2">
                <t-space class="order-success spacing">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待交付：已确认收款，请完成订单交付。
                  </div>
                </t-space>
                <div>
                  <t-button
                    type="primary"
                    class="margintop-16"
                    @click="delivery"
                    >立即交付</t-button
                  >
                </div>
              </div>
              <div v-if="dataList.orderStatus === 5">
                <t-space class="order-success spacing remove-margin">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待确认交付：已完成交付，待买家确认交付信息。
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
                    >已交付：买家已确认交付，待买家评价
                  </div>
                  <div v-else class="order-success-text">
                    已交付：订单已交付，买家已完成评价。
                  </div>
                </t-space>
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
                  <div>订单来源</div>
                  <t-typography-paragraph>
                    {{ dataList.orderSource === 0 ? '本平台' : '跨平台' }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>买家信息</div>
                  <t-typography-paragraph
                    style="width: 250px"
                    :ellipsis="{
                      rows: 1,
                      showTooltip: true,
                    }"
                  >
                    {{ dataList.customerName }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>联系方式</div>
                  <t-typography-paragraph copyable copy-delay="800">
                    {{ dataList.userMobile }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div v-if="dataList.saleType !== 3" class="informationlist">
                <t-space align="start">
                  <div>支付凭证</div>

                  <div v-if="dataList?.attachmentAddressArr?.length === 0"
                    >待上传</div
                  >
                  <div
                    v-if="dataList?.attachmentAddressArr?.length !== 0"
                    style="float: left"
                  >
                    <!-- style="width: 100px; height: 100px; margin-right: 10px" -->
                    <t-image
                      v-for="(item, index) in dataList?.attachmentAddressArr"
                      :key="index"
                      class="pay-img"
                      width="100"
                      height="100"
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
                      style="float: left; width: 80px; margin: 0 12px"
                    >
                      <img
                        v-if="dataList.productType === 1"
                        :src="`/server/web/file/download?name=${dataList.productLogo}`"
                        alt=""
                      />
                      <img
                        v-else
                        class="pay-img"
                        style="width: 80px; height: 80px"
                        :src="`/server/web/file/orderDownloadBySource?name=${dataList.productLogo}&source=${dataList.productSource}&serverId=${dataList.productServerId}`"
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
                      {{ dataList.productName }}
                    </div>
                  </div>
                </t-col>
                <t-col :span="3" class="margintop-10">
                  <div class="grid-content bg-purple-light">
                    {{ dataList.deliveryType === 0 ? 'SaaS' : '独立部署' }}
                    <p v-if="dataList.saleType === 3" style="color: #86909c"
                      >(免费)
                    </p>
                  </div>
                </t-col>
                <t-col :span="3" class="margintop-10">
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

                <t-col :span="3" class="margintop-10">
                  <div class="grid-content">{{
                    dataList.saleType === 0
                      ? dataList.accountCount + '个'
                      : '不限'
                  }}</div>
                </t-col>
                <t-col :span="2" class="margintop-10">
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
                <t-col
                  :span="
                    dataList.orderStatus === 0 || dataList.orderStatus === 4
                      ? 3
                      : 5
                  "
                  class="margintop-10"
                >
                  <div v-if="dataList.saleType !== 2" class="grid-content">
                    <!-- ¥{{ dataList.realityPrice }} -->
                    <div class="desc">
                      <span class="top">¥{{ dataList.realityPrice }}</span>
                      <p v-if="dataList.couponMoney > 0" class="bottom"
                        >(已优惠:{{ dataList.couponMoney }}元)</p
                      >
                    </div>
                  </div>
                  <div v-if="dataList.saleType === 2" class="grid-content">
                    <span v-if="dataList.alterPriceStatus === 1"
                      >¥{{ dataList.realityPrice }}
                    </span>
                    <span v-else>面议</span>
                  </div>
                </t-col>
                <t-col
                  v-if="
                    [0, 4].includes(dataList.orderStatus) &&
                    dataList.saleType !== 3
                  "
                  :span="3"
                  class="margintop-10"
                >
                  <div class="grid-content">
                    <t-button
                      type="text"
                      style="width: 100%"
                      @click="modificationamount"
                      >修改金额</t-button
                    >
                  </div>
                </t-col>
              </t-row>
            </div>
            <div v-if="dataList.orderStatus === 3">
              <div class="asjhdg-title" style="margin-top: 24px">
                <span class="color-box"></span>
                <span class="text-cls">买家评价</span>
              </div>
              <div v-if="dataList.evaluateStatus === 1" class="reviewContent">
                <div class="row-review">
                  <div>总体评价</div>
                  <t-rate
                    v-model="reviewContent.totalStar"
                    allow-half
                    readonly
                  />
                  <span v-if="reviewContent.totalStar !== 0"
                    >{{ reviewContent.totalStar }}星
                  </span>
                </div>
                <div class="row-review">
                  <div>产品评价</div>
                  <t-rate
                    v-model="reviewContent.productStar"
                    allow-half
                    readonly
                  />
                  <span v-if="reviewContent.productStar !== 0"
                    >{{ reviewContent.productStar }}星</span
                  >
                </div>
                <div class="row-review">
                  <div>服务评价</div>
                  <t-rate
                    v-model="reviewContent.serviceStar"
                    allow-half
                    readonly
                  />
                  <span v-if="reviewContent.serviceStar !== 0"
                    >{{ reviewContent.serviceStar }}星</span
                  >
                </div>
                <div class="row-review">
                  <div>交付评价</div>
                  <t-rate
                    v-model="reviewContent.deliveryStar"
                    allow-half
                    readonly
                  />
                  <span v-if="reviewContent.deliveryStar !== 0"
                    >{{ reviewContent.deliveryStar }}星</span
                  >
                </div>

                <div class="row-review-content marginbottom-15">
                  <div>评价详情</div>
                  <span> {{ reviewContent.content || '-' }}</span>
                </div>
                <div class="row-review-content">
                  <div>评价时间</div>
                  <span> {{ reviewContent.createTime || '-' }}</span>
                </div>
              </div>
              <div v-else class="nodata-cls">
                <img :src="noData" alt="" />
                <div> 暂无评价，订单将在7天后自动评价</div>
              </div>
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
import {
  sellerDetail,
  sellerPass,
  merchantSub,
  getQingFlowCount,
} from '@/api/seller/order';
import { getOrderDetailEstimate } from '@/api/order';
import { orderTypes } from '@/enums/common';
import { Message, Modal } from '@tele-design/web-vue';
import noData from '@/assets/images/noData.png';
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
const dataList = ref<Record<string, any>>({
  id: '1', // 订单id
  orderNum: '1', // 订单号
  productName: '双皮奶', // 商品名称
  customerName: '硕', // 买家名称
  productLogo: '', // 商品logo
  merchantName: '商品所属商家名称', // 卖家名称
  deliveryTypeName: 'SaaS', // 交付类型名称
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
  evaluateStatus: 0, // 评价状态 0-未评价，1-已评价
  productServerId: '',
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

const reviewContent = ref({
  totalStar: 0, // 总体评价
  productStar: 0, // 产品评价
  serviceStar: 0, // 服务评价
  deliveryStar: 0, // 交付评价
  content: '', //  评价内容
  createTime: '', // 评价时间
});

const init = () => {
  sellerDetail({ id: props.data.id }).then((res) => {
    // @ts-ignore
    dataList.value = res;
    if (dataList.value.evaluateStatus === 1) {
      // 获取评价内容
      getOrderDetailEstimate({ orderId: props.data.id }).then((res: any) => {
        reviewContent.value = res;
      });
    }
  });
};

// 点击复制
// const clickCopy = (Num: string) => {
//   utilsCopy(Num);
//   Message.success('复制成功');
// };

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
        productId: dataList.value.productId,
        deliveryType: dataList.value.deliveryType,
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
const clickMerchant = () => {
  merchantSub({
    id: dataList.value.id,
    productId: dataList.value.productId,
    deliveryType: dataList.value.deliveryType,
  }).then((res) => {
    init();
    Message.success('交付成功');
  });
};
// 交付应用
const delivery = () => {
  // 这版交付只有私有部署了,saas免费
  // state.editData.id = dataList.value.id;
  // deliveryVisible.value = true;
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
        if (dataList.value.productType === orderTypes.SPECIAL_SAAS) {
          const packageUserParams = {
            companyId: dataList.value.companyId, // 企业id
            servicePackageId: dataList.value.productId, // 套餐id
          };
          getQingFlowCount(packageUserParams).then(() => {
            clickMerchant();
          });
          return;
        }
        clickMerchant();
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

  :deep(.tele-steps-item-process .tele-steps-item-description) {
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
    width: 1000px;
    height: 100%;
    margin: 0 auto;

    .asjhdg {
      width: 100%;
      height: 100%;
      margin: 36px auto;

      .pay-img {
        margin-right: 10px;
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
            // padding: 10px 0 0 0;
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

            .desc {
              // margin-top: 8px;
              &.payStatus {
                > div {
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  img {
                    width: 12px;
                    height: 12px;
                    margin-right: 4px;
                  }
                }
              }

              .top {
                display: inline-block;
                margin-bottom: 4px;
              }

              .bottom {
                color: #86909c;
                line-height: 20px;
              }
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
    // height: 90px;
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

.margintop-10 {
  margin-top: 10px !important;
}

.marginbottom-15 {
  margin-bottom: 15px !important;
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
