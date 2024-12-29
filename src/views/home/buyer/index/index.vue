<template>
  <div class="cverbox">
    <!-- 买家中心概览 头部 -->
    <div class="left-section">
      <!-- 轻应用待办 -->
      <LightFlowTodoView v-if="configInfo?.qingFlowSwitch" />

      <ApplicationGuide v-if="userInfoByCompany.primary !== 2"
        >应用使用引导</ApplicationGuide
      >
      <!-- 标识轻应用 -->
      <ServiceActivation v-if="configInfo?.qingFlowSwitch" />
      <!-- 已够应用展示 -->
      <PurchasedAppView />
    </div>
    <div class="right-section">
      <div class="headers">
        <div style="width: '100%'';; margin: 0 auto">
          <!-- 用户信息 -->
          <div class="tops">
            <div class="imgs">
              <img :src="avatar" alt="" />
            </div>
            <div class="rights">
              <t-typography-paragraph
                :ellipsis="{
                  rows: 1,
                  showTooltip: true,
                }"
                class="name"
                >{{ userInfoByCompany?.username || userInfo?.mobile }}
              </t-typography-paragraph>
              <div class="inofs">
                <div
                  v-if="
                    userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED ||
                    userInfoByCompany.certificateStatus ===
                      CompanyAuthStatus.AUTHED
                  "
                  class="inofslist"
                >
                  <div style="max-width: 750px">
                    <ellipsis
                      class="companyname"
                      :copy="false"
                      :value="userInfoByCompany.companyName || '暂未认证'"
                    >
                    </ellipsis>
                  </div>

                  <p>|</p
                  ><p>{{
                    userInfoByCompany.companyId
                      ? AccountTypeDesc[userInfoByCompany.primary]
                      : '-'
                  }}</p
                  ><p>|</p>
                  <div
                    v-if="userInfoByCompany?.entPrefixList?.length"
                    class="extPrefix"
                  >
                    <span
                      v-for="(
                        item, index
                      ) in userInfoByCompany?.entPrefixList?.slice(0, 2)"
                      :key="index"
                    >
                      {{ item }}
                      <span
                        v-if="
                          userInfoByCompany?.entPrefixList?.length > 1 &&
                          index === 0
                        "
                        >、</span
                      >
                    </span>
                    <t-popover
                      position="bottom"
                      :title="`全部前缀（${userInfoByCompany.entPrefixList?.length}）`"
                    >
                      <t-link v-if="entPrefixListSuffix?.length"
                        >更多前缀 ({{
                          userInfoByCompany.entPrefixList?.length
                        }})</t-link
                      >
                      <template #content>
                        <div class="popover-bottom">
                          <div
                            v-for="(
                              item, index
                            ) in userInfoByCompany.entPrefixList"
                            :key="index"
                            >{{ item }}</div
                          >
                        </div>
                      </template>
                    </t-popover>
                    <span class="divider">|</span>
                  </div>
                </div>

                <p
                  class="statuslist"
                  :class="[
                    userInfoByCompany.certificateStatus ===
                      CompanyAuthStatus.AUTHED ||
                    userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED
                      ? 'authenticated'
                      : 'notcertified',
                  ]"
                  >{{
                    userInfoByCompany.certificateStatus ===
                      CompanyAuthStatus.AUTHED ||
                    userInfoByCompany.nodeStatus === NodeAuthStatus.AUTHED
                      ? '已认证'
                      : '未认证'
                  }}</p
                >
              </div>
            </div>
          </div>
          <!-- 使用指导 v-if="userInfoByCompany.nodeStatus !== 1" -->
          <div
            v-if="userInfoByCompany.certificateStatus !== NodeAuthStatus.AUTHED"
            class="direction"
          >
            <div class="dirleft">
              <div class="titleleft">
                <h3 style="margin-bottom: 24px">使用引导 </h3>
                <div class="dirlist">
                  <div>
                    <img :src="group1" alt="" />
                    <span class="dirlist-step">完成企业认证</span>
                    <div class="btns">
                      <p style="margin: 10px 0 12px"> 确定企业身份</p>
                      <t-button
                        v-if="
                          !userInfoByCompany.companyId ||
                          userInfoByCompany.certificateStatus ===
                            CompanyAuthStatus.UNAUTH
                        "
                        type="text"
                        class="dirlist-btn"
                        @click="authentication"
                        >去认证</t-button
                      >

                      <div v-else class="states">
                        <p
                          style="
                            width: 50px;
                            padding: 3px;
                            font-size: 12px;
                            text-align: center;
                          "
                          :class="
                            stateClass[userInfoByCompany.certificateStatus]
                          "
                          >{{
                            CompanyAuthStatusDESC[
                              userInfoByCompany.certificateStatus
                            ]
                          }}</p
                        >

                        <span
                          v-if="
                            [
                              CompanyAuthStatus.TO_CHECK,
                              CompanyAuthStatus.REJECT,
                            ].includes(userInfoByCompany.certificateStatus)
                          "
                          style="font-size: 12px"
                          ><t-button
                            type="text"
                            class="dirlist-btn"
                            @click="viewdetails"
                            >查看详情</t-button
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                  <div>
                    <p class="ition"></p>
                    <img :src="group2" alt="" />
                    <span class="dirlist-step">企业成员管理</span>
                    <div class="btns">
                      <p style="margin: 10px 0 12px">
                        管理企业组织架构&成员权限</p
                      >
                      <t-button
                        type="text"
                        class="dirlist-btn"
                        @click="distributionrole()"
                      >
                        邀请成员/分配权限</t-button
                      >
                    </div></div
                  >

                  <div>
                    <p class="ition"></p>
                    <img :src="group3" alt="" />
                    <span class="dirlist-step">浏览开通应用</span>
                    <div class="btns">
                      <p style="margin: 10px 0 12px"> 搜索购买开通应用</p>
                      <t-button type="text" class="dirlist-btn" @click="tomall"
                        >去应用商城
                      </t-button>
                    </div>
                  </div>
                  <div>
                    <p class="ition"></p>
                    <img :src="group4" alt="" />
                    <span class="dirlist-step">企业中心使用应用</span>
                    <div class="btns">
                      <p style="margin: 10px 0"> 应用配置，使用应用</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 企业认证 -->
            <div class="firmright">
              <div class="firm">
                <div class="firm-title">企业认证</div
                ><span
                  style="padding: 1px 8px; line-height: 22px"
                  :class="stateClass[userInfoByCompany.certificateStatus]"
                  >{{
                    CompanyAuthStatusDESC[userInfoByCompany.certificateStatus]
                  }}</span
                >
              </div>
              <div
                class="fimelist"
                style="float: left; width: 90%; font-size: 12px"
              >
                <p style="margin: 12px 0 0 0">开通权益:</p>
                <ul style="margin-left: 10px">
                  <li style="width: 100%">
                    <span></span><span style="float: left">使用限免应用</span>
                  </li>
                  <li style="width: 100%">
                    <span></span><span>免费上架应用，跨平台推广</span>
                  </li>
                  <li> <span></span><span>免费使用开发者能力</span> </li>
                </ul>
                <div class="fimelistdata">
                  <t-button
                    v-if="
                      !userInfoByCompany.companyId ||
                      userInfoByCompany.certificateStatus ===
                        CompanyAuthStatus.UNAUTH
                    "
                    type="primary"
                    class="dirlist-btn"
                    style="display: block; margin: 12px auto 0"
                    @click="authentication"
                    >去认证</t-button
                  >

                  <div v-else class="states">
                    <p
                      v-if="
                        [
                          CompanyAuthStatus.TO_CHECK,
                          CompanyAuthStatus.REJECT,
                        ].includes(userInfoByCompany.certificateStatus)
                      "
                      style="width: 80px; margin: 12px auto 0; font-size: 12px"
                    >
                      <t-button type="text" @click="viewdetails"
                        >查看详情</t-button
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人用户信息 -->

      <!-- 快捷导航 -->
      <div class="card-view">
        <div class="head">
          <div class="head-icon">
            <iconpark-icon name="overview-nav-icon" size="20px" />
          </div>
          <div class="head-title">快捷导航</div>
        </div>
        <div class="middle">
          <div class="nav" @click="goNewApplication">
            <div>
              <iconpark-icon name="overview-identity-icon" size="20px" />
            </div>
            <div class="nav-title">标识轻应用管理</div>
          </div>
          <div class="nav" @click="goSign">
            <div>
              <iconpark-icon name="overview-identity-icon" size="20px" />
            </div>
            <div class="nav-title">标识管理中心企业节点认证</div>
          </div>
        </div>
      </div>
      <!-- 买家订单概览 -->
      <div class="card-view">
        <div class="head">
          <div class="head-icon">
            <iconpark-icon name="overview-nav-icon" size="20px" />
          </div>
          <div class="head-title">买家订单概览</div>
        </div>
        <div class="middle">
          <div
            v-for="(item, index) in orderOverall"
            :key="index"
            class="goods-list goods-list-4"
          >
            <div class="head-name">{{ item.title }}</div>
            <div class="block">
              <div
                v-if="(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number">
                  {{ (orderList[item.field] || '').toLocaleString() || 0 }}
                </span>
                <span class="unit">项</span>
              </div>
              <div
                v-if="!(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number"> -- </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 应用资产概览 -->
      <div class="card-view">
        <div class="head">
          <div class="head-icon">
            <iconpark-icon name="overview-nav-icon" size="20px" />
          </div>
          <div class="head-title">应用资产概览</div>
        </div>
        <div class="middle middle-wrap">
          <div
            v-for="(item, index) in propertyOverall"
            :key="index"
            class="goods-list goods-list-2"
          >
            <div class="head-name">{{ item.title }}</div>
            <div class="block">
              <div
                v-if="(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number">
                  {{ (orderList[item.field] || '').toLocaleString() || 0 }}
                </span>
                <span class="unit">项</span>
              </div>
              <div
                v-if="!(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number"> -- </span>
              </div>
              <t-divider
                style="border-bottom-color: #c9cdd4"
                type="dashed"
                :margin="4"
              />
              <div class="desc">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发布商品概览 -->
      <div class="card-view">
        <div class="head">
          <div class="head-icon">
            <iconpark-icon name="overview-nav-icon" size="20px" />
          </div>
          <div class="head-title">发布商品概览</div>
        </div>
        <div class="middle">
          <div
            v-for="(item, index) in goodsOverall"
            :key="index"
            class="goods-list goods-list-4"
          >
            <div class="head-name">{{ item.title }}</div>
            <div class="block">
              <div
                v-if="(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number">
                  {{ (orderList[item.field] || '').toLocaleString() || 0 }}
                </span>
                <span class="unit">项</span>
              </div>
              <div
                v-if="!(orderList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number"> -- </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 认证指南 -->
    <EditModal
      v-if="editModalVisible"
      :data="state.editData"
      @confirm="onEditModalConfirm"
      @cancel="editModalVisible = false"
      @hasdflag="hasdflags"
    ></EditModal>
    <!-- 企业认证 填写信息弹窗 -->
    <EditModalFullscreen
      v-if="gotoverifys"
      :data="state.editData"
      @confirm="onEditModalConfirmcode"
      @cancel="cancelgotoverifys"
    >
    </EditModalFullscreen>
    <!-- 详情弹窗 -->
    <DetailsModalFullscreen
      v-if="detailflag"
      :data="state.editData"
      @confirm="onEditModalConfirmflag"
      @cancel="detailflagclick"
    >
    </DetailsModalFullscreen>
    <!-- \v-show="false" -->

    <AuthModal
      v-if="authModalVisible"
      @confirm="onAuthModalConfirm"
      @cancel="authModalVisible = false"
    ></AuthModal>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Modal, Message } from '@tele-design/web-vue';

