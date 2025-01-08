<template>
  <div class="purchased">
    <t-tabs :active-key="tabsApplication" @tab-click="TabClickApplication">
      <t-tab-pane key="1" title="商城购买应用">
        <t-button
          v-if="tabsApplication === '1' && applicationListData.length"
          type="outline"
          class="botton-top"
          @click="onClickNewApp"
        >
          +购买新应用
        </t-button>
        <div v-if="tabsApplication === '1'" class="mall-application">
          <div
            v-for="(item, index) in applicationListData"
            :key="index"
            class="purchased-list"
          >
            <div class="header" @click="togoCheck(item)">
              <div class="avatar">
                <img
                  v-if="item.productLogo"
                  :src="`/server/web/file/orderDownloadBySource?name=${item.productLogo}&source=${item.orderSource}&serverId=${item.productServerId}`"
                  alt=""
                />
              </div>
              <div class="desc">
                <span class="title">
                  {{ item.productName }}
                </span>
                <span class="permission">
                  <span class="left">应用购买者:</span>
                  <span class="right">{{ item.createName }}</span>
                </span>
              </div>
            </div>
            <t-divider :margin="12" />
            <div class="footer">
              <div class="creation-time">创建时间：{{ item.createTime }}</div>
              <div class="button-position">
                <t-space :size="20">
                  <t-link
                    v-if="
                      userInfoByCompany.primary === AccountType?.MAIN &&
                      item.deliveryType !== 2
                    "
                    :hoverable="false"
                    @click="configurationapp(item)"
                    >配置应用</t-link
                  >
                  <t-link
                    v-if="item?.useExplainMap && item?.useExplainMap.length"
                    :hoverable="false"
                    @click="
                      instructionsuse(
                        item.useExplainMap,
                        item.orderSource,
                        item.productServerId
                      )
                    "
                    >使用说明</t-link
                  >
                </t-space>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            tabsApplication === '1' &&
            applicationListData.length &&
            !hideOnSinglePage
          "
          class="pagination-view"
        >
          <t-pagination
            v-model:current="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            show-total
            @change="onPageChange"
          />
        </div>
      </t-tab-pane>
      <t-tab-pane key="2" title="企业自建应用">
        <t-button
          v-if="tabsApplication === '2' && applicationListData.length"
          type="outline"
          class="botton-top"
          @click="onClickNewApp"
        >
          +创建新应用
        </t-button>
        <div v-if="tabsApplication === '2'" class="mall-application">
          <div
            v-for="(item, index) in applicationListData"
            :key="index"
            class="purchased-list"
          >
            <div class="header" @click="jumpCheck(item)">
              <div class="avatar">
                <img
                  v-if="item.type !== 1 && item.appLogo"
                  :src="`/server/web/file/download?name=${item.appLogo}`"
                  alt=""
                />
                <t-avatar
                  v-if="item.type === 1"
                  :size="36"
                  shape="square"
                  class="font-pangmen"
                  :class="item.appLogo"
                  :style="{ fontSize: '20px' }"
                >
                  {{ captureOne(item.appName) }}
                </t-avatar>
              </div>
              <div class="desc">
                <span class="title">
                  {{ item.appName }}
                </span>
                <span class="permission">
                  <span class="left">应用创建者:</span>
                  <span class="right">{{ item.creatorName }}</span>
                </span>
              </div>
            </div>
            <t-divider :margin="12" />
            <div class="footer">
              <div class="creation-time">创建时间：{{ item.createTime }}</div>
              <div class="button-position">
                <t-space :size="20">
                  <t-link
                    v-if="
                      userInfoByCompany.primary === AccountType?.MAIN &&
                      item.type === 0
                    "
                    :hoverable="false"
                    @click="configurationapp(item)"
                    >配置应用</t-link
                  >
                </t-space>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            tabsApplication === '2' &&
            applicationListData.length &&
            !hideOnSinglePage
          "
          class="pagination-view"
        >
          <t-pagination
            v-model:current="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            show-total
            @change="onPageChange"
          />
        </div>
      </t-tab-pane>
    </t-tabs>

    <EmptyStateView
      v-if="!applicationListData.length"
      :tabs-application="tabsApplication"
      :package-list="packageListData"
      :show-service="showServiceData"
      @get-application-list-data="getApplicationListData"
      @on-positioning-service="onPositioningService"
      @on-authentication="onAuthentication"
      @on-view-details="onViewDetails"
    />
    <!-- 创建新应用 -->
    <NewApp
      v-if="newAppShow"
      :visible="newAppShow"
      :tabs-application="tabsApplication"
      :package-list="packageListData"
      :show-service="showServiceData"
      @confirm="onClickCancelNewApp"
      @cancel="newAppShow = false"
      @get-application-list-data="getApplicationListData"
      @on-positioning-service="onPositioningService"
      @on-authentication="onAuthentication"
      @on-view-details="onViewDetails"
    />

    <!-- 配置应用 -->
    <AuthMemberModal
      v-if="editModalVisiblealter"
      :product-id="selectProduct.productId"
      :delivery-set-id="selectProduct.deliveryId"
      :account-count="selectProduct.accountCount"
      @confirm="onEditModalConfirmAlter"
      @cancel="editModalVisiblealter = false"
    >
    </AuthMemberModal>
    <!-- 配置自建应用 -->
    <AuthApplicationsModal
      v-if="editModalApplication"
      :product-id="selectProduct.id"
      @confirm="onEditModalConfirmselfbuilt"
      @cancel="editModalApplication = false"
    >
    </AuthApplicationsModal>
    <!-- 使用说明文件展示弹窗 -->
    <DetailsModalUpload
      v-if="detailupload"
      :data="uploadList"
      @confirm="DetailModalConfirmflag"
      @cancel="detailuploadclick"
    >
    </DetailsModalUpload>
    <!-- 授权提示弹窗 -->
    <EmpowerTip
      v-if="empowerTipVisible"
      :visible="empowerTipVisible"
      :empower-tip-data="empowerTipData"
      title="授权提示"
      @confirm="empowerTipConfirm"
      @cancel="empowerTipCancel"
    >
    </EmpowerTip>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import {
  onMounted,
  ref,
  watch,
  defineProps,
  computed,
  defineEmits,
  reactive,
} from 'vue';
import { useRouter } from 'vue-router';
import {
  authDialogdata,
  selectSelfApps,
  appInfoClientLogin,
  alreadyBuyClientLogin,
  apiAuthStatus,
  apiGetAuth,
  appAppPackageRedirect,
  dashBoardRedirect,
} from '@/api/buyer/overview';
import { snmsClientLogin } from '@/api/login';
import { Modal, Message } from '@tele-design/web-vue';
import { sm2 } from '@/utils/encrypt';
import { AppType, AccountType, NodeAuthStatus } from '@/enums/common';
// 商城应用
import AuthMemberModal from '@/components/auth-member/index.vue';
// 自建应用
import AuthApplicationsModal from '@/components/auth-member/self-built-applications.vue';
// 使用说明文件展示弹窗
import DetailsModalUpload from '@/components/dataoverview/components/details-modal-upload.vue';
// 授权提示弹窗
import EmpowerTip from './empowerTip.vue';
// 空状态视图展示
import EmptyStateView from './empty-state-view.vue';
// 创建新应用弹窗
import NewApp from './new-app.vue';

