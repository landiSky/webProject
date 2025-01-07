<template>
  <div id="cverbox" class="cverbox">
    <!-- 买家中心概览 头部 -->
    <div class="left-section">
      <!-- 轻应用待办 -->
      <LightFlowTodoView
        v-if="configInfo?.qingFlowSwitch && !packageList.length && showService"
        :show-service="showService"
      />

      <ApplicationGuide
        v-if="userInfoByCompany.primary !== 2"
        :package-list="packageList"
        :show-service="showService"
        @positioning-service="positioningService"
        @get-child-list="getChildList"
        >应用使用引导</ApplicationGuide
      >
      <!-- 标识轻应用 -->
      <div
        v-if="configInfo?.qingFlowSwitch && packageList.length"
        id="serviceId"
      >
        <ServiceActivation :package-list="packageList" />
      </div>
      <!-- 已够应用展示 -->
      <PurchasedAppView
        ref="purchasedAppViewRef"
        :package-list="packageList"
        :show-service="showService"
        @positioning-service="positioningService"
        @authentication="authentication"
        @view-details="viewdetails"
      />
    </div>
    <div class="right-section">
      <!-- 个人用户信息 -->
      <div class="Personal-data">
        <div class="data-title">
          <div class="data-title-image">
            <img :src="avatar" alt="" />
          </div>
          <div class="data-title-value">
            <t-typography-paragraph
              :ellipsis="{
                rows: 1,
                showTooltip: true,
              }"
              style="margin-bottom: 0; word-break: break-all"
              >{{ userInfoByCompany?.username || userInfo?.mobile }}
            </t-typography-paragraph>
          </div>
        </div>
        <div class="data-body">
          <div class="data-columns">
            <span class="data-columns-label">所属企业：</span>
            <span class="data-columns-value">
              {{
                userInfoByCompany.primary !== 3
                  ? userInfoByCompany.companyName
                  : '--'
              }}
            </span>
          </div>
          <div class="data-columns">
            <span class="data-columns-label">账号类型：</span>
            <span class="data-columns-value">
              {{
                userInfoByCompany.companyId && userInfoByCompany.primary !== 3
                  ? AccountTypeDesc[userInfoByCompany.primary]
                  : '--'
              }}
            </span>
          </div>
          <div class="data-columns data-columns-items">
            <span class="data-columns-label">标识前缀：</span>
            <span class="data-columns-value">
              {{
                userInfoByCompany?.entPrefixList.length &&
                userInfoByCompany.primary !== 3
                  ? userInfoByCompany?.entPrefixList.join('：')
                  : '--'
              }}
            </span>
          </div>
          <div class="data-columns">
            <span class="data-columns-label">认证状态：</span>
            <span
              class="data-columns-value status-list"
              :class="stateClass[userInfoByCompany.certificateStatus]"
            >
              {{ CompanyAuthStatusDESC[userInfoByCompany.certificateStatus] }}
            </span>
            （
            <t-space>
              <t-link
                v-if="
                  !userInfoByCompany.companyId ||
                  userInfoByCompany.certificateStatus ===
                    CompanyAuthStatus.UNAUTH
                "
                :hoverable="false"
                @click="authentication"
                >去认证</t-link
              >
              <t-link
                v-if="
                  [
                    CompanyAuthStatus.TO_CHECK,
                    CompanyAuthStatus.REJECT,
                    CompanyAuthStatus.AUTHED,
                  ].includes(userInfoByCompany.certificateStatus)
                "
                :hoverable="false"
                @click="viewdetails"
                >查看详情</t-link
              >
            </t-space>
            ）
          </div>
        </div>
      </div>
      <!-- 快捷导航 -->
      <div class="card-view">
        <div class="head">
          <div class="head-icon">
            <iconpark-icon name="overview-nav-icon" size="20px" />
          </div>
          <div class="head-title">快捷导航</div>
        </div>
        <div class="middle">
          <div
            v-if="configInfo?.qingFlowSwitch && !packageList.length"
            class="nav"
            @click="goNewApplication"
          >
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
                v-if="(propertyList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number">
                  {{ (propertyList[item.field] || '').toLocaleString() || 0 }}
                </span>
                <span class="unit">项</span>
              </div>
              <div
                v-if="!(propertyList[item.field] || '').toLocaleString() || 0"
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
                v-if="(goodsList[item.field] || '').toLocaleString() || 0"
                class="block-inner"
              >
                <span class="number">
                  {{ (goodsList[item.field] || '').toLocaleString() || 0 }}
                </span>
                <span class="unit">项</span>
              </div>
              <div
                v-if="!(goodsList[item.field] || '').toLocaleString() || 0"
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
  publishProductOverview,
  appPropertyOverview,
  appCreateRedirect,
  getServicePackage,
  userAuthStatus,
} from '@/api/buyer/overview';

import EditModal from '@/components/dataoverview/components/edit-modal.vue';

import EditModalFullscreen from '@/components/dataoverview/components/edit-modal-fullscreen.vue';

import DetailsModalFullscreen from '@/components/dataoverview/components/details-modal-fullscreen.vue';

import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import {
  AccountTypeDesc,
  CompanyAuthStatus,
  CompanyAuthStatusDESC,
} from '@/enums/common';
import { sm2 } from '@/utils/encrypt';