import {
  orderOver,
  authDialogdata,
  orderGo,
  selectSelfApps,
  appInfoClientLogin,
  alreadyBuyClientLogin,
  apiAuthStatus,
  apiGetAuth,
  appCreateRedirect,
} from '@/api/buyer/overview';

import EditModal from '@/components/dataoverview/components/edit-modal.vue';

import EditModalFullscreen from '@/components/dataoverview/components/edit-modal-fullscreen.vue';

import DetailsModalFullscreen from '@/components/dataoverview/components/details-modal-fullscreen.vue';

import { useRouter, useRoute } from 'vue-router';
// import EditModalAlter from '@/components/home/edit-modal-alter.vue';
// import EditModalAlter from '@/components/home/edit-modal-alter.vue';
import { useUserStore } from '@/store/modules/user';
import {
  AppType,
  AccountType,
  AccountTypeDesc,
  CompanyAuthStatus,
  CompanyAuthStatusDESC,
  NodeAuthStatus,
  NodeAuthStatusDESC,
} from '@/enums/common';
import { sm2 } from '@/utils/encrypt';
// import { fileDownloadto2 } from '@/api/file';

import AuthModal from '@/components/auth-modal/index.vue';
import ellipsis from '@/components/ellipsis/index.vue';
import { apiDataPoint } from '@/api/data-point';
import { snmsClientLogin } from '@/api/login';
import ApplicationGuide from './components/ApplicationGuide.vue';
import avatar from './image/avatar.png';
import group1 from './image/group1.png';
import group2 from './image/group2.png';
import group3 from './image/group3.png';
import group4 from './image/group4.png';