const router = useRouter();
const userStore = useUserStore();
const {
  userInfo,
  userInfoByCompany,
  selectCompany,
  configInfo,
}: Record<string, any> = storeToRefs(userStore);

const emits = defineEmits([
  'positioningService',
  'authentication',
  'viewdetails',
]);
const props = defineProps({
  packageList: {
    type: Array as any,
    default() {
      return [];
    },
  },
  showService: {
    type: Boolean,
    default() {
      return false;
    },
  },
});
const packageListData = computed(() => props.packageList);
const showServiceData = computed(() => props.showService);
// tabs来回切换值
const tabsApplication = ref('1');
const newAppShow = ref(false);
// 配置应用存储对象
const selectProduct = ref<Record<string, any>>({});
// 配置应用 弹窗
const editModalVisiblealter = ref(false);
// 配置自建应用 弹窗
const editModalApplication = ref(false);
// 使用说明 弹窗
const detailupload = ref(false);
const uploadList: Record<string, any> = ref([]);
// 授权提示 弹窗
const empowerTipVisible = ref(false);
// 当前点击数据
const empowerTipData: Record<string, any> = ref({});
// 列表展示
const applicationListData: Record<string, any> = ref([]);
const paginationData: Record<string, any> = {
  pageNum: 1,
  pageSize: 30,
  total: 0,
};
const pagination = reactive({ ...paginationData });
const hideOnSinglePage = computed(
  () => pagination.total <= paginationData.pageSize
);

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
// 跳转二级前缀配置页面
const goNode = () => {
  clickIdService('/prefix/apply');
};

