<template>
  <div v-if="packageList.length" class="service-app">
    <div class="title">标识轻应用</div>
    <div class="card">
      <div
        v-for="(item, index) in packageList"
        :key="index"
        class="package"
        :class="packageClassEnum[index]"
      >
        <div class="top">
          <div class="top-header">
            <div class="top-name">{{ item?.name }}</div>
          </div>
          <div
            v-for="(item2, index2) in item?.introduction"
            :key="index2"
            class="top-text"
          >
            <iconpark-icon name="success"></iconpark-icon>
            <span class="introduce">{{ item2 }}</span>
          </div>
        </div>
        <div class="foot">
          <div>
            <span class="discounted-price orange-yellow">
              {{ item?.lowPrice }}
            </span>
            <span class="company">
              <span class="orange-yellow">.00</span>
              起/年
            </span>
          </div>
          <div
            class="foot-bottom bottom-navy-blue"
            @click="activateService(item)"
          >
            开通服务
          </div>
        </div>
      </div>
    </div>
  </div>
  <LightApplication v-if="showApp && showService" />
  <DigitizedApplications v-if="showApp && showService" />
  <AuthMemberModal
    v-if="authModalVisible"
    :product-id="prodDetail.id"
    @cancel="onAuthCancel"
    @confirm="onAuthConfirm"
    @jump-node="goNode"
  ></AuthMemberModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useOrderStore } from '@/store/modules/order';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getServicePackage, userAuthStatus } from '@/api/buyer/overview';
import { snmsClientLogin } from '@/api/login';
import {
  NodeAuthStatus,
  SaleType,
  orderTypes,
  AccountType,
} from '@/enums/common';
import { Modal, Message } from '@tele-design/web-vue';
import { sm2 } from '@/utils/encrypt';
import AuthMemberModal from '@/views/home/buyer/index/components/authMember.vue';
// 标识轻应用
import LightApplication from './light-application.vue';
// 企业数智化应用
import DigitizedApplications from './digitized-applications.vue';

const packageClassEnum: Record<string, any> = {
  0: '',
  1: 'wathet',
  2: 'navy-blue',
};

const orderStore = useOrderStore();
const router = useRouter();
const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

const authModalVisible = ref(false);
const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const selectVersion = ref<Record<string, any>>({});

const packageList: Record<string, any> = ref([]);
const showApp = ref(false);
const showService = ref(false);

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
      showApp.value = !res.length;
      showService.value = data;
    });
  });
};

const onAuthCancel = () => {
  authModalVisible.value = false;
};

const onAuthConfirm = (memberIdList: string[]): any => {
  const {
    companyId,
    id,
    companyName,
    name,
    deliveryType,
    saleType,
    logo,
    source,
    duration,
  } = prodDetail.value;

  const accountDesc = `${prodDetail.value.companyChildCount}个`;
  const durationDesc = `${duration}个月`;

  if (memberIdList?.length > prodDetail.value?.companyChildCount) {
    Message.warning('授权人数已超出购买套餐人数，请修改套餐或授权人数');
    return;
  }

  authModalVisible.value = false;

  // TODO 封装确认订单需要的字段
  orderStore.createOrderInfo = {
    companyId,
    productId: id,
    deliveryVersionId: selectVersion.value.id ?? '',
    saasAppId: selectVersion.value.saasAppId ?? '',
    price: `${prodDetail.value.lowPrice}.00`,
    accountDesc,
    durationDesc,
    accountId: '',
    durationId: '',
    companyName,
    name,
    deliveryType: deliveryType ?? 0,
    logo,
    orderSource: source,
    saleType,
    memberIdList,
    productType: orderTypes.SPECIAL_SAAS,
    accountCount: prodDetail.value.companyChildCount,
    buyDuration: duration,
  };

  router.push({
    path: '/order/confirm',
  });
};

// 开通服务
const activateService = (item: any) => {
  if (userInfoByCompany.value?.primary === AccountType.UNAUTH) {
    Modal.info({
      title: '使用提醒',
      content: '需申请企业认证后使用，请先进行企业认证。',
      titleAlign: 'start',
      hideCancel: true,
      cancelText: '',
      okText: '关闭',
      onOk: () => {},
    });
    return false;
  }
  if (userInfoByCompany.value?.primary === AccountType.MEMBER) {
    Modal.warning({
      title: '使用提醒',
      content: `请联系企业管理员开通标识轻应用服务：${userInfoByCompany.value?.companyPhone}`,
      titleAlign: 'start',
      okText: '好的',
    });
    return false;
  }
  if (userInfoByCompany.value?.nodeStatus !== NodeAuthStatus.AUTHED) {
    Modal.info({
      title: '使用提醒',
      content: '本服务需申请企业节点后使用，请先开通或绑定企业节点。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不开通',
      okText: '去开通',
      onOk: () => {
        clickIdService('/ent/apply');
      },
    });
    return false;
  }
  prodDetail.value = item;
  authModalVisible.value = true;
  return true;
};

watch(
  () => userInfoByCompany.value,
  (newV: any) => {
    if (newV?.companyId) {
      getPackageList();
    }
  }
);

onMounted(async () => {
  getPackageList();
});
</script>

<style scoped lang="less">
.service-app {
  width: 100%;
  margin: 0 auto 24px;
  padding: 20px 24px;
  background: #f3f6fd;
  border: 1px solid #e5e8ef;
  border-radius: 4px;
}

.title {
  color: #223354;
  font-weight: 500;
  font-size: 20px;
  font-family: PingFang SC;
  line-height: 28px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.card {
  display: flex;
  gap: 36px;
  margin-top: 20px;

  .package {
    display: flex;
    flex-direction: column;
    width: 242px;
    background: url('../image/package_01.png') no-repeat;
    background-size: 100% 100%;
    border: 1px solid #fff;
    border-radius: 4px;

    &.wathet {
      background: url('../image/package_02.png') no-repeat;
    }

    &.navy-blue {
      background: url('../image/package_03.png') no-repeat;

      .foot > .bottom-navy-blue {
        color: #fff;
        background: linear-gradient(271.13deg, #1664ff 14.58%, #3ca8e7 100.85%);
      }
    }

    .top {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 272px;
      padding: 24px 32px 12px;
      font-family: PingFang SC;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;

      .top-header {
        .top-name {
          color: #223354;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
        }
      }

      .top-text {
        display: flex;
        gap: 8px;
        align-items: center;
        height: 22px;
        font-size: 14px;

        .introduce {
          color: #1d2129;
          font-weight: 500;
        }
      }
    }

    .foot {
      display: flex;
      flex-direction: column;
      padding: 12px 32px 24px 32px;
      font-family: PingFang SC;
      background: #fff;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;

      .discounted-price {
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }

      .company {
        color: #4e5969;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
      }

      .orange-yellow {
        color: #fa9600;
      }

      .foot-bottom {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 296px;
        height: 32px;
        margin-top: 16px;
        padding: 6px 16px;
        color: #1664ff;
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        background: #fff;
        border: 1px solid #1664ff;
        border-radius: 2px;
        cursor: pointer;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }
    }
  }
}
</style>