// import frame from './image/frame.png';

// import EditModal from './components/edit-modal.vue';
// import EditModalFullscreen from './components/edit-modal-fullscreen.vue';
// import DetailsModalFullscreen from './components/details-modal-fullscreen.vue';
// 服务开通
import ServiceActivation from './components/service-activation.vue';
// 已够应用展示页面
import PurchasedAppView from './components/purchased-app-view.vue';
// 轻流待办展示页面
import LightFlowTodoView from './components/lightflow-todo.vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const {
  userInfo,
  selectCompany,
  userInfoByCompany,
  configInfo,
}: Record<string, any> = storeToRefs(userStore);

const authModalVisible = ref(false);

const stateClass = {
  [CompanyAuthStatus.TO_CHECK]: 'tobereviewed',
  [CompanyAuthStatus.AUTHED]: 'authenticated',
  [CompanyAuthStatus.REJECT]: 'override',
  [CompanyAuthStatus.UNAUTH]: 'notcertified',
};
const nodeStateClass = {
  [NodeAuthStatus.TO_CHECK]: 'tobereviewed',
  [NodeAuthStatus.AUTHED]: 'authenticated',
  [NodeAuthStatus.REJECT]: 'override',
  [NodeAuthStatus.UNAUTH]: 'notcertified',
};
// const nodeStateText = {
//   [TextStatus.TO_CHECK]: 'tobereviewed',
//   [TextStatus.AUTHED]: 'authenticated',
//   [TextStatus.REJECT]: 'override',
//   [TextStatus.UNAUTH]: 'notcertified',
// };

