<template>
  <div class="application-guide-box">
    <div class="title">应用使用引导</div>
    <div class="guide-box">
      <div class="item-box">
        <div class="header-box">
          <span class="sub-title">应用介绍</span>
          <span class="step step1" />
        </div>
        <div class="content">
          <div class="group-title"> <div class="no-top">初步了解</div></div>
          <div class="content-item" @click="authCompany"
            ><iconpark-icon class="icon" name="intro1" size="20px" />企业认证
          </div>
          <div
            v-if="configInfo?.qingFlowSwitch"
            class="content-item"
            @click="authLightApply"
            ><iconpark-icon
              class="icon"
              name="intro2"
              size="20px"
            />标识轻应用服务开通
          </div>
          <div class="content-item" @click="showPreview"
            ><iconpark-icon
              class="icon"
              name="intro3"
              size="20px"
            />平台能力介绍
          </div>
          <div
            v-if="configInfo?.qingFlowSwitch"
            class="content-item"
            @click="jumpLightMall"
            ><iconpark-icon
              class="icon"
              name="intro4"
              size="20px"
            />典型应用介绍
          </div>
        </div>
        <iconpark-icon
          class="blue-right-arrow"
          name="blue-right-arrow"
          size="24px"
        />
      </div>
      <div class="item-box item-360-box">
        <div class="header-box">
          <span class="sub-title">应用构建</span>
          <span class="step step2" />
        </div>
        <div class="content">
          <div v-if="configInfo?.qingFlowSwitch" class="content-group">
            <div class="group-title">
              <div class="no-top">
                创建标识轻应用
                <t-tooltip
                  content="标识轻应用提供模版创建可支持一键安装，可从头开始创建，根据你的需求进行增添功能"
                  is-bright
                  ><icon-question-circle :size="14" class="icon-circle" />
                </t-tooltip>
              </div>
            </div>
            <div class="group-section">
              <div class="content-item" @click="templateCreation"
                ><iconpark-icon
                  class="icon"
                  name="intro5"
                  size="20px"
                />通过模版创建</div
              >
              <div class="content-item" @click="createFromScratch"
                ><iconpark-icon
                  class="icon"
                  name="intro6"
                  size="20px"
                />从头开始创建</div
              >
            </div>
          </div>

          <div class="content-group">
            <div class="group-title">
              <div>自建应用链接接入</div>
              <div v-if="configInfo?.qingFlowSwitch">创建数智化应用</div>
            </div>
            <div class="group-section">
              <div class="content-item" @click="linkAccessApplication"
                ><iconpark-icon
                  class="icon"
                  name="intro7"
                  size="20px"
                />链接接入应用</div
              >
              <div
                v-if="configInfo?.qingFlowSwitch"
                class="content-item"
                @click="showAddDrawer"
                ><iconpark-icon
                  class="icon"
                  name="intro8"
                  size="20px"
                />新建企业数智化应用</div
              >
            </div>
          </div>
          <div class="content-group">
            <div class="group-title">
              <div>SAAS应用接入</div>
            </div>
            <div class="group-section">
              <div class="content-item" @click="jumpApplicationAccess"
                ><iconpark-icon
                  class="icon"
                  name="intro9"
                  size="20px"
                />应用接入</div
              >
              <div class="content-item" @click="jumpPlatformIntegrationDocument"
                ><iconpark-icon
                  class="icon"
                  name="intro10"
                  size="20px"
                />应用开发指南</div
              >
            </div>
          </div>
        </div>
        <iconpark-icon
          class="blue-right-arrow"
          name="blue-right-arrow"
          size="24px"
        />
      </div>
      <div class="item-box">
        <div class="header-box">
          <span class="sub-title">应用价值变现</span>
          <span class="step step3" />
        </div>
        <div class="content">
          <div class="group-title">
            <div class="no-top">通过标识分布式网络推广</div></div
          >
          <div class="content-item" @click="jumpNewProduct"
            ><iconpark-icon
              class="icon"
              name="intro11"
              size="20px"
            />应用发布</div
          >
          <div class="content-item" @click="applicationReleaseGuide"
            ><iconpark-icon
              class="icon"
              name="intro12"
              size="20px"
            />应用发布指南</div
          >
          <div class="content-item" @click="jumpOrder"
            ><iconpark-icon
              class="icon"
              name="intro13"
              size="20px"
            />交易中心</div
          >
        </div>
      </div>
    </div>
    <EditModalFullscreen
      v-if="gotoverifys"
      :data="state.editData"
      @confirm="onEditModalConfirmcode"
      @cancel="cancelgotoverifys"
    />
    <!-- 详情弹窗 -->
    <DetailsModalFullscreen
      v-if="detailflag"
      :data="state.editData"
      @confirm="onEditModalConfirmflag"
      @cancel="detailflagclick"
    />
    <AddForm
      v-if="state.showDrawer"
      :visible="state.showDrawer"
      title="添加企业数智化应用"
      @on-confirm="handleDrawerConfirm"
      @on-cancel="handleDrawerCancel"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  defineEmits,
  defineProps,
  onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { AccountType, CompanyAuthStatus, NodeAuthStatus } from '@/enums/common';
