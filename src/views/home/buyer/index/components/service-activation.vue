<template>
  <div v-if="packageList.length" class="service-app">
    <div>
      <div class="title">标识轻应用</div>
      <div class="card">
        <div
          v-for="(item, index) in packageList"
          :key="index"
          class="package"
          :class="packageEnum[index]"
        >
          <div class="top">
            <div class="top-name">{{ item?.name }}</div>
            <div class="top-text">
              <span class="label">免费应用</span>
              <span class="quantity"> {{ item?.freeAppCount }}个 </span>
            </div>
            <div class="top-text">
              <span class="label">企业子账号</span>
              <span class="quantity"> {{ item?.companyChildCount }}个 </span>
            </div>
          </div>
          <div class="foot">
            <div>
              <span class="discounted-price orange-yellow">
                {{ item?.lowPrice }}
              </span>
              <span class="company">
                <span class="orange-yellow">.00</span>
                元/年
              </span>
            </div>
            <div class="foot-explain">
              <span class="original-price">
                {{ item?.originalPrice }}元/年
              </span>
              <span class="about"> 约{{ item?.avgPrice }}每月 </span>
            </div>
            <div
              class="foot-bottom bottom-wathet bottom-navy-blue"
              @click="activateService(item)"
            >
              开通服务
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LightApplication v-if="!packageList.length" />
  <DigitizedApplications v-if="!packageList.length" />
  <AuthMemberModal
    v-if="authModalVisible"
    :product-id="prodDetail.id"
    :delivery-set-id="selectVersion.id"
    @cancel="onAuthCancel"
    @confirm="onAuthConfirm"
  ></AuthMemberModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useOrderStore } from '@/store/modules/order';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getServicePackage } from '@/api/buyer/overview';
import { snmsClientLogin } from '@/api/login';
import { NodeAuthStatus, SaleType, orderTypes } from '@/enums/common';
import { Modal, Message } from '@tele-design/web-vue';
import { sm2 } from '@/utils/encrypt';
import AuthMemberModal from '@/views/wow/mall/detail/authMember.vue';
// 标识轻应用
import LightApplication from './light-application.vue';
// 企业数智化应用
import DigitizedApplications from './digitized-applications.vue';

const packageEnum: Record<string, any> = {
  0: '',
  1: 'wathet',
  2: 'navy-blue',
};
const orderStore = useOrderStore();
const router = useRouter();
const userStore = useUserStore();
const { userInfo, userInfoByCompany, configInfo }: Record<string, any> =
  storeToRefs(userStore);

const authModalVisible = ref(false);
const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const selectVersion = ref<Record<string, any>>({});

const packageList: Record<string, any> = ref([]);

const getPackageList = () => {
  const params = {
    companyId: userInfoByCompany.value?.companyId,
  };
  getServicePackage(params).then((res: any) => {
    packageList.value = res;
    console.log(res);
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
  } = prodDetail.value;

  const durationDesc = '12个月';

  if (memberIdList?.length > prodDetail.value?.companyChildCount) {
    Message.warning(
      '已超出授权人数已超出购买套餐人数，请修改套餐或授权人数购买账号数'
    );
    return;
  }

  authModalVisible.value = false;

  // TODO 封装确认订单需要的字段
  orderStore.createOrderInfo = {
    companyId,
    productId: id,
    deliveryVersionId: selectVersion.value.id ?? '',
    saasAppId: selectVersion.value.saasAppId ?? '',
    price: prodDetail.value.lowPrice,
    accountDesc: prodDetail.value.companyChildCount,
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
    buyDuration: 12,
  };

  router.push({
    path: '/order/confirm',
  });
};

// 开通服务
const activateService = (item: any) => {
  if (userInfoByCompany?.nodeStatus === NodeAuthStatus?.AUTHED) {
    Modal.info({
      title: '使用提醒',
      content: '本服务需申请企业节点后使用，请先开通或绑定企业节点。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不开通',
      okText: '去开通',
      onOk: () => {
        const { companyId } = userInfoByCompany.value || {};
        const params = {
          companyId: userInfo.value?.isAdmin
            ? userInfo.value?.companyId
            : companyId,
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
          };
          const sm2data = sm2(
            JSON.stringify(data),
            userStore.configInfo?.publicKey
          );
          window.open(`${res?.data?.data}&data=${sm2data}`);
        });
      },
    });
    return false;
  }
  prodDetail.value = item;
  authModalVisible.value = true;
  return true;
};

onMounted(async () => {
  getPackageList();
});
</script>

<style scoped lang="less">
.service-app {
  width: 1200px;
  height: 380px;
  margin: 0 auto 24px;
  padding: 16px 24px 32px;
  background: url('./image/light -application-bg.png') no-repeat;
  background-size: cover;
  border: 1px solid rgba(229, 232, 239, 1);
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
    gap: 8px;
    width: 360px;
    height: 278px;
    background: #f2f3f8a8;
    border: 1px solid #fff;
    border-radius: 4px;

    &.wathet {
      background: #e7f0fca8;
    }

    &.navy-blue {
      background: #b9d3ff54;

      .foot > .bottom-navy-blue {
        color: #fff;
        background: linear-gradient(271.13deg, #1664ff 14.58%, #3ca8e7 100.85%);
      }
    }

    .top {
      display: flex;
      flex: 0 1 50%;
      flex-direction: column;
      gap: 12px;
      padding: 24px 32px 12px;
      font-family: PingFang SC;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;

      .top-name {
        color: #223354;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
      }

      .top-text {
        display: flex;
        font-size: 14px;
        line-height: 22px;

        .label {
          width: 70px;
          margin-right: 8px;
          color: #4e5969;
          font-weight: 400;
        }

        .quantity {
          color: #1d2129;
          font-weight: 500;
        }
      }
    }

    .foot {
      display: flex;
      flex: 0 1 50%;
      flex-direction: column;
      gap: 12px;
      padding: 12px 32px 24px;
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

      .foot-explain {
        display: flex;
        gap: 12px;
        font-weight: 400;
        font-size: 13px;
        line-height: 22px;

        .original-price {
          color: #86909c;
          text-decoration: line-through;
        }

        .about {
          color: #4e5969;
        }
      }

      .foot-bottom {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 296px;
        height: 32px;
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
