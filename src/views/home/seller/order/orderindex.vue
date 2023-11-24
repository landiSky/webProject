<template>
  <!-- 卖家订单中心 -->
  <div class="contain">
    <div class="content-heard">
      <div class="heard-name">订单管理</div>
      <div class="cardclass">
        <ul v-for="(item, index) in orderStatusTypeNav" :key="index">
          <li @click="clickNav(item.value, index)">
            <a :class="{ activecclass: activeIndex === index }"
              >{{ item.label }}
              <a class="status_counts">
                {{
                  item.label === '待支付'
                    ? '(' + (statusNum.payCount + statusNum.rejectCount) + ')'
                    : ''
                }}
              </a>
              <a class="status_counts">
                {{
                  item.label === '待审核'
                    ? '(' + statusNum.auditCount + ')'
                    : ''
                }}
              </a>
              <a class="status_counts">
                {{
                  item.label === '待交付'
                    ? '(' +
                      (statusNum.deliverCount +
                        statusNum.servicesDeliverCount) +
                      ')'
                    : ''
                }}
              </a>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="orderClass">
      <div class="order">
        <t-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline search"
        >
          <t-spin>
            <t-row>
              <t-col flex="196px" style="margin-right: 12px">
                <t-input
                  v-model="formInline.commodityName"
                  placeholder="请输入商品名称"
                ></t-input>
              </t-col>
              <t-col flex="220px" style="margin-right: 12px">
                <t-select v-model="formInline.deliveryType" placeholder="全部">
                  <template #prefix> 交付类型: </template>
                  <t-option
                    v-for="list in deliveryType"
                    :key="list.value"
                    :label="list.label"
                    :value="list.value"
                  ></t-option>
                </t-select>
              </t-col>
              <t-col flex="220px" style="margin-right: 12px">
                <t-select
                  v-model="formInline.orderStatus"
                  :disabled="orderStatusSelect.length === 0"
                  placeholder="全部"
                  allow-clear
                >
                  <template #prefix> 订单状态: </template>
                  <t-option
                    v-for="list in orderStatusSelect"
                    :key="list.value"
                    :label="list.label"
                    :value="list.value"
                  ></t-option>
                </t-select>
              </t-col>
              <t-col flex="372px" style="margin-right: 12px">
                <t-range-picker
                  v-model="formInline.time"
                  :placeholder="['下单开始时间', '下单结束时间']"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                  @change="onRangeChange"
                />
              </t-col>
              <t-col flex="auto">
                <t-button
                  type="primary"
                  style="margin-right: 8px"
                  @click="getTableData()"
                  >查询
                </t-button>
                <t-button style="background-color: #fff" @click="clearSearch"
                  >重置</t-button
                >
              </t-col>
            </t-row>
          </t-spin>
        </t-form>
      </div>
      <div class="cardContent">
        <t-row type="flex" class="row-title aligntext" justify="end">
          <t-col :span="3">
            <div class="grid-content bg-purple-light">交付类型</div>
          </t-col>
          <t-col :span="3">
            <div class="grid-content">商品金额</div>
          </t-col>

          <t-col :span="3">
            <div class="grid-content">实付金额</div>
          </t-col>
          <t-col :span="2">
            <div class="grid-content">订单状态</div>
          </t-col>
          <t-col :span="3">
            <div class="grid-content">成交时间</div>
          </t-col>
          <t-col :span="3">
            <div class="grid-content">操作</div>
          </t-col>
        </t-row>

        <div v-if="tableData.length > 0" style="width: 100%">
          <div v-for="item in tableData" :key="item.id" class="listWraper">
            <t-row type="flex">
              <t-col :span="24">
                <div class="grid-contentled">
                  <div class="grid-content-list">
                    <span></span>
                    <span>{{ item.createTime }}</span>
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">订单号：</span>
                    <span>{{ item.orderNum }}</span>
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">买家：</span>
                    <span>{{ item.customerName }}</span>
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">订单来源：</span
                    ><span>{{
                      item.orderSource === 0 ? '本平台' : '跨平台'
                    }}</span>
                  </div>
                </div>
              </t-col>
            </t-row>

            <t-row type="flex" class="row-titlelrd aligntext" justify="end">
              <t-col :span="7">
                <div class="grid-content">
                  <div class="imgs">
                    <!-- :src="`/server/web/file/download?name=${item.productLogo}&productId=${item.productId}`" -->
                    <img
                      :src="`/server/web/file/orderDownloadBySource?name=${item.productLogo}&source=${item.orderSource}&serverId=${item.productServerId}`"
                      alt=""
                    />
                  </div>
                  <div class="title">
                    {{ item.productName }}
                  </div>
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content bg-purple-light">
                  <div class="desc">
                    <span class="top">{{ item.deliveryTypeName }}</span>
                    <p v-if="item.saleType === 0" class="bottom"
                      >({{ item.accountCount }}个账号{{
                        item.buyDuration
                      }}个月)</p
                    >
                  </div>
                </div>
              </t-col>
              <t-col :span="3">
                <div v-if="item.saleType !== 2" class="grid-content">
                  <div class="desc"> ¥{{ item.productPrice }}</div>
                </div>
                <div v-if="item.saleType === 2" class="grid-content">
                  <div class="desc">面议</div>
                </div>
              </t-col>

              <t-col :span="3">
                <div v-if="item.saleType !== 2" class="grid-content">
                  <div class="desc">
                    <span class="top">¥{{ item.realityPrice }}</span>
                    <p class="bottom">(已优惠:{{ item.couponMoney }}元)</p>
                  </div>
                </div>
                <div v-if="item.saleType === 2" class="grid-content">
                  <div class="desc">面议</div></div
                >
              </t-col>
              <t-col :span="2">
                <div class="grid-content">
                  <div class="desc payStatus">
                    <div v-if="item.orderStatus === 0">
                      <img :src="tobepaid" alt="" />
                      <span style="float: left">待支付</span>
                    </div>
                    <div v-if="item.orderStatus === 1">
                      <img :src="tobereviewed" alt="" />
                      <span style="float: left">待审核</span>
                    </div>
                    <div v-if="item.orderStatus === 4">
                      <img :src="error" alt="" />
                      <span style="float: left">已驳回</span>
                    </div>
                    <div v-if="item.orderStatus === 2">
                      <img :src="tobereviewed" alt="" />
                      <span style="float: left">待交付</span>
                    </div>
                    <div v-if="item.orderStatus === 5">
                      <img :src="tobepaid" alt="" />
                      <span style="float: left">待确认交付</span>
                    </div>
                    <div v-if="item.orderStatus === 3">
                      <img :src="success" alt="" />
                      <span style="float: left">已完成</span>
                    </div>
                  </div>
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content">
                  <div class="desc">{{
                    item.effectTime ? item.effectTime : '--'
                  }}</div>
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content">
                  <div class="desc">
                    <!-- v-if="item.orderStatus === 0 && item.saleType !== 2" -->
                    <t-button
                      v-if="
                        (item.orderStatus === 0 && item.saleType !== 2) ||
                        item.orderStatus === 4
                      "
                      type="text"
                      style="width: 100%"
                      @click="
                        modificationamount(
                          item.id,
                          item.orderNum,
                          item.realityPrice
                        )
                      "
                      >修改优惠金额</t-button
                    >
                    <t-button
                      v-if="item.orderStatus === 1"
                      type="text"
                      style="width: 100%"
                      @click="clickDetail(item.id)"
                      >凭证审核</t-button
                    >
                    <!-- v-if="item.orderStatus === 5" -->
                    <t-button
                      v-if="item.orderStatus === 2"
                      type="text"
                      style="width: 100%"
                      @click="delivery(item.deliveryType, item.id)"
                      >交付应用</t-button
                    >
                    <span style="cursor: pointer" @click="clickDetail(item.id)"
                      >订单详情</span
                    >
                  </div>
                </div>
              </t-col>
            </t-row>
          </div>
        </div>
        <div
          v-if="formInline.total === 0 && noDatalist === true"
          class="noClass"
        >
          <div>
            <img :src="noSearch" alt="" />
            <div>
              <span class="zwjg">暂无查询结果</span>

              <span class="qkclass" @click="clearSearchles()">清空查询项</span>
            </div>
          </div>
        </div>
        <div
          v-if="formInline.total === 0 && noDatalist === false"
          class="noClass"
        >
          <div>
            <img :src="noData" alt="" />
            <div class="zwclass">暂无数据</div>
          </div>
        </div>

        <!-- 分页组件 -->
        <!-- <div v-if="formInline.total >= 10">
          <Pagination
            :total="formInline.total"
            :page.sync="formInline.pageNum"
            :limit.sync="formInline.pageSize"
            @pagination="getTableDataOne"
          ></Pagination>
        </div> -->
        <div class="pageWraper">
          <t-pagination
            v-if="formInline.total > 10"
            :total="formInline.total"
            size="medium"
            :page-size="formInline.pageSize"
            :current="formInline.pageNum"
            show-total
            show-jumper
            show-page-size
            :page-size-options="[10, 15, 20, 25]"
            @change="getTableDataOne"
            @page-size-change="pagesizechange"
          />
        </div>
      </div>
    </div>
    <!-- 修改金额 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.updataamount"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    ></EditModal>
    <!-- 订单交付 -->
    <EditModalDelivery
      v-if="deliveryVisible"
      :data="state.editData"
      @confirm="ondeliveryModalConfirm"
      @cancel="deliveryVisible = false"
    ></EditModalDelivery>

    <!-- 全屏弹窗 -->
    <DetailsModalFullscreen
      v-if="FullscreenDetailsModal"
      :data="state.editData"
      @cancel="FullscreenDetailsModal = false"
    >
    </DetailsModalFullscreen>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';