import { snmsClientLogin } from '@/api/login';
import { appCreateRedirect } from '@/api/buyer/overview';
import { apiFooterInfo } from '@/api/decoration/decoration-tools';
import { Modal, Message } from '@tele-design/web-vue';
import { sm2 } from '@/utils/encrypt';
import { useRouter } from 'vue-router';
import EditModalFullscreen from '@/components/dataoverview/components/edit-modal-fullscreen.vue';
import DetailsModalFullscreen from '@/components/dataoverview/components/details-modal-fullscreen.vue';
// 添加企业数智化应用
import AddForm from './addForm.vue';

const router = useRouter();

const emits = defineEmits(['positioningService', 'getChildList']);
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

// 服务是否开通
const serviceChecks = computed(() => {
  return props.packageList.length;
});
// 服务是否授权
const authorizationChecks = computed(() => {
  return props.showService;
});

const state = reactive({
  editData: {
    id: '1111',
    statusled: 0,
  },
  showPreview: false,
  showDrawer: false,
});
const footerData: Record<string, any> = ref({});

const detailflag = ref(false);
const gotoverifys = ref(false);

const userStore = useUserStore();
const {
  userInfo,
  userInfoByCompany,
  selectCompany,
  configInfo,
}: Record<string, any> = storeToRefs(userStore);

const showPreview = () => {
  const routeData = router.resolve({
    name: 'wowFileFreview',
    query: {
      fileurl: `/server/web/file/download?name=${configInfo.value?.platformIntroduction}`,
    },
  });
  window.open(routeData?.href, '_blank');
};

// 企业认证
const authCompany = () => {
  if (userInfoByCompany.value.certificateStatus === CompanyAuthStatus.UNAUTH) {
    gotoverifys.value = true;
  } else if (
    [
      CompanyAuthStatus.TO_CHECK,
      CompanyAuthStatus.REJECT,
      CompanyAuthStatus.AUTHED,
    ].includes(userInfoByCompany.value.certificateStatus)
  ) {
    detailflag.value = true;
  }
};
const clickActivateService = () => {
  Modal.warning({
    title: '未开通标识轻应用服务',
    content: '账号未开通标识轻应用服务，无法使用该功能，是否开通？',
    titleAlign: 'start',
    hideCancel: false,
    cancelText: '取消',
    okText: '去开通',
    onOk: () => {
      emits('positioningService');
    },
  });
};
// 轻流开通服务
const authLightApply = () => {
  if (serviceChecks.value) {
    clickActivateService();
    return false;
  }
  return true;
};
// 通过模版创建
const templateCreation = () => {
  const routeData = router.resolve({
    path: '/wow/lightApplicationMall',
  });
  window.open(routeData?.href, '_blank');
};
// 从头开始创建
const createFromScratch = () => {
  if (serviceChecks.value) {
    clickActivateService();
    return false;
  }
  // 跳转轻流平台
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
  };
  appCreateRedirect(params).then((res: any) => {
    window.open(res);
  });
  return true;
};
// 链接接入应用
const linkAccessApplication = () => {
  if (userInfoByCompany.value?.primary === AccountType.UNAUTH) {
    authCompany();
    return false;
  }
  router.push({
    path: '/devCenter/manage',
  });
  return true;
};
const showAddDrawer = () => {
  if (serviceChecks.value) {
    clickActivateService();
    return false;
  }
  state.showDrawer = true;
  return true;
};