// 认证状态
// const stateles = ref({
//   companyStatus: 3, // 认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
//   nodeStatus: 0, // 节点认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
// });

// 前缀后几个 tooltip 显示
const entPrefixListSuffix = computed(() => {
  const arr = userInfoByCompany.value?.entPrefixList;
  // arr =
  if (Array.isArray(arr) && arr.length > 2) {
    return arr.slice(2);
  }
  return [];
});
const state = reactive({
  editData: {
    id: '1111',
    // 0是提交认证 1是修改认证
    statusled: 0,
  },
});
// tabs来回切换值
const tabsApplication = ref(1);
// 立即认证弹窗
const editModalVisible = ref(false);
// 去认证弹窗
const gotoverifys = ref(false);
// 详情弹窗
const detailflag = ref(false);

// //已购应用
const authDialogVisible: Record<string, any> = ref([]);
// 订单概览
const orderList = ref<Record<string, any>>({
  count: 0, // 全部订单数量
  payCount: 0, // 待支付页数量
  auditCount: 0, // 待审核页数量
  deliverCount: 0, // 待交付数量
  rejectCount: 0, // 已驳回数量
  servicesDeliverCount: 0, // 服务商交付数量
  completeCount: 0, // 已完成数量
});
// 订单概览
const orderOverall = [
  // {
  //   title: '全部订单',
  //   field: 'count',
  // },
  {
    title: '待交付',
    field: 'deliverCount',
  },
  {
    title: '已完成',
    field: 'completeCount',
  },
  {
    title: '待审核',
    field: 'auditCount',
  },
  {
    title: '待支付',
    field: 'payCount',
  },
];
// 应用资产概览
const propertyOverall = [
  {
    title: 'SAAS应用',
    field: 'deliverCount',
    desc: '平台打通应用数',
  },
  {
    title: '独立部署',
    field: 'completeCount',
    desc: '独立部署应用数',
  },
  {
    title: '标识轻应用',
    field: 'auditCount',
    desc: '低代码标识轻应用',
  },
  {
    title: '企业数智化应用',
    field: 'payCount',
    desc: '低代码标识轻应用',
  },
];
// 发布商品概览
const goodsOverall = [
  {
    title: '全部商品',
    field: 'count',
  },
  {
    title: '已驳回',
    field: 'deliverCount',
  },
  {
    title: '审核中',
    field: 'auditCount',
  },
  {
    title: '已上架',
    field: 'completeCount',
  },
];

