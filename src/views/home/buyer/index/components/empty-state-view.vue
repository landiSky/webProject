<template>
  <div v-if="tabsApplication === '1'" class="empty-state-view">
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-01"></div>
        <div v-if="!authentication" class="empty-page-desc">
          如需购买<span class="desc-blue">商城</span
          >内应用，账号需为企业主账号，同时需完成企业认证，「<span
            class="desc-blue desc-cursor"
            @click="authCompany"
            >去认证</span
          >」
        </div>
        <div v-if="authentication" class="empty-page-desc">
          立即「<span class="desc-blue desc-cursor" @click="jumpShoppingMall"
            >前往</span
          >」商城可购买SaaS、独立部署、插件等应用。
        </div>
      </div>
      <t-button
        class="empty-page-button"
        type="outline"
        @click="jumpShoppingMall"
      >
        立即前往商城
      </t-button>
    </div>
    <div v-if="configInfo?.qingFlowSwitch" class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-02"></div>
        <div v-if="!authentication" class="empty-page-desc">
          如需购买<span class="desc-blue">标识轻应用</span
          >，账号需为企业主账号，同时需完成标识轻应用开通，「<span
            class="desc-blue desc-cursor"
            @click="clickActivateService"
            >去开通</span
          >」
        </div>
        <div v-if="authentication" class="empty-page-desc">
          立即「<span class="desc-blue desc-cursor" @click="jumpLightMall"
            >前往</span
          >」标识轻应用选购安装标识轻应用、数智化应用。
        </div>
      </div>
      <t-button class="empty-page-button" type="outline" @click="jumpLightMall">
        前往标识轻应用商城
      </t-button>
    </div>
  </div>
  <div v-if="tabsApplication === '2'" class="empty-state-view">
    <div v-if="configInfo?.qingFlowSwitch" class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-02"></div>
        <div v-if="serviceChecks" class="empty-page-desc">
          <span class="desc-blue">创建标识轻应用</span>
          需完成标识轻应用服务开通，可前往开通「<span
            class="desc-blue desc-cursor"
            @click="clickActivateService"
            >前往</span
          >」
        </div>
        <div v-if="!serviceChecks" class="empty-page-desc">
          立即「<span
            class="desc-blue desc-cursor"
            @click="createLightweightApp"
            >前往</span
          >」无代码工作台构建标识轻应用
        </div>
      </div>
      <t-button
        class="empty-page-button"
        type="outline"
        @click="createLightweightApp"
      >
        创建标识轻应用
      </t-button>
    </div>
    <div v-if="configInfo?.qingFlowSwitch" class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-03"></div>
        <div v-if="serviceChecks" class="empty-page-desc">
          <span class="desc-blue">创建企业数智化应用</span>
          需完成标识轻应用服务开通，可前往开通「<span
            class="desc-blue desc-cursor"
            @click="clickActivateService"
            >前往</span
          >」
        </div>
        <div v-if="!serviceChecks" class="empty-page-desc">
          立即「<span class="desc-blue desc-cursor" @click="showAddDrawer"
            >添加企业数智化应用</span
          >」统一操作入口、高效应用管理
        </div>
      </div>
      <t-button class="empty-page-button" type="outline" @click="showAddDrawer">
        创建企业数智化应用
      </t-button>
    </div>
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-05"></div>
        <div v-if="!authentication" class="empty-page-desc">
          <span class="desc-blue">创建自建接入应用</span>
          需完成企业认证，可前往认证「<span
            class="desc-blue desc-cursor"
            @click="authCompany"
            >去认证</span
          >」
        </div>
        <div v-if="authentication" class="empty-page-desc">
          立即「<span
            class="desc-blue desc-cursor"
            @click="jumpApplicationAccess"
            >前往</span
          >」开发者中心创建SaaS、链接接入应用
        </div>
      </div>
      <t-button
        class="empty-page-button"
        type="outline"
        @click="jumpApplicationAccess"
      >
        创建自建接入应用
      </t-button>
    </div>
  </div>

  <AddForm
    v-if="state.showDrawer"
    :visible="state.showDrawer"
    title="添加企业数智化应用"
    @on-confirm="handleDrawerConfirm"
    @on-cancel="handleDrawerCancel"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from '@tele-design/web-vue';
