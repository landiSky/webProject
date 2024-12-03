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
            <div class="top-name-desc">{{
              packageDataListEnum[index].desc
            }}</div>
          </div>
          <div
            v-for="(item2, index2) in packageDataListEnum[index].textList"
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
          <div class="light-gray-color">
            支持{{ item?.companyChildCount }}人，增购{{
              item?.avgPrice
            }}元/人/年
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
import { onMounted, ref, watch } from 'vue';
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

const packageClassEnum: Record<string, any> = {
  0: '',
  1: 'wathet',
  2: 'navy-blue',
};

const packageDataListEnum: Record<string, any> = [
  {
    desc: '简单业务场景 灵活快速易上手',
    textList: [
      '支持50人',
      '百款免费标识轻应用',
      '应用个性化搭建',
      '60万条数据总量',
      '企业数据报表',
      '免费在线培训',
    ],
  },
  {
    desc: '多业务场景 多系统对接 打通内外用户 开放性更高',
    textList: [
      '支持80人',
      '包括基础版所有功能',
      '100万条数据总量',
      '多来源数据采集管理',
      '开放系统对接能力',
    ],
  },
  {
    desc: '简单业务场景 灵活快速易上手',
    textList: [
      '支持100人',
      '包括增强版所有功能',
      '200万条数据总量',
      '企业级安全能力',
    ],
  },
];

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
    buyDuration: duration,
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
  width: 1200px;
  height: 530px;
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
    width: 360px;
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
      height: 294px;
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

        .top-name-desc {
          margin-top: 4px;
          color: #86909c;
          font-weight: 400;
          font-size: 12px;
          line-height: 18px;
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
      height: 142px;
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

      .light-gray-color {
        display: flex;
        margin: 4px 0 16px 0;
        color: #4e5969;
        font-weight: 400;
        font-size: 13px;
        line-height: 22px;
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