const getApplicationListData = () => {
  applicationListData.value = [];
  if (tabsApplication.value === '1') {
    // userId 用户id,如果登陆人是企业，则不需要传，如果是企业下得成员，则需要传
    authDialogdata({
      ...pagination,
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id,
    }).then((res) => {
      applicationListData.value = res?.records || [];
      pagination.total = res?.total;
    });
  } else if (tabsApplication.value === '2') {
    selectSelfApps({
      ...pagination,
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id,
    }).then((res) => {
      applicationListData.value = res?.records || [];
      pagination.total = res?.total;
    });
  }
};

const onPageChange = (current: number) => {
  pagination.pageNum = current;
  getApplicationListData();
};

// 应用切换
const TabClickApplication = (key: any) => {
  tabsApplication.value = key;
  pagination.pageNum = paginationData.pageNum;
  pagination.pageSize = paginationData.pageSize;
  pagination.total = paginationData.total;
  if (
    userInfoByCompany.value.certificateStatus === 1 ||
    userInfoByCompany.value.nodeStatus === 1
  ) {
    getApplicationListData();
  }
};

const onClickNewApp = () => {
  newAppShow.value = true;
};
const onClickCancelNewApp = () => {
  newAppShow.value = false;
};

// 配置应用
const configurationapp = (item: Record<string, any>) => {
  selectProduct.value = item; // 配置的应用 id
  if (Number(tabsApplication.value) === 1) {
    editModalVisiblealter.value = true;
  } else if (Number(tabsApplication.value) === 2) {
    editModalApplication.value = true;
  }
};
// 配置应用 确定
const onEditModalConfirmAlter = () => {
  editModalVisiblealter.value = false;
};

// 配置自建应用 确定
const onEditModalConfirmselfbuilt = () => {
  editModalApplication.value = false;
};

// 使用说明
const instructionsuse = (
  useExplainMap: Array<object>,
  orderSource: string,
  productServerId: string
) => {
  uploadList.value = useExplainMap.map((item: any) => {
    const params = item;
    params.orderSource = orderSource;
    params.productServerId = productServerId;
    return params;
  });
  detailupload.value = true;
};
const DetailModalConfirmflag = () => {
  detailupload.value = false;
};
const detailuploadclick = () => {
  detailupload.value = false;
};
// 解析json
const captureOne = (name: string) => {
  if (!name) return '';
  return name.substring(0, 1);
};