// 订单概览 接口
const orderlistdata = () => {
  orderOver({
    userCompanyId: String(userInfoByCompany.value?.companyId),
    flag: '0',
  }).then((res) => {
    // @ts-ignore
    const data = {
      ...res,
      payCount: res.payCount + res.rejectCount,
      deliverCount: res.deliverCount + res.servicesDeliverCount,
    };
    orderList.value = data;
  });
};
// 已购应用
const authDialog = () => {
  authDialogVisible.value = [];
  if (Number(tabsApplication.value) === 1) {
    // userId 用户id,如果登陆人是企业，则不需要传，如果是企业下得成员，则需要传
    authDialogdata({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id, // userInfoByCompany.value?.id || '',
    }).then((res) => {
      authDialogVisible.value = res || [];
    });
  } else if (Number(tabsApplication.value) === 2) {
    selectSelfApps({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id, // userInfoByCompany.value?.id || '',
    }).then((res) => {
      authDialogVisible.value = res || [];
    });
  }
};

// 去认证
const authentication = () => {
  // editModalVisible.value = true; //  本平台进行企业认证
  gotoverifys.value = true;
};

const nodeAuth = () => {
  authModalVisible.value = true;
};
const onAuthModalConfirm = () => {
  authModalVisible.value = false;
};
// 认证弹窗去认证事件
const onEditModalConfirm = () => {
  gotoverifys.value = true;
  // editModalVisible.value = false;
};
// 查看详情
const hasdflags = () => {
  // editModalVisible.value = false;
  detailflag.value = true;
};
// 查看详情
const viewdetails = () => {
  // editModalVisible.value = true;
  detailflag.value = true;
};
// 认证填写完成
const onEditModalConfirmcode = () => {
  state.editData.statusled = 0;
  gotoverifys.value = false;
};
// 认证填写 取消
const cancelgotoverifys = (status: number) => {
  if (status === 1) {
    detailflag.value = true;
    gotoverifys.value = false;
  } else {
    // editModalVisible.value = true;
    gotoverifys.value = false;
  }
  state.editData.statusled = 0;
};
//  修改认证信息
const onEditModalConfirmflag = () => {
  detailflag.value = false;
  state.editData.statusled = 1;
  gotoverifys.value = true;
};
// 查看详情 取消
const detailflagclick = () => {
  detailflag.value = false;
  // editModalVisible.value = true;
};

// 企业节点查看详情
const viewdetailsredf = () => {
  const { snmsUrls } = userInfo.value || {};

  window.open(snmsUrls.addNode, '_blank'); // 跳转到二级企业节点认证页面
};
// 邀请成员/分配权限
const distributionrole = () => {
  if (
    userInfoByCompany.value?.certificateStatus === CompanyAuthStatus?.AUTHED ||
    userInfoByCompany.value?.nodeStatus === NodeAuthStatus?.AUTHED
  ) {
    const start = userInfoByCompany.value?.menuCodes.findIndex(
      (item: string, index: number) => {
        return item === 'ROUTE_SYSTEM_USERS';
      }
    );
    if (start !== -1) {
      router.push('/system/users');
    } else {
      Message.error('未分配企业管理权限，请联系企业管理员');
    }
  } else {
    Message.error('请先完成企业认证');
  }
};
// 去商城
const tomall = () => {
  router.push('/wow/mall');
};
const compareDate = (dateTime1: string, dateTime2: string) => {
  const formatDate1 = new Date(dateTime1);
  const formatDate2 = new Date(dateTime2);
  if (formatDate1 > formatDate2) {
    return true;
  }
  return false;
};

const filetype = (val: any) => {
  if (val === 'doc') {
    return 'application/msword;charset=utf-8';
  }
  if (val === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8';
  }
  return 'application/pdf;charset=utf-8';
};

// 更多
const multiples = () => {
  const start = userInfoByCompany.value?.menuCodes.findIndex(
    (item: string, index: number) => {
      return item === 'ROUTE_BUYER_ORDER';
    }
  );
  if (start !== -1) {
    router.push('/buyer/order');
  } else {
    Message.error('未分配订单管理权限,请联系企业管理员查看订单');
  }
};

const initOpt = () => {
  if (
    userInfoByCompany.value.certificateStatus === 1 ||
    userInfoByCompany.value.nodeStatus === 1
  ) {
    // 已购应用
    authDialog();
  }

  // 订单概览
  orderlistdata();
};