import { appCreateRedirect } from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { CompanyAuthStatus } from '@/enums/common';
// 添加企业数智化应用
import AddForm from './addForm.vue';

const userStore = useUserStore();
const {
  userInfo,
  userInfoByCompany,
  selectCompany,
  configInfo,
}: Record<string, any> = storeToRefs(userStore);

const router = useRouter();
const emits = defineEmits([
  'confirm',
  'cancel',
  'getApplicationListData',
  'onPositioningService',
  'onAuthentication',
  'onViewDetails',
]);
const props = defineProps({
  tabsApplication: String,
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

const state = reactive<{
  showDrawer: boolean;
}>({
  showDrawer: false,
});

const authentication = computed(() => {
  return userInfoByCompany.value.certificateStatus === CompanyAuthStatus.AUTHED;
});
// 服务是否开通
const serviceChecks = computed(() => {
  return props.packageList.length;
});
// 服务是否授权
const authorizationChecks = computed(() => {
  return props.showService;
});

// 企业认证
const authCompany = () => {
  if (userInfoByCompany.value.certificateStatus === CompanyAuthStatus.UNAUTH) {
    emits('onAuthentication');
  } else if (
    [
      CompanyAuthStatus.TO_CHECK,
      CompanyAuthStatus.REJECT,
      CompanyAuthStatus.AUTHED,
    ].includes(userInfoByCompany.value.certificateStatus)
  ) {
    emits('onViewDetails');
  }
};

const jumpShoppingMall = () => {
  router.push({
    path: '/wow/mall',
  });
};
const jumpLightMall = () => {
  router.push({
    path: '/wow/lightApplicationMall',
  });
};

const clickActivateService = () => {
  if (serviceChecks.value) {
    Modal.warning({
      title: '未开通标识轻应用服务',
      content: '账号未开通标识轻应用服务，无法使用该功能，是否开通？',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '取消',
      okText: '去开通',
      onOk: () => {
        emits('onPositioningService');
      },
    });
    return;
  }
  if (!authorizationChecks.value) {
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

const createLightweightApp = () => {
  if (serviceChecks.value || !authorizationChecks.value) {
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

const showAddDrawer = () => {
  if (serviceChecks.value || !authorizationChecks.value) {
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
  emits('getApplicationListData');
};

const jumpApplicationAccess = () => {
  if (!authentication.value) return;
  const menuCheck = userInfoByCompany.value.menuCodes.some(
    (ele: any) => ele === 'ROUTE_SYSTEM_APP'
  );
  if (!menuCheck) {
    return;
  }
  router.push({
    path: '/devCenter/manage',
  });
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.empty-state-view {
  display: flex;
  gap: 24px;
  justify-content: center;
  width: 100%;
  //   margin: 0 auto 24px;
  background-color: #fff;
  border-radius: 4px;

  .empty-page {
    display: flex;
    flex: 0 4 calc(25% - 12px);
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 268px;
    padding: 28px 24px 24px 24px;
    border-radius: 4px;
    box-shadow: 1px 2px 20px 0 #0f3d9914;

    .empty-page-head {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;

      .empty-page-img {
        width: 64px;
        height: 64px;
        background: red;
      }

      .empty-page-img-01 {
        background: url(@/assets/images/overview/icon-app-01.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-02 {
        background: url(@/assets/images/overview/icon-app-02.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-03 {
        background: url(@/assets/images/overview/icon-app-03.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-04 {
        background: url(@/assets/images/overview/icon-app-04.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-05 {
        background: url(@/assets/images/overview/icon-app-05.png) no-repeat;
        background-size: cover;
      }

      .empty-page-desc {
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;

        .desc-blue {
          color: #0e54d8;
        }

        .desc-cursor {
          cursor: pointer;
        }
      }
    }

    .empty-page-button {
      width: 100%;
    }
  }
}
</style>