const compareDate = (dateTime1: string, dateTime2: string) => {
  const formatDate1 = new Date(dateTime1);
  const formatDate2 = new Date(dateTime2);
  if (formatDate1 > formatDate2) {
    return true;
  }
  return false;
};
// 前往
const togo = (detailData: Record<string, any>) => {
  const { id, dueDate, type, productId, deliveryId, deliveryType } = detailData;
  const { snmsUrls, companyId } = userInfo.value || {};
  // 标识类应用需要申请开通企业节点
  if (
    AppType.IDAPP === type &&
    userInfoByCompany.value?.nodeStatus !== NodeAuthStatus.AUTHED &&
    !configInfo.value?.callSnmsSwitch
  ) {
    Modal.info({
      title: '使用提醒',
      content: '本应用需申请企业节点后使用，请先开通或绑定企业节点。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不开通',
      okText: '去开通',
      onOk: () => {
        clickIdService('');
      },
    });
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = `0${now.getMonth() + 1}`.slice(-2);
  const day = `0${now.getDate()}`.slice(-2);
  const hours = `0${now.getHours()}`.slice(-2);
  const minutes = `0${now.getMinutes()}`.slice(-2);
  const seconds = `0${now.getSeconds()}`.slice(-2);
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  if (!dueDate || compareDate(dueDate, formattedTime)) {
    // TODO 过期时间判断
    if (Number(tabsApplication.value) === 1) {
      const params = {
        productId,
        productDeliverySetId: deliveryId,
        memberId: selectCompany.value?.memberId,
        orderId: id,
      };

      alreadyBuyClientLogin(params).then((res: any) => {
        const data = {
          type: 'productApp',
          productId,
          productDeliverySetId: deliveryId,
          memberId: selectCompany.value?.memberId,
        };
        const sm2data = sm2(
          JSON.stringify(data),
          userStore.configInfo?.publicKey
        );
        if (res.code === 102008) {
          return Message.warning(res?.message);
        }
        if (res.code !== 200) {
          return Message.error(res?.message);
        }
        if (deliveryType === 1) {
          window.open(res.data);
        } else {
          window.open(`${res.data}&data=${sm2data}`);
        }
        return true;
      });
    } else if (Number(tabsApplication.value) === 2) {
      const params = {
        appInfoId: id,
        companyId: userInfoByCompany.value.companyId,
        memberId: selectCompany.value?.memberId,
      };
      appInfoClientLogin(params).then((res: any) => {
        if (res.code === 102008) {
          return Message.warning(res?.message);
        }
        if (res.code !== 200) {
          return Message.error(res?.message);
        }
        const data = {
          type: 'selfApp',
          companyId: userInfoByCompany.value.companyId,
          memberId: selectCompany.value?.memberId,
        };
        const sm2data = sm2(
          JSON.stringify(data),
          userStore.configInfo?.publicKey
        );
        if (detailData.appType === 0 && detailData.dockingMethod === 1) {
          window.open(detailData?.link);
        } else {
          window.open(`${res.data}&data=${sm2data}`);
        }
        return true;
      });
    }
  }
};

// 跳转到轻流 对应的应用包
const goLightFlowApplicationPackage = (item: any) => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
    tagId: item?.tagId,
  };
  appAppPackageRedirect(params).then((res: any) => {
    window.open(res);
  });
};

// 跳转到轻流 对应的门户
const goLightFlowGateway = (item: any) => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
    dashKey: item?.dashKey,
  };
  dashBoardRedirect(params).then((res: any) => {
    window.open(res);
  });
};

const clickActivateService = () => {
  if (!showServiceData.value) {
    Modal.warning({
      title: '使用提醒',
      content: '暂未权限访问，联系企业管理员开通',
      titleAlign: 'start',
      hideCancel: true,
      cancelText: '',
      okText: '好的',
      onOk: () => {},
    });
  }
};

const togoCheck = (detailData: Record<string, any>) => {
  if (detailData?.deliveryType === 0) {
    const params = {
      productId: detailData.productId, // 商品id
      memberId: selectCompany.value?.memberId, // 成员id
      productDeliverySetId: detailData.deliveryId, // 版本id
      appId: detailData.saasAppId, // 应用id
    };
    apiAuthStatus(params).then((res: any) => {
      if (res === 0) {
        empowerTipVisible.value = true;
        empowerTipData.value = detailData;
        return;
      }
      togo(detailData);
    });
  } else if (detailData?.deliveryType === 2) {
    if (!showServiceData.value) {
      clickActivateService();
      return;
    }
    // 轻应用
    goLightFlowApplicationPackage({
      ...detailData,
      tagId: detailData.appPackageId,
    });
  } else {
    togo(detailData);
  }
};

const jumpCheck = (detailData: Record<string, any>) => {
  if (detailData.type === 0) {
    // 智数通自建
    togo(detailData);
  } else if (detailData.type === 1) {
    if (!showServiceData.value) {
      clickActivateService();
      return;
    }
    // 轻应用
    goLightFlowApplicationPackage(detailData);
  } else if (detailData.type === 2) {
    if (!showServiceData.value) {
      clickActivateService();
      return;
    }
    // 门户
    goLightFlowGateway(detailData);
  }
};

// 授权提示
const empowerTipConfirm = () => {
  const params = {
    productId: empowerTipData.value?.productId, // 商品id
    memberId: selectCompany.value?.memberId, // 成员id
    productDeliverySetId: empowerTipData.value?.deliveryId, // 版本id
    appId: empowerTipData.value?.saasAppId, // 应用id
  };
  apiGetAuth(params).then(() => {
    togo(empowerTipData.value);
    empowerTipVisible.value = false;
  });
};
const empowerTipCancel = () => {
  empowerTipVisible.value = false;
};
const onPositioningService = () => {
  emits('positioningService');
};
const onAuthentication = () => {
  emits('authentication');
};
const onViewDetails = () => {
  emits('viewdetails');
};