import { orderList, merchantSub, orderNum } from '@/api/seller/order';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import noSearch from '@/assets/images/noSearch.png';
import noData from '@/assets/images/noData.png';
import tobepaid from './images/tobepaid.png';
import tobereviewed from './images/tobereviewed.png';
import error from './images/error.png';
import success from './images/success.png';

import EditModal from './components/edit-modal.vue';
import EditModalDelivery from './components/edit-modal-delivery.vue';
import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';

const userStore = useUserStore();
const {
  userInfo,
  selectCompany,
  userInfoByCompany,
}: Record<string, any> = storeToRefs(userStore);
const formInline = reactive({
  commodityName: '',
  deliveryType: null,
  orderStatus: null,
  time: [],
  startTime: '',
  endTime: '',
  tabstatus: '',
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const state = reactive({
  editData: {
    id: '',
  },
  updataamount: {
    id: '',
    currentamount: 0,
    orderid: '',
    amount: '',
  },
});
// 查询 状态
const noDatalist = ref(false);
// list
const tableData: Record<string, any> = ref([]);
// 交付类型
const deliveryType = reactive([
  {
    value: '',
    label: '全部',
  },
  {
    value: '0',
    label: 'SaaS',
  },
  {
    value: '1',
    label: '独立部署',
  },
]);
// 订单状态1
const orderStatusTypeNav = reactive([
  {
    label: '全部订单',
    value: null,
  },
  {
    label: '待支付',
    value: '0',
  },
  {
    label: '待审核',
    value: '1',
  },
  {
    label: '待交付',
    value: '2',
  },
  {
    label: '已完成',
    value: '3',
  },
]);
// 订单状态2
const orderStatusSelect = ref([
  {
    label: '待支付',
    value: '0',
  },
  {
    label: '待审核',
    value: '1',
  },
  {
    label: '待交付',
    value: '2',
  },
  {
    label: '已完成',
    value: '3',
  },
  {
    label: ' 已驳回',
    value: '4',
  },
  {
    label: ' 待确认交付',
    value: '5',
  },
]);
// tab 状态数量
const statusNum: Record<string, any> = ref({
  count: 0, // 全部订单数量
  payCount: 0, // 待支付页数量
  auditCount: 0, // 待审核页数量
  deliverCount: 0, // 待交付数量
  rejectCount: 0, // 已驳回数量
  servicesDeliverCount: 0, // 服务商交付数量
  completeCount: 0, // 已完成数量
});
const activeIndex = ref(0);
const init = () => {
  orderList({
    // 商品名称
    productName: formInline.commodityName,
    // 交付类型:0-saas类,1-独立部署类
    deliveryType: formInline.deliveryType,
    // 订单状态:0-待支付,1-待审核,2-待交付,3-已完成,4-已驳回,5-卖家交付
    orderStatus: formInline.orderStatus,
    // tab页:0-待支付,1-待审核,2-待交付,3-已完成,全部订单-null
    tabPage: formInline.tabstatus,
    // 订单创建时间-起始,pattern='yyyy-MM-dd HH:mm:ss'
    createStart: formInline.startTime,
    // 订单创建时间-结束,pattern='yyyy-MM-dd HH:mm:ss'
    createEnd: formInline.endTime,
    pageSize: formInline.pageSize,
    pageNum: formInline.pageNum,
    // String(userInfoByCompany.value.companyId),
    userCompanyId: userInfoByCompany.value.companyId,
  }).then((res) => {
    tableData.value = res.records;
    //  @ts-ignore
    formInline.total = res.total;
  });
};
const clickNav = (value: string | null, ins: number) => {
  activeIndex.value = ins;
  formInline.pageNum = 1;
  // @ts-ignore
  formInline.tabstatus = value;
  formInline.deliveryType = null;
  formInline.commodityName = '';
  formInline.time = [];
  formInline.startTime = '';
  formInline.endTime = '';
  formInline.orderStatus = null;
  formInline.pageNum = 1;
  noDatalist.value = false;
  if (ins === 1) {
    orderStatusSelect.value = [
      // {
      //   label: '待交付',
      //   value: '2',
      // },
      {
        label: '待支付',
        value: '0',
      },
      {
        label: ' 已驳回',
        value: '4',
      },
    ];
  } else if (ins === 3) {
    orderStatusSelect.value = [
      {
        label: '待交付',
        value: '2',
      },

      {
        label: ' 待确认交付',
        value: '5',
      },
    ];
  } else if (ins === 0) {
    orderStatusSelect.value = [
      {
        label: '待支付',
        value: '0',
      },
      {
        label: '待审核',
        value: '1',
      },
      {
        label: '待交付',
        value: '2',
      },
      {
        label: '已完成',
        value: '3',
      },
      {
        label: ' 已驳回',
        value: '4',
      },
      {
        label: ' 待确认交付',
        value: '5',
      },
    ];
  } else {
    orderStatusSelect.value = [];
  }
  init();
};
// 修改金额 弹窗 开关
const editModalVisible = ref(false);
// 交付应用 弹窗 开关
const deliveryVisible = ref(false);

// 全屏弹窗 开关
const FullscreenDetailsModal = ref(false);

const dataStatistics = () => {
  orderNum({
    userCompanyId: String(userInfoByCompany.value?.companyId),
    flag: '1',
  }).then((res) => {
    statusNum.value = res;
  });
};
onMounted(() => {
  init();
  dataStatistics();
});
// 时间框选择格式是：年月日，接口入参需要加上时分秒
const onRangeChange = (
  value: (Date | string | number | undefined)[] | undefined
) => {
  if (value) {
    const [startDate, endDate] = value || [];
    [formInline.startTime, formInline.endTime] = [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`,
    ];
  } else {
    formInline.startTime = '';
    formInline.endTime = '';
  }
};
// 查询
const getTableData = () => {
  formInline.pageNum = 1;
  noDatalist.value = true;
  init();
};
// 重置
const clearSearch = () => {
  formInline.deliveryType = null;
  formInline.commodityName = '';
  formInline.time = [];
  formInline.startTime = '';
  formInline.endTime = '';
  formInline.orderStatus = null;

  formInline.pageNum = 1;
  noDatalist.value = false;
  init();
};

// 清空查询项
const clearSearchles = () => {
  formInline.deliveryType = null;
  formInline.commodityName = '';
  formInline.time = [];
  formInline.startTime = '';
  formInline.endTime = '';
  formInline.orderStatus = null;

  formInline.pageNum = 1;
  noDatalist.value = false;
  init();
};
// 分页 页码发生改变
const getTableDataOne = (current: number) => {
  formInline.pageNum = current;
  init();
};
// 分页 每页条数
const pagesizechange = (pageSize: number) => {
  formInline.pageSize = pageSize;
  init();
};
// 订单详情  凭证审核
const clickDetail = (id: string) => {
  state.editData.id = id;
  FullscreenDetailsModal.value = true;
};
// 修改金额 弹窗
const modificationamount = (
  id: string,
  orderNum: string,
  productPrice: number
) => {
  state.updataamount.id = id;
  state.updataamount.orderid = orderNum;
  state.updataamount.currentamount = productPrice;
  editModalVisible.value = true;
};
// 修改金额 完成
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  init();
};
// 交付应用
const delivery = (deliveryType: number, id: string) => {
  if (deliveryType === 0) {
    Modal.warning({
      title: '我已完成账号重置，确定交付该应用',
      content: '交付订单流转到买家确定状态。',
      titleAlign: 'start',
      okText: ' 确定',
      hideCancel: false,
      // onBeforeOk,
      // okButtonProps: {
      //   status: 'danger',
      // },
      onOk: () => {
        // deleteUsers(params);
        merchantSub({
          id: state.editData.id,
        }).then((res) => {
          init();
          Message.success('交付成功');
        });
      },
      onCancel: () => {
        // Message.success('取消交付成功');
      },
    });
  } else if (deliveryType === 1) {
    state.editData.id = id;
    deliveryVisible.value = true;
  }
};
// 交付应用 完成
const ondeliveryModalConfirm = () => {
  deliveryVisible.value = false;
  init();
};
</script>

<style lang="less" scoped>
.contain {
  width: 100%;
  height: auto;
  min-height: 100%;
  background: #f6f7fb;

  .content-heard {
    box-sizing: border-box;
    height: 100px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    .heard-name {
      padding: 24px 0 0 24px;
      color: #1d2129;
      font-weight: 600;
      font-size: 16px;
      font-family: 'PingFang SC';
      font-style: normal;
      line-height: 24px;
    }

    .cardclass {
      display: flex;
      margin-top: 5px;

      .status_counts {
        color: #1664ff;
        font-weight: 400;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        margin: 20px 16px 0 24px;
        color: #4e5969;
        font-weight: 400;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
        cursor: pointer;
      }

      li:hover {
        color: #165dff;
      }

      .nav-active {
        color: #165dff;
      }

      .activecclass {
        padding: 5px 0;
        color: #1664ff;
        font-weight: 600;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
        border-bottom: 2px solid #1664ff;
      }
    }
  }

  .orderClass {
    box-sizing: border-box;
    width: 98%;
    height: 100%;
    margin: 16px auto;
    background: #f6f7fb;

    :deep(.tele-input-wrapper) {
      background-color: #fff;
    }

    :deep(.tele-select-view-single) {
      background-color: #fff;
    }

    :deep(.tele-picker-size-medium) {
      background-color: #fff;
    }

    :deep(.tele-form-item-label-col) {
      background-color: #ffff;
    }

    :deep(.tele-form-item-label-col) {
      justify-content: flex-start;
    }

    :depp(.tele-form-item-label-col > .tele-form-item-label) {
      width: 60px;
    }

    :deep(.tele-form-item-label-col) {
      padding-right: 0;
      // padding-left: 10px;
      // text-align: center;
    }

    .order {
      margin-bottom: 15px;
    }

    .cardContent {
      margin-bottom: -20px;

      .pageWraper {
        display: flex;
        justify-content: end;
        margin-top: 4px;

        :deep(.tele-pagination) {
          margin-bottom: 32px;
        }
      }

      .row-title {
        width: 100%;
        margin-bottom: 12px;
        border-radius: 2px;

        .grid-content {
          height: 40px;
          color: #4e5969;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
          line-height: 40px;
          background-color: #fff;
        }
      }

      .listWraper {
        width: 100%;
        margin-bottom: 12px;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 2px;
      }

      .grid-contentled {
        display: flex;
        justify-content: left;
        width: 98%;
        height: 40px;
        margin-left: 12px;
        padding-left: 4px;
        // height: 40px;
        // margin-left: 16px;
        // margin: 0 auto;
        color: #4e5969;
        font-weight: 400;
        font-size: 12px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e5e8ef;

        .grid-content-list {
          display: flex;
          align-items: center;
          margin-right: 24px;
          font-weight: 400;
          font-size: 12px;
          line-height: 20px; /* 166.667% */

          span:first-child {
            color: #86909c;
          }

          span:last-child {
            color: #4e5969;
          }
        }
      }

      .aligntext {
        // height: 40px;
        text-align: center;
        background: #fff;
      }

      .row-titlelrd {
        width: 100%;
        // margin-bottom: 6px;
        padding-top: 12px;
        border-radius: 2px;

        .grid-content {
          height: 20px;
          // padding: 13px 0 0 10px;
          color: #1d2129;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
          line-height: 20px;
          background-color: #fff;

          .desc {
            margin-top: 8px;

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

          .imgs {
            float: left;
            // width: 100px;
            margin: 0 10px 12px 12px;

            img {
              width: 80px;
              height: 80px;
              border: 1px solid #e5e8ef;
              border-radius: 2px;
            }
          }

          .title {
            float: left;
            margin-top: 8px;
            color: #1d2129;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
          }
        }
      }

      .noClass {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 500px;
        color: #86909c;
        font-weight: 400;
        font-size: 12px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 20px;
        text-align: center;

        .zwclass {
          color: #86909c;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
          line-height: 20px;
          text-align: center;
        }

        .qkclass {
          margin-left: 4px;
          color: #1664ff;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
          line-height: 20px;
          cursor: pointer;
        }

        .zwjg {
          color: #86909c;
          font-weight: 400;
          font-size: 12px;
          font-family: 'PingFang SC';
          font-style: normal;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
