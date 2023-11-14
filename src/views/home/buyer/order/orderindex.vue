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
          ref="formRef"
          :inline="true"
          :model="formInline"
          class="demo-form-inline search"
        >
          <t-space direction="vertical">
            <t-row class="grid-demo">
              <t-col :span="4">
                <t-form-item :hide-label="true">
                  <div class="elinput" style="width: 90%">
                    <t-input
                      v-model="formInline.commodityName"
                      placeholder="请输入商品名称"
                    ></t-input>
                  </div>
                </t-form-item>
              </t-col>
              <t-col :span="5">
                <t-form-item label="交付类型:">
                  <t-select
                    v-model="formInline.deliveryType"
                    placeholder="全部"
                    style="width: 90%"
                  >
                    <t-option
                      v-for="list in deliveryType"
                      :key="list.value"
                      :label="list.label"
                      :value="list.value"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="5">
                <t-form-item label="订单状态:">
                  <t-select
                    v-model="formInline.orderStatus"
                    :disabled="orderStatusSelect.length === 0"
                    placeholder="全部"
                    style="width: 90%"
                  >
                    <t-option
                      v-for="list in orderStatusSelect"
                      :key="list.value"
                      :label="list.label"
                      :value="list.value"
                    ></t-option>
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :span="7">
                <t-form-item :hide-label="true">
                  <!-- <t-range-picker
                    v-model="formInline.time"
                    format="YYYY-MM-DD HH:mm:ss"
                    range-separator="-"
                    start-placeholder="下单开始时间"
                    end-placeholder="下单结束时间"
                    style="width: 100%"
                  >
                  </t-range-picker> -->
                  <!-- HH:mm:ss -->
                  <t-range-picker
                    v-model="formInline.time"
                    :placeholder="['下单开始时间', '下单结束时间']"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                    @change="onRangeChange"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item :hide-label="true">
                  <t-button
                    type="primary"
                    style="margin: 0 20px 0 20px"
                    @click="getTableData()"
                    >查询
                  </t-button>
                  <t-button @click="clearSearch">重置</t-button>
                </t-form-item>
              </t-col>
            </t-row>
          </t-space>
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
          <div
            v-for="item in tableData"
            :key="item.id"
            style="
              width: 100%;
              margin-bottom: 10px;
              background-color: #fff;
              border: 1px solid #e5e8ef;
            "
          >
            <t-row type="flex">
              <t-col :span="24">
                <div class="grid-contentled">
                  <div class="grid-content-list">
                    {{ item.createTime }}
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">订单号：</span>{{ item.orderNum }}
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">买家：</span
                    >{{ item.customerName }}
                  </div>
                  <div class="grid-content-list">
                    <span class="dingdclass">订单来源：</span
                    >{{ item.orderSource === 0 ? '本平台' : '跨平台' }}
                  </div>
                </div>
              </t-col>
            </t-row>

            <t-row type="flex" class="row-titlelrd aligntext" justify="end">
              <t-col :span="7">
                <div class="grid-content">
                  <div
                    class="imgs"
                    style="float: left; width: 100px; margin: 0 10px 0 16px"
                  >
                    <!-- item.productLogo -->

                    <img
                      style="width: 100px; height: 100px"
                      :src="`/server/web/file/download?name=${item.productLogo}&productId=${item.productId}`"
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
                    {{ item.productName }}
                  </div>
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content bg-purple-light">
                  {{ item.deliveryTypeName }}
                  <p style="color: #86909c"
                    >({{ item.accountCount }}个账号{{
                      item.buyDuration
                    }}个月)</p
                  >
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content"> ¥{{ item.productPrice }}</div>
              </t-col>

              <t-col :span="3">
                <div class="grid-content">¥{{ item.realityPrice }}</div>
              </t-col>
              <t-col :span="2">
                <div class="grid-content">
                  <div
                    v-if="item?.orderStatus === 0"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="tobepaid" alt=""
                    /></span>

                    <span style="float: left">待支付</span>
                  </div>
                  <div
                    v-if="item.orderStatus === 1"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="tobereviewed" alt=""
                    /></span>

                    <span style="float: left">待审核</span>
                  </div>
                  <div
                    v-if="item.orderStatus === 4"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="error" alt=""
                    /></span>

                    <span style="float: left">已驳回</span>
                  </div>
                  <div
                    v-if="item.orderStatus === 2"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="tobereviewed" alt=""
                    /></span>

                    <span style="float: left">待交付</span>
                  </div>
                  <div
                    v-if="item.orderStatus === 5"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="tobereviewed" alt=""
                    /></span>

                    <span style="float: left">待确认交付</span>
                  </div>
                  <div
                    v-if="item.orderStatus === 3"
                    style="display: flex; justify-content: center"
                  >
                    <span style="float: left; padding: 1px 3px 0 0">
                      <img :src="success" alt=""
                    /></span>

                    <span style="float: left">已完成</span>
                  </div>
                </div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content"> {{ item.effectTime }}</div>
              </t-col>
              <t-col :span="3">
                <div class="grid-content">
                  <t-button
                    v-if="item.orderStatus === 0"
                    type="text"
                    style="width: 100%"
                    @click="modificationamount(item.id)"
                    >上传支付凭证</t-button
                  >

                  <!-- v-if="item.orderStatus === 5" -->
                  <t-button
                    v-if="item.orderStatus === 5"
                    type="text"
                    style="width: 100%"
                    @click="delivery(item.id)"
                    >确认已交付</t-button
                  >
                  <span style="cursor: pointer" @click="clickDetail(item.id)"
                    >订单详情</span
                  >
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
        <div style="float: right; margin-top: 10px">
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
    <!-- 上传支付凭证 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.updataamount"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
    ></EditModal>
    <!-- 订单交付 -->
    <!-- <EditModalDelivery
      v-if="deliveryVisible"
      :data="state.editData"
      @confirm="ondeliveryModalConfirm"
      @cancel="deliveryVisible = false"
    ></EditModalDelivery> -->

    <!-- 全屏弹窗 -->
    <!-- <DetailsModalFullscreen
      v-if="FullscreenDetailsModal"
      :data="state.editData"
      @cancel="FullscreenDetailsModal = false"
    >
    </DetailsModalFullscreen> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { Modal, Message } from '@tele-design/web-vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { orderList, orderNum, buyerDeployed } from '@/api/buyer/order';