// 暴露方法
defineExpose({
  getApplicationListData,
});

watch(
  () => userInfoByCompany.value,
  (newV: any) => {
    if (newV?.companyId) {
      getApplicationListData();
    }
  }
);

onMounted(() => {
  getApplicationListData();
});
</script>

<style scoped lang="less">
.purchased {
  width: 100%;
  margin: 0 auto;
  padding: 16px 24px 28px;
  background-color: #fff;
  border: 1px solid #e5e8ef;
  border-radius: 4px;

  :deep(.tele-tabs-tab) {
    margin: 0 20px 0 0;
  }

  :deep(.tele-tabs-tab-active) {
    color: #223354;
    font-weight: 500;
  }

  :deep(.tele-tabs-tab-title) {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 20px;
    font-family: PingFang SC;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  :deep(.tele-tabs-nav-ink) {
    height: 3px;
  }

  .botton-top {
    width: 100%;
    margin-top: 16px;
  }

  .mall-application {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    height: 100%;
    margin-top: 16px;

    .purchased-list {
      display: flex;
      flex: 0 2 calc(50% - 4px);
      flex-direction: column;
      justify-content: space-between;
      height: 118px;
      padding: 16px;
      background-color: #fff;
      border: 1px solid #e5e8ef;
      border-radius: 4px;

      .header {
        display: flex;
        gap: 12px;
        align-items: center;
        cursor: pointer;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 2px;

          img {
            width: 100%;
            height: 100%;
          }

          .qing-orange {
            // color: #fb9337;
            // background: #ffebdb;
            background: #f59a81;
          }

          .yellow {
            // color: #fab300;
            // background: #fff1d8;
            background: #ffb457;
          }

          .green {
            // color: #67c200;
            // background: #e7f4d7;
            background: #79dd88;
          }

          .emerald {
            // color: #00bd77;
            // background: #ddf4e6;
            background: #3ac0c0;
          }

          .blue {
            // color: #00c5fb;
            // background: #e2f4ff;
            background: #1664ff;
          }

          .azure {
            // color: #268bfb;
            // background: #e3e9ff;
            background: #16c1ff;
          }

          .indigo {
            // color: #6468fb;
            // background: #e8e2ff;
            background: #4086ff;
          }

          .qing-purple {
            // color: #392fc2;
            // background: #e1d7f5;
            background: #787cf8;
          }

          .purple {
            // color: #9e64fb;
            // background: #f0e3ff;
            background: #9d5fee;
          }

          .pink {
            // color: #d164fb;
            // background: #f9e4ff;
            background: #d481ed;
          }

          .red {
            // color: #fb4b51;
            // background: #ffe1dd;
            background: #61b0f0;
          }

          .orange {
            // color: #fa6f32;
            // background: #ffe6d9;
            background: #4bdbe3;
          }
        }

        .desc {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .title {
            color: #223354;
            font-weight: 500;
            font-size: 14px;
            font-family: PingFang SC;
            line-height: 22px;
            text-align: left;
            text-underline-position: from-font;
            text-decoration-skip-ink: none;
          }

          .permission {
            display: flex;
            gap: 4px;
            font-weight: 400;
            font-size: 12px;
            font-family: PingFang SC;
            line-height: 20px;
            text-underline-position: from-font;
            text-decoration-skip-ink: none;

            .left {
              color: #4e5969;
            }

            .right {
              color: #1d2129;
            }
          }
        }
      }

      .footer {
        display: flex;
        justify-content: space-between;

        .creation-time {
          color: #86909c;
          font-weight: 400;
          font-size: 12px;
          font-family: PingFang SC;
          line-height: 20px;
          text-align: left;
          text-underline-position: from-font;
          text-decoration-skip-ink: none;
        }

        .button-position {
          font-size: 12px;
        }
      }
    }
  }

  .pagination-view {
    display: flex;
    justify-content: right;
    margin-top: 16px;
  }
}
</style>