const handleDrawerCancel = () => {
  state.showDrawer = false;
};
const handleDrawerConfirm = () => {
  handleDrawerCancel();
  emits('getChildList');
};
// 典型应用介绍
const jumpLightMall = () => {
  const routeData = router.resolve({
    path: '/wow/mall',
  });
  window.open(routeData?.href, '_blank');
};
// 应用接入
const jumpApplicationAccess = () => {
  if (userInfoByCompany.value?.primary === AccountType.UNAUTH) {
    authCompany();
  }
  router.push({
    path: '/devCenter/manage',
  });
};
// 应用开发指南
const jumpPlatformIntegrationDocument = () => {
  // router.push({
  //   path: '/wow/doc',
  // });
  const url =
    process.env.NODE_ENV !== 'production'
      ? 'http://id-pointer-sdk.pre.idx.space/docs/saas/writing-purpose'
      : 'https://snms.teleinfo.cn/zst-docs/saas/writing-purpose';
  window.open(url, '_blank');
};
// 应用发布指南
const applicationReleaseGuide = () => {
  window.open(footerData.value.sellerManualUrl);
};
// 应用发布-商品管理
const jumpNewProduct = () => {
  if (userInfoByCompany.value?.primary === AccountType.UNAUTH) {
    authCompany();
    return false;
  }
  router.push({
    path: '/seller/goods',
  });
  return true;
};
// 订单管理-卖家
const jumpOrder = () => {
  if (userInfoByCompany.value?.primary === AccountType.UNAUTH) {
    authCompany();
    return false;
  }
  router.push({
    path: '/seller/order',
  });
  return true;
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
};

const footerInfoDetails = async () => {
  await apiFooterInfo()
    .then((res: any) => {
      if (res.code !== 200) {
        return;
      }
      const linkDetail =
        (res.data.linkDetail && JSON.parse(res.data.linkDetail)) || [];

      footerData.value = {
        ...res.data,
        linkDetail,
      };
    })
    .catch(() => {});
};

onMounted(() => {
  footerInfoDetails();
});
</script>

<style scoped lang="less">
.application-guide-box {
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e5e8ef;
  border-radius: 4px;

  .title {
    margin-bottom: 20px;
    color: #223354;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .guide-box {
    display: flex;

    .item-box {
      position: relative;
      width: 192px;
      height: 278px;
      margin-right: 24px;
      padding: 12px 16px;
      background: #f6f7fb;
      border-radius: 6px;

      .blue-right-arrow {
        position: absolute;
        top: 50%;
        right: -24px;
        transform: translateY(-50%);
      }

      &:last-child {
        margin-right: 0;
      }

      &.item-360-box {
        width: 360px;
      }

      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .sub-title {
          display: flex;
          justify-content: space-between;
          color: #1d2129;
          font-weight: 500;
          font-size: 14px;
        }

        .step {
          width: 52px;
          height: 35px;
          background: url('../image/step1.png') no-repeat;
          background-size: cover;
        }

        .step2 {
          background: url('../image/step2.png') no-repeat;
          background-size: cover;
        }

        .step3 {
          background: url('../image/step3.png') no-repeat;
          background-size: cover;
        }
      }

      .content {
        .group-title {
          display: flex;

          > div {
            width: 160px;
            margin-top: 12px;
            margin-right: 8px;
            color: #4e5969;
            font-size: 12px;
            line-height: 20px;
          }

          .no-top {
            margin-top: 4px;
          }
        }
        // 分组
        .content-group {
          .group-title {
            > div {
              margin-bottom: 8px;
            }
          }

          .group-section {
            display: flex;

            .content-item {
              margin-top: 0;
              margin-right: 8px;
            }
          }

          .icon-circle {
            margin-left: 4px;
          }
        }

        .content-item {
          width: 160px;
          height: 36px;
          margin-top: 8px;
          padding: 0 8px;
          font-size: 12px;
          line-height: 36px;
          background: #fff;
          border-radius: 3px;
          cursor: pointer;

          &.click {
            cursor: pointer;
          }

          .icon {
            margin-right: 8px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>
