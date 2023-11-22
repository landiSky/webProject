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
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待支付：商品已下单，请买家上传支付凭证并提交服务商审核。
                  </div>
                  <t-button
                    type="primary"
                    @click="modificationamount(dataList.id)"
                    >上传凭证</t-button
                  >
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 1">
                <t-space class="order-success">
                  <div class="order-success-icon is-warning">
                    <icon-clock-circle-fill />
                  </div>
                  <div class="order-success-text">
                    待审核：支付凭证已提交，待服务商进行审核。
                  </div>
                </t-space>
              </div>
              <div v-if="dataList.orderStatus === 2">
                <t-space class="order-success">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>
                  <div class="order-success-text">
                    待交付：服务商已确认收款，待完成交付。
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
                      dataList.saleType === 2 || dataList.saleType === 1
                        ? '不限'
                        : dataList.dueDate
                    }}</div>
                  </t-space>
                </div>
              </div>
              <div v-if="dataList.orderStatus === 4">
                <t-space class="order-success">
                  <div class="order-success-icon is-danger">
                    <icon-close-circle-fill />
                  </div>

                  <div class="order-success-text">
                    已驳回：支付凭证已被服务商驳回，请买家重新上传支付凭证。
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
                <t-button type="primary" anew @click="anewupload"
                  >重新上传凭证</t-button
                >
              </div>
              <div v-if="dataList.orderStatus === 5">
                <t-space class="order-success">
                  <div class="order-success-icon is-primary">
                    <icon-clock-circle-fill />
                  </div>

                  <div class="order-success-text">
                    待确认交付：服务商已完成交付，请买家确认交付信息。
                  </div>
                </t-space>
                <div>
                  <t-button type="primary" @click="delivery(dataList.id)"
                    >确认已交付</t-button
                  >
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
                  <div>商家信息</div>
                  <t-typography-paragraph>
                    {{ dataList.merchantName }}
                  </t-typography-paragraph>
                </t-space>
              </div>
              <div class="informationlist">
                <t-space>
                  <div>联系方式</div>
                  <t-typography-paragraph copyable>
                    {{ dataList.sellerPhone }}
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
                      class="pay-img"
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
                        width: 30%;
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
                    <p v-if="dataList.accountCount" style="color: #86909c"
                      >({{ dataList.accountCount }}个账号{{
                        dataList.buyDuration
                      }}个月)</p
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
                    {{
                      dataList.saleType === 0
                        ? dataList.buyDuration + '个月'
                        : '不限'
                    }}</div
                  >
                </t-col>
                <t-col :span="5">
                  <div v-if="dataList.saleType !== 2" class="grid-content">
                    ¥{{ dataList.realityPrice }}
                    <!-- {{
                      String(dataList.realityPrice).indexOf('.') > -1
                        ? ''
                        : '元'
                    }} -->
                    <p style="color: #86909c"
                      >(已优惠：{{ dataList.couponMoney }}元)</p
                    ></div
                  >
                  <div v-if="dataList.saleType === 2" class="grid-content">
                    面议
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
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, defineEmits, ref, onMounted } from 'vue';
import { utilsCopy } from '@/utils/tools';
import { buyerOrderDetail, buyerDeployed } from '@/api/buyer/order';
import { Message, Modal } from '@tele-design/web-vue';
import { useRouter, useRoute } from 'vue-router';

import EditModal from './edit-modal.vue';

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
const emit = defineEmits(['confirm', 'cancel', 'turndowns']);
const showModal = ref(true);
const dataList: Record<string, any> = ref({
  id: '1', // 订单id
  orderNum: '1', // 订单号
  productName: '双皮奶', // 商品名称
  customerName: '硕', // 买家名称
  productLogo:
    'https://img1.baidu.com/it/u=2757919892,1293727771&fm=253&fmt=auto?w=366&h=702', // 商品logo
  merchantName: '商品所属商家名称', // 卖家名称
  deliveryTypeName: 'SAAS', // 交付类型名称
  deliveryType: 1, // 交付类型
  productPrice: 10000, // 商品价格
  accountCount: '10个账号', // 账号数量
  buyDuration: '5个月', // 购买时长
  realityPrice: 10000, // 实付金额
  orderStatus: 4, // 订单状态code 0-待支付,1-待审核,2-待交付,3-已完成,4-已驳回,5-卖家交付
  orderStatusName: '已完成', // 状态名称
  orderStatusInfo: null, // 订单当前所属状态信息(显示内容)
  orderSteps: 5, // 订单步骤
  rejectType: null, // 拒绝类型
  rejectReasonDetail: '未收到支付款；支付金额有误', // 支付凭证审核失败，展示驳回原因
  deploymentStatusName: '已部署', // 交付类型为「部署类」部署完成显示该状态
  deploymentStatusCode: null, // 交付类型为「部署类」部署完成显示该状态 code
  couponMoney: null, // 优惠金额
  userMobile: '15663872182', // 联系方式
  orderSource: 0, // 订单来源：0-本平台，1-跨平台
  effectTime: null, // 成交时间
  createTime: '2023-10-23 16:24:32', // 创建时间
  dueDate: '2023-10-23 18:20:00', // 到期日期
  voucherRejectTime: '2023-10-23 18:24:34', // 驳回时间
  payCompleteTime: null, // 支付完成时间
  voucherSubmitTime: '2023-10-23 18:20:00', // 提交凭证时间&买家支付时间
  confirmDeployedTime: '2023-10-24 10:36:56', // 确认部署时间
  merchantDeliverTime: '2023-09-24 10:23:45', // 服务商交付时间
  attachmentAddressArr: [], // 支付凭证
  productId: '', // 商品id
});

// 上传凭证 弹窗 开关
const editModalVisible = ref(false);

const goback = () => {
  // emit('cancel');
  router.push({
    name: 'buyerOrder',
  });
};

const init = () => {
  // 调后端接口
  buyerOrderDetail({ id: props.orderId }).then((res) => {
    console.log(res, 'res');
    // @ts-ignore
    dataList.value = res;
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
  console.log(id);
  buyerDeployed({ id }).then((res) => {
    console.log(res);
    init();
  });
};
onMounted(() => {
  if (props.orderId) {
    init();
  }
});

// 完成
// const onConfirm = (done: (closed: boolean) => void) => {
//   formRef.value.validate((errors: any) => {
//     if (!errors) {
//       emit('confirm');
//       // 调后端接口
//       // const api = props.data.id ? usersUpdate : usersAdd;
//       // api(formModel.value)
//       //   .then(() => {
//       //     emit('confirm');
//       //     Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
//       //     done(true);
//       //   })
//       //   .catch(() => {
//       //     done(false);
//       //   });

//       // mock数据
//       Message.success(`${props.data.id ? '编辑' : '新增'}用户成功`);
//       done(true);
//     } else {
//       done(false);
//     }
//   });
// };
// 取消
// const canceldes = () => {
//   // console.log('cancel');

//   emit('cancel');
// };
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
      .information {
        .informationlist {
          margin-bottom: 12px;

          .pay-img {
            border: 1px solid #e5e8ef;
            border-radius: 2px;
          }

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
    height: 110px;
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
  }
}
</style>