import AuthModal from '@/components/auth-modal/index.vue';
import { apiDataPoint } from '@/api/data-point';
import { snmsClientLogin } from '@/api/login';
import ApplicationGuide from './components/ApplicationGuide.vue';
import avatar from './image/avatar.png';

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

const state = reactive({
  editData: {
    id: '1111',
    // 0是提交认证 1是修改认证
    statusled: 0,
  },
});
// 已购组件ref
const purchasedAppViewRef: Record<string, any> = ref(null);

const packageList: Record<string, any> = ref([]);
const showService = ref(false);
// tabs来回切换值
const tabsApplication = ref(1);
// 立即认证弹窗
const editModalVisible = ref(false);
// 去认证弹窗
const gotoverifys = ref(false);
// 详情弹窗
const detailflag = ref(false);

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
// 应用资产概览
const propertyList = ref<Record<string, any>>({
  saasApp: 0, // SAAS应用
  deploy: 0, // 独立部署
  identifyLightApp: 0, // 标识轻应用
  companyNumberIntelligence: 0, // 企业数智化应用
});
// 发布商品概览
const goodsList = ref<Record<string, any>>({
  all: 0, // 全部商品
  reject: 0, // 已驳回
  verifying: 0, // 审核中
  upShelf: 0, // 已上架
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
    field: 'saasApp',
    desc: '平台打通应用数',
  },
  {
    title: '独立部署',
    field: 'deploy',
    desc: '独立部署应用数',
  },
  {
    title: '标识轻应用',
    field: 'identifyLightApp',
    desc: '低代码标识轻应用',
  },
  {
    title: '企业数智化应用',
    field: 'companyNumberIntelligence',
    desc: '低代码标识轻应用',
  },
];
// 发布商品概览
const goodsOverall = [
  {
    title: '全部商品',
    field: 'all',
  },
  {
    title: '已驳回',
    field: 'reject',
  },
  {
    title: '审核中',
    field: 'verifying',
  },
  {
    title: '已上架',
    field: 'upShelf',
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
// 应用资产概览 接口
const propertyListData = () => {
  appPropertyOverview({
    companyId: String(userInfoByCompany.value?.companyId),
  }).then((res) => {
    // @ts-ignore
    const data = {
      ...res,
    };
    propertyList.value = data;
  });
};
// 发布商品概览 接口
const goodsListData = () => {
  publishProductOverview({
    companyId: String(userInfoByCompany.value?.companyId),
  }).then((res) => {
    // @ts-ignore
    const data = {
      ...res,
    };
    goodsList.value = data;
  });
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

const getPackageList = async () => {
  const params = {
    companyId: selectCompany.value?.companyId,
  };
  getServicePackage(params).then((res: any) => {
    const packageData = res.map((data: any) => {
      const introduction = data?.introduction.split(',') || [];
      const params = {
        ...data,
        introduction,
      };
      return params;
    });
    packageList.value = packageData;
    const userData = {
      companyId: selectCompany.value?.companyId,
      memberId: selectCompany.value?.memberId,
    };
    userAuthStatus(userData).then((data: any) => {
      showService.value = data;
    });
  });
};

const initOpt = () => {
  // 是否购买服务和是否被授权
  getPackageList();
  // 订单概览
  orderlistdata();
  // 应用资产概览
  propertyListData();
  // 发布商品概览
  goodsListData();
};

// 跳转轻流平台
const goNewApplication = () => {
  if (!showService.value) {
    Modal.warning({
      title: '使用提醒',
      content: '暂未权限访问，联系企业管理员开通',
      titleAlign: 'start',
      hideCancel: true,
      cancelText: '',
      okText: '好的',
      onOk: () => {},
    });
    return false;
  }
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
  };
  appCreateRedirect(params).then((res: any) => {
    window.open(res);
  });
  return true;
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
// 定位到开通服务元素
const positioningService = () => {
  const target = document.getElementById('serviceId');
  const parent = document.getElementById('cverbox');
  parent &&
    target &&
    parent.scrollTo({
      top: target.offsetTop - parent.offsetTop,
      behavior: 'smooth',
    });
};
// 定义调用已购组件列表
const getChildList = () => {
  // 调用子组件的方法或者变量，通过value
  purchasedAppViewRef.value.getApplicationListData();
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
  padding: 16px 0;
  overflow-y: auto;
  background-color: #f2f3f8;
  background-image: url('./image/header.png');
  background-repeat: no-repeat;
  background-size: 100% auto;

  .left-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 840px;
    margin-right: 16px;
  }

  .right-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 360px;
  }

  .Personal-data {
    gap: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;

    .data-title {
      display: flex;
      gap: 12px;
      align-items: center;

      .data-title-image {
        width: 24px;
        height: 24px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .data-title-value {
        width: calc(100% - 24px);
        font-weight: 500;
        font-size: 16px;
      }
    }

    .data-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 16px;

      .data-columns {
        display: flex;
        align-items: center;

        .data-columns-label {
          width: 60px;
          color: #4e5969;
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;
        }

        .data-columns-value {
          width: calc(100% - 60px);
          color: #1d2129;
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;
        }

        .status-list {
          width: 52px;
          padding: 3px 8px;
          font-weight: 400;
          font-size: 12px;
          border-radius: 2px;
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

      .data-columns-items {
        align-items: normal;
      }
    }
  }

  .card-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