// 跳转轻流平台
const goNewApplication = () => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
  };
  appCreateRedirect(params).then((res: any) => {
    window.open(res);
  });
};
// 跳转二级公共方法
const clickIdService = (pageUrl: any) => {
  const { companyId } = userInfoByCompany.value || {};
  const params = {
    companyId: userInfo.value?.isAdmin ? userInfo.value?.companyId : companyId,
  };
  snmsClientLogin(params).then((res: any) => {
    if (res?.data?.code === 102006) {
      Message.error(res?.data?.message);
    }
    if (!res?.data?.data) {
      return;
    }
    const data = {
      type: 'snms',
      companyId: userInfo.value?.isAdmin
        ? userInfo.value?.companyId
        : companyId,
      pageUrl,
    };
    const sm2data = sm2(JSON.stringify(data), userStore.configInfo?.publicKey);
    window.open(`${res?.data?.data}&data=${sm2data}`);
  });
};

// 跳转二级
const goSign = () => {
  clickIdService('');
};

watch(
  () => userInfoByCompany.value,
  (newV) => {
    if (newV?.companyId) {
      initOpt();
    }
  }
);

// 在当前路由下点击 标识服务，去开通，弹窗三要素弹窗
watch(
  () => route.query?.openAuthModal,
  (newV) => {
    if (newV) {
      authModalVisible.value = true;
    }
  }
);
onMounted(() => {
  apiDataPoint(null, null, userInfo?.value?.id, 2, 1).then((res) => {
    console.log('概览页全页面打点', res);
  });
  initOpt();

  if (route.query?.openAuthModal) {
    authModalVisible.value = true;
  }
});
</script>