import noSearch from '@/assets/images/noSearch.png';
import noData from '@/assets/images/noData.png';
import tobepaid from './images/tobepaid.png';
import tobereviewed from './images/tobereviewed.png';
import error from './images/error.png';
import success from './images/success.png';
import EditModal from './components/edit-modal.vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
// import EditModalDelivery from './components/edit-modal-delivery.vue';
// import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';

const router = useRouter();
const formRef = ref();
const formInline = reactive({
  commodityName: '',
  deliveryType: null,
  orderStatus: null,
  time: [],
  startTime: '',
  endTime: '',
  pageNum: 1,
  tabstatus: '',
  pageSize: 10,
  total: 0,
});
const state = reactive({
  editData: {
    id: '',
  },
  updataamount: {
    id: '',
    currentamount: [],
    amount: '',
  },
});
const tableData: Record<string, any> = ref([
  // {
  //   id: '2', // 订单id
  //   orderNum: '2', // 订单号
  //   productName: '', // 商品名称
  //   customerName: '', // 买家名称
  //   productLogo: '', // 商品logo
  //   merchantName: '', // 卖家名称
  //   deliveryTypeName: '', // 交付类型名称
  //   deliveryType: 0, // 交付类型:0-saas类,1-独立部署类
  //   productPrice: 10000, // 商品价格
  //   accountCount: '', // 账号数量
  //   buyDuration: '', // 购买时长
  //   realityPrice: 9400, // 实付金额
  //   orderStatus: 0, // 订单状态0-待支付,1-待审核,2-待交付,3-已完成,4-已驳回,5-卖家交付
  //   orderStatusName: '', // 状态名称
  //   orderStatusInfo: null, // 订单当前所属状态信息(显示内容)
  //   orderSteps: 3, // 订单步骤：1-商品下单，2-买家支付，3-卖家收款，4-服务商交付，5-卖家确认交付，6-完成
  //   rejectType: 0, // 拒绝类型
  //   rejectReasonDetail: '', // 支付凭证审核失败，展示驳回原因
  //   deploymentStatusName: null, // 交付类型为「部署类」部署完成显示该状态
  //   deploymentStatusCode: null, // 交付类型为「部署类」部署完成显示该状态 code
  //   couponMoney: 600, // 优惠金额
  //   userMobile: null, // 联系方式
  //   orderSource: 0, // 订单来源：0-本平台，1-跨平台
  //   effectTime: null, // 成交时间
  //   createTime: '', // 创建时间
  //   dueDate: null, // 到期日期
  //   voucherRejectTime: '', // 驳回时间
  //   payCompleteTime: null, // 支付完成时间
  //   voucherSubmitTime: '', // 提交凭证时间&买家支付时间
  //   confirmDeployedTime: null, // 确认部署时间
  //   merchantDeliverTime: null, // 服务商交付时间
  //   attachmentAddressArr: [],
  //   productId: '', // 商品id
  // },
]);
// 交付类型
const deliveryType = reactive([
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: 'SAAS',
  },
  {
    value: '2',
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
const statusNum = ref<{
  count: number;
  payCount: number;
  auditCount: number;
  deliverCount: number;
  rejectCount: number;
  servicesDeliverCount: number;
  completeCount: number;
}>({
  count: 0, // 全部订单数量
  payCount: 0, // 待支付页数量
  auditCount: 0, // 待审核页数量
  deliverCount: 0, // 待交付数量
  rejectCount: 0, // 已驳回数量
  servicesDeliverCount: 0, // 服务商交付数量
  completeCount: 0, // 已完成数量
});
const activeIndex = ref(0);
const noDatalist = ref(false);
const clickNav = (value: string | null, ins: number) => {
  console.log(value, ins);
  activeIndex.value = ins;
  // @ts-ignore
  formInline.tabstatus = value;
  if (ins === 1) {
    orderStatusSelect.value = [
      {
        label: '待交付',
        value: '2',
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
};
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
    // userInfoByCompany.companyId
    userCompanyId: String(userInfoByCompany.value?.companyId),
  }).then((res) => {
    console.log(res);
    tableData.value = res.records;
    formInline.total = res.total;
  });
};
const dataStatistics = () => {
  orderNum({
    userCompanyId: String(userInfoByCompany.value?.companyId),
    flag: '0',
  }).then((res) => {
    console.log(res, '订单数量');
    // @ts-ignore
    statusNum.value = res;
  });
};
// 上传支付凭证 弹窗 开关
const editModalVisible = ref(false);
// 交付应用 弹窗 开关
// const deliveryVisible = ref(false);

// 全屏弹窗 开关
const FullscreenDetailsModal = ref(false);

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

// 清空查询项
const clearSearchles = () => {};
// 分页 页码发生改变
const getTableDataOne = (current: number) => {
  formInline.pageNum = current;
  init();
};
// 分页 每页条数
const pagesizechange = (pageSize: number) => {
  console.log(pageSize, 'a');
  formInline.pageSize = pageSize;
  init();
};
// 订单详情  凭证审核
const clickDetail = (id: string) => {
  state.editData.id = id;
  router.push({
    name: 'buyerOrderDetail',
    params: {
      id,
    },
  });
  // FullscreenDetailsModal.value = true;
};
// 上传支付凭证 弹窗
const modificationamount = (id: string) => {
  state.updataamount.id = id;
  editModalVisible.value = true;
};
// 上传支付凭证 完成
const onEditModalConfirm = () => {
  editModalVisible.value = false;
  init();
};
// 买家确认交付
const delivery = (id: string) => {
  //  Message.success('上传支付凭证成功');
  buyerDeployed({ id }).then((res) => {
    console.log(res);
    init();
  });
};
// 查询
const getTableData = () => {
  console.log(formInline, 'getTableData');
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
onMounted(() => {
  console.log('执行了');
  init();
  dataStatistics();
});
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
      font-size: 14px;
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

    .cardContent {
      margin-bottom: -20px;

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

      .grid-contentled {
        display: flex;
        justify-content: left;
        width: 98%;
        height: 50px;
        margin: 0 auto;
        color: #4e5969;
        font-weight: 400;
        font-size: 12px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e5e8ef;

        .grid-content-list {
          margin-right: 10px;
        }
      }

      .aligntext {
        text-align: center;
        background: #fff;
      }

      .row-titlelrd {
        width: 100%;
        margin-bottom: 6px;
        padding-top: 10px !important;
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

          .imgs {
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

// .orderClass ::v-deep .tele-input-wrapper {
//   line-height: 1;
//   background-color: red;
//   font-family: 'PingFang SC';
//   font-style: normal;
//   font-weight: 400;
//   font-size: 12px;
//   color: #86909c;
// }
// .orderClass ::v-deep .t-input__inner {
//   padding: 0;
// }
</style>
