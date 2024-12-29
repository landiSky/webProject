<template>
  <div class="purchased">
    <t-tabs :active-key="tabsApplication" @tab-click="TabClickApplication">
      <t-tab-pane key="1" title="商城购买应用">
        <t-button type="outline" class="botton-top">+创建新应用</t-button>
        <div class="mall-application">
          <div
            v-for="(item, index) in packageList"
            :key="index"
            class="purchased-list"
          >
            <div class="header" @click="togoCheck(item)">
              <div class="avatar">
                <img
                  v-if="item.deliveryType !== 2"
                  :src="`/server/web/file/orderDownloadBySource?name=${item.productLogo}&source=${item.orderSource}&serverId=${item.productServerId}`"
                  alt=""
                />
                <t-avatar
                  v-if="item.deliveryType == 2"
                  :size="36"
                  shape="square"
                  class="font-pangmen"
                  :style="{ fontSize: '20px' }"
                >
                  {{ captureOne(item.productName) }}
                  <!-- {{ captureOne(item?.tagName) }} -->
                </t-avatar>
              </div>
              <div class="desc">
                <span class="title">
                  {{ item.productName }}
                </span>
                <span class="permission">
                  <span class="left">用户权限:</span>
                  <span class="right">普通用户/管理员/工作区创建人</span>
                </span>
              </div>
            </div>
            <t-divider :margin="12" />
            <div class="footer">
              <div class="creation-time">创建时间：2024-12-12 15:00</div>
              <div class="button-position">
                <t-space :size="20">
                  <t-link
                    v-if="userInfoByCompany.primary === AccountType?.MAIN"
                    :hoverable="false"
                    @click="configurationapp(item)"
                    >配置应用</t-link
                  >
                  <t-link
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
      </t-tab-pane>
      <t-tab-pane key="2" title="企业自建应用">
        <t-button type="outline" class="botton-top">+创建新应用</t-button>
        <div class="mall-application">
          <div
            v-for="(item, index) in packageList"
            :key="index"
            class="purchased-list"
          >
            <div class="header" @click="togo(item)">
              <div class="avatar">
                <img
                  :v-if="item.deliveryType != 2"
                  :src="`/server/web/file/download?name=${item.appLogo}`"
                  alt=""
                />
                <t-avatar
                  :v-if="item.deliveryType == 2"
                  :size="36"
                  shape="square"
                  class="font-pangmen"
                  :style="{ fontSize: '20px' }"
                >
                  {{ captureOne(item.productName) }}
                  <!-- {{ captureOne(item?.tagName) }} -->
                </t-avatar>
              </div>
              <div class="desc">
                <span class="title">
                  {{ item.productName }}
                </span>
                <span class="permission">
                  <span class="left">用户权限:</span>
                  <span class="right">普通用户/管理员/工作区创建人</span>
                </span>
              </div>
            </div>
            <t-divider :margin="12" />
            <div class="footer">
              <div class="creation-time">创建时间：2024-12-12 15:00</div>
              <div class="button-position">
                <t-space :size="20">
                  <t-link
                    v-if="userInfoByCompany.primary === AccountType?.MAIN"
                    :hoverable="false"
                    @click="configurationapp(item)"
                    >配置应用</t-link
                  >
                  <t-link
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
      </t-tab-pane>
    </t-tabs>

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
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  authDialogdata,
  selectSelfApps,
  appInfoClientLogin,
  alreadyBuyClientLogin,
  apiAuthStatus,
  apiGetAuth,
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

const router = useRouter();
const userStore = useUserStore();
const {
  userInfo,
  userInfoByCompany,
  selectCompany,
  configInfo,
}: Record<string, any> = storeToRefs(userStore);

// tabs来回切换值
const tabsApplication = ref('1');
console.log(tabsApplication.value, 'tabsApplication');
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
const packageList: Record<string, any> = ref([]);

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

const getPackageList = async () => {
  packageList.value = [];
  if (Number(tabsApplication.value) === 1) {
    // userId 用户id,如果登陆人是企业，则不需要传，如果是企业下得成员，则需要传
    authDialogdata({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id,
    }).then((res) => {
      packageList.value = res || [];
    });
  } else if (Number(tabsApplication.value) === 2) {
    selectSelfApps({
      companyId: userInfoByCompany.value?.companyId,
      userId: userInfoByCompany.value.primary === 1 ? '' : userInfo.value?.id,
    }).then((res) => {
      packageList.value = res || [];
    });
  }
};

// 应用切换
const TabClickApplication = (key: any) => {
  tabsApplication.value = key;
  if (
    userInfoByCompany.value.certificateStatus === 1 ||
    userInfoByCompany.value.nodeStatus === 1
  ) {
    getPackageList();
  }
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
  } else {
    togo(detailData);
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

watch(
  () => userInfoByCompany.value,
  (newV: any) => {
    if (newV?.companyId) {
      getPackageList();
    }
  }
);

onMounted(() => {
  getPackageList();
});
</script>

<style scoped lang="less">
.purchased {
  width: 100%;
  margin: 0 auto 24px;
  padding: 16px 24px 27px;
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
}
</style>