<style scoped lang="less">
.cverbox {
  display: flex;
  justify-content: center;
  width: 100%;
  // width: 1320px;
  // margin: 0 auto;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  background-color: #f2f3f8;
  background-image: url('./image/header.png');
  background-repeat: no-repeat;
  background-size: 100% auto;

  .left-section {
    width: 840px;
    // overflow: hidden;
    margin-right: 16px;
  }

  .right-section {
    width: 360px;
  }

  .headers {
    .tops {
      display: flex;
      height: 80px;
      // margin: 24px 0;
      padding: 0 24px;
      background-color: #fff;
      border-radius: 4px;

      .imgs {
        float: left;
        width: 44px;
        height: 44px;
        margin-top: 14px;
      }

      .rights {
        flex: 1;
        height: 44px;
        margin: 10px 0 0 12px;

        .name {
          margin-bottom: 0;
          // height: 0;
          color: #223354;
          font-weight: 600;
          font-size: 15px;
          font-style: normal;
          line-height: 34px;
        }

        .inofs {
          display: flex;

          .inofslist {
            display: flex;
            // flex: 1;
            margin-top: 2px;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;

            :deep(.tele-space-item) {
              margin-right: 12px !important;
            }

            p {
              float: left;
            }

            .companyname {
              // flex: 1;
              max-width: 100px;
              margin-right: 12px;
              margin-bottom: 0;
              color: #86909c;
            }

            .extPrefix {
              color: #86909c;

              .divider {
                display: inline-block;
                margin-right: 12px;
                margin-left: 8px;
                color: #8c95a7;
              }
            }

            // p:nth-child(1) {
            //   margin-right: 12px;
            //   color: #86909c;
            // }
            p:nth-child(2) {
              margin-right: 12px;
              color: #86909c;
              text-align: center;
              // padding: 3px 10px;
            }

            p:nth-child(3) {
              margin-right: 12px;
              color: #86909c;
            }

            p:nth-child(4) {
              margin-right: 12px;
              color: #86909c;
              // color: #86909c;
              text-align: center;
            }

            .popover-bottom {
              display: flex;
              flex-direction: columns;

              &div {
                margin-top: 16px;
                color: rgba(78, 89, 105, 1);
                font-weight: 400;
                font-size: 12px;
                font-family: PingFang SC;
                line-height: 20px;
                text-align: left;
              }
            }
          }

          // 已认证
          .statuslist {
            width: 52px;
            padding: 1px 8px;
            font-weight: 400;
            font-size: 12px;
            line-height: 22px;
          }

          .suffix {
            float: left;
            margin-top: 2px;

            p {
              float: left;
              margin-right: 9px;
              color: #86909c;
            }
          }

          .authenticated {
            color: #009a29;
            background-color: #e8ffea;
          }
          // 未认证
          .notcertified {
            color: #fa9600;
            background-color: #fffae8;
          }
          // 待审核
          .tobereviewed {
            color: #1664ff;
            background-color: #e8f4ff;
          }
          //以驳回
          .override {
            color: #e63f3f;
            background-color: #ffece8;
          }
        }
      }
    }

    .direction {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 240px;

      .dirleft {
        width: 78%;
        height: 100%;
        padding: 16px 24px;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        h3 {
          color: #223354;
          font-weight: 500;
          font-size: 20px;
          line-height: 34px;
        }

        .titleleft {
          .dirlist {
            display: flex;
            justify-content: space-between;
            // width: 90%;
            > div {
              width: 25%;
            }

            :deep(.tele-btn-size-medium) {
              height: 0;
              padding: 0;
            }

            .dirlist-step {
              display: inline-block;
              margin-top: 2px;
              color: #1d2129;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
            }

            img {
              float: left;
              width: 28px;
              height: 28px;
              margin-right: 8px;
            }

            .ition {
              width: 80px;
              height: 1px;
              margin-top: 13px;
              margin-left: -80px;
              background-color: #4e5969;
            }

            .btns {
              margin-left: 36px;

              p {
                color: #9098a9;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
              }

              .dirlist-btn {
                height: 20px;
                color: var(--b-161664-ff, #1664ff);
                font-weight: 400;
                font-size: 14px;
                font-family: PingFang SC;
                font-style: normal;
                line-height: normal;
              }
            }

            div:nth-child(1) {
              .btns {
                float: left;
                width: 100%;

                .states {
                  // 已认证
                  .authenticated {
                    color: #009a29;
                    background-color: #e8ffea;
                  }
                  // 未认证
                  .notcertified {
                    color: #fa9600;
                    background-color: #fffae8;
                  }
                  // 待审核
                  .tobereviewed {
                    color: #1664ff;
                    background-color: #e8f4ff;
                  }
                  //以驳回
                  .override {
                    color: #e63f3f;
                    background-color: #ffece8;
                  }
                }
              }
            }

            div:nth-child(2) {
              img {
                float: left;
              }

              .ition {
                float: left;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(3) {
              img {
                float: left;
              }

              .ition {
                float: left;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }

                p:nth-child(2) {
                  color: #1664ff;
                }
              }
            }

            div:nth-child(4) {
              // width: 35%;
              img {
                float: left;
                // width: 20px;
                // height: 20px;
                // margin-right: 7px;
              }

              .ition {
                float: left;
              }

              .btns {
                float: left;
                width: 100%;
                // margin-left: 116px;
                p:nth-child(1) {
                  color: #9098a9;
                }
              }
            }
          }
        }
      }

      .firmright {
        width: 20%;
        height: 100%;
        padding: 16px 0 0 24px;
        background-image: url('./image/backgroup.png');
        // background-color: #fff;
        background-size: cover;
        border-radius: 4px;

        .firm {
          display: flex;
          align-items: center;
          width: 100%;

          .firm-title {
            display: inline-block;
            margin-right: 8px;
            color: #223354;
            font-weight: 500;
            font-size: 20px;
            line-height: 34px;
          }

          span {
            font-size: 12px;
          }
          // 已认证
          .authenticated {
            color: #009a29;
            background-color: #e8ffea;
          }
          // 未认证
          .notcertified {
            color: #fa9600;
            background-color: #fffae8;
          }
          // 待审核
          .tobereviewed {
            color: #1664ff;
            background-color: #e8f4ff;
          }
          //以驳回
          .override {
            color: #e63f3f;
            background-color: #ffece8;
          }
        }

        .fimelist {
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;

          ul {
            li {
              display: flex;
              align-items: center;
              margin-top: 10px;
              color: #4e5969;

              span:nth-child(1) {
                float: left;
                width: 4px;
                height: 4px;
                margin-right: 8px;
                background-color: #4e5969;
                border-radius: 6px;
              }
            }
          }

          .fimelistdata {
            .states {
              margin: 0 auto;
              // 已认证
              .authenticated {
                color: #009a29;
                background-color: #e8ffea;
              }
              // 未认证
              .notcertified {
                color: #fa9600;
                background-color: #fffae8;
              }
              // 待审核
              .tobereviewed {
                color: #1664ff;
                background-color: #e8f4ff;
              }
              //以驳回
              .override {
                color: #e63f3f;
                background-color: #ffece8;
              }
            }
          }
        }
      }
    }
  }

  .purchased {
    // width: 96%;
    width: 100%;
    margin: 0 auto 24px;
    padding: 16px 24px 27px;
    background-color: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    h3 {
      color: #223354;
      font-weight: 500;
      font-size: 20px;
      line-height: 34px;
    }

    :deep(.tele-tabs-tab) {
      margin: 0 16px 0 0;
    }

    :deep(.tele-tabs-tab-active) {
      color: rgba(34, 51, 84, 1);
    }

    :deep(.tele-tabs-tab-title) {
      display: flex;
      align-items: center;
    }

    .application-img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    .application-blue-img {
      transform: translateY(-60px);
      // 颜色、x轴偏移量、y轴偏移量,这里的颜色就是你要指定的颜色，不管原来的图片是什么颜色，都会变成这个颜色
      filter: drop-shadow(rgba(22, 100, 255, 1) 0 60px);
    }

    .Applysd {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      height: 100%;

      .purchasedlist {
        display: flex;
        justify-content: space-between;
        width: 47%;
        height: 138px;
        margin-top: 24px;
        padding: 16px;
        // flex-shrink: 0;
        background-color: #fff;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        .leftcont {
          display: flex;
          flex-direction: column;
          width: 77%;
          // align-items: flex-end;
          .tophead-intro {
            word-break: break-all;
          }

          .tophead-to {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;

            .to-container {
              display: flex;
              align-items: center;
            }

            .to-img {
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-left: 4px;
              background: url('./image/togo.svg');
            }
          }

          .tophead {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }

          .purchased-content {
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }
        }
      }

      .purchasedlist:nth-child(-n + 2) {
        margin-top: 20px;
      }

      .nothing-application {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 425px;
      }

      .nothing-application-img {
        width: 120px;
        height: 120px;
        background: url(@/assets/images/home/empty.png) no-repeat;
        background-size: 100% 100%;
      }

      .nothing-application-button {
        margin-top: 12px;
      }
    }
  }

  .views {
    // width: 96%;
    width: 100%;
    margin: 0 auto 24px;
    padding: 16px 24px;
    background-image: url('./image/btn.png');
    background-size: cover;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .tooplist {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 24px;

      h3 {
        color: #223354;
        font-weight: 500;
        font-size: 20px;
        line-height: 34px;
      }

      p {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
    }

    .overlist {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .overlistdata {
        width: 20%;
        height: 100px;
        margin-right: 16px;
        padding: 16px 16px 22px;
        background: rgba(255, 255, 255, 0.4);

        &:last-of-type {
          margin-right: 0;
        }

        &:hover {
          background-image: url('./image/overdata-bg.jpg');
          background-size: auto 100%;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        }

        .overlist-title {
          color: #86909c;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }

        .overlist-num {
          color: #1d2129;
          font-weight: 700;
          font-size: 30px;
          line-height: 38px;
        }
      }
    }
  }

  .card-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;

    .head {
      display: flex;
      gap: 8px;

      .head-title {
        font-weight: 500;
        font-size: 16px;
        font-family: PingFang SC;
      }
    }

    .middle-wrap {
      flex-wrap: wrap;
    }

    .middle {
      display: flex;
      gap: 12px;

      .nav {
        display: flex;
        gap: 8px;
        align-items: center;
        height: 36px;
        padding: 8px;
        background: linear-gradient(98.94deg, #fafcff 16.99%, #e9f1ff 92.6%);
        border-radius: 4px;
        cursor: pointer;

        .nav-title {
          font-weight: 400;
          font-size: 12px;
        }
      }

      .goods-list-2 {
        flex: 0 2 calc(50% - 6px);
      }

      .goods-list-4 {
        flex: 0 4 calc(25% - 6px);
      }

      .goods-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .head-name {
          font-weight: 500;
          font-size: 13px;
          line-height: 22px;
        }

        .block {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          background: #ecf3ff;
          border-radius: 4px;

          .block-inner {
            display: flex;
            gap: 4px;
            align-items: flex-end;

            .number {
              font-weight: 700;
              font-size: 24px;
              font-family: DIN Alternate;
            }

            .unit {
              height: 16px;
              color: #4e5969;
              font-weight: 400;
              font-size: 12px;
            }
          }
        }

        .desc {
          color: #4e5969;
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
}

:deep(.tele-typography-operation-copy) {
  pointer-events: none;
}
</style>
