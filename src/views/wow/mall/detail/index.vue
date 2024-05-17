<template>
  <div class="wrap">
    <div class="productIntro">
      <div class="baseInfo">
        <div class="left">
          <div class="bigImg">
            <img
              :src="
                bigImgPath
                  ? `/server/web/file/download?name=${bigImgPath}&productId=${prodDetail.id}`
                  : defaultImg
              "
            />
          </div>

          <ul class="imgList">
            <li
              v-for="(imgPath, index) in previewImgList"
              :key="index"
              @mouseenter="bigImgPath = imgPath"
            >
              <img
                :src="`/server/web/file/download?name=${imgPath}&productId=${prodDetail.id}`"
                alt=""
                :class="{ active: bigImgPath === imgPath }"
              />
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="header">
            <span class="productName">{{ prodDetail.name }}</span>
            <!-- <span class="tag">标签一</span> -->
          </div>
          <div class="description">
            <t-typography-paragraph
              style="margin-bottom: 0"
              :ellipsis="{
                rows: 7,
                showTooltip: {
                  type: 'tooltip',
                  props: {
                    isBright: true,
                  },
                },
              }"
            >
              {{ prodDetail.introduction }}
            </t-typography-paragraph>
          </div>
          <div class="price">
            <span>产品价格:</span>
            <span v-if="computing">计算中...</span>
            <span v-else-if="prodDetail.saleType === SaleType.CONSULT">
              价格面议
            </span>
            <span v-else>¥ {{ price || '-' }}</span>
          </div>

          <div class="custom">
            <span class="label">版本:</span>
            <span>
              <template v-if="deliveryList?.length">
                <t-radio-group
                  v-model="priceParams.deliveryVersionId"
                  type="button"
                  @change="onVersionChange"
                >
                  <t-radio
                    v-for="version in deliveryList"
                    :key="version.id"
                    :value="version.id"
                    >{{ version.name }}
                  </t-radio>
                </t-radio-group>
              </template>
              <span v-else>-</span>
            </span>
          </div>
          <div v-if="prodDetail.saleType !== SaleType.CONSULT" class="custom">
            <span class="label">账号数:</span>
            <span v-if="prodDetail.saleType === SaleType.PACKAGE">
              <t-radio-group
                v-model="priceParams.accountId"
                type="button"
                @change="onRadioChange"
              >
                <t-radio
                  v-for="account in selectVersion.accountNumList"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.accountNum }}个账号
                </t-radio>
              </t-radio-group>
            </span>
            <span v-else>不限</span>
          </div>
          <div v-if="prodDetail.saleType !== SaleType.CONSULT" class="custom">
            <span class="label">选择时长:</span>
            <span v-if="prodDetail.saleType === SaleType.PACKAGE">
              <t-radio-group
                v-model="priceParams.durationId"
                type="button"
                @change="onRadioChange"
              >
                <t-radio
                  v-for="durationItem in selectVersion.durationList"
                  :key="durationItem.id"
                  :value="durationItem.id"
                >
                  <span v-if="durationItem.duration > 0">
                    {{ durationItem.duration }}个月
                  </span>
                  <span v-else>不限</span>
                </t-radio>
              </t-radio-group>
            </span>
            <span v-else>不限</span>
          </div>

          <t-button
            type="primary"
            size="large"
            style="width: 296px"
            :disabled="isPreview"
            @click="clickAddCart"
            >立即购买</t-button
          >
        </div>
      </div>
      <div class="intro">
        <div ref="introParentRef" class="template">
          <template v-if="templateList.length">
            <div class="nav" :class="{ fixed: fixedTop }">
              <span v-for="(item, index) in templateList" :key="index">
                <span
                  :class="{ active: activeNavIndex === index }"
                  @click="clickNav(index)"
                >
                  {{ item.moduleName }}
                </span>
              </span>
            </div>
            <div
              v-for="(item, index) in templateList"
              :id="`template${index}`"
              :key="index"
              :ref="setNavRef"
            >
              <component
                :is="forCompList[item.type - 1]"
                :template-data="item"
                :bg-index="index"
                :product-id="prodDetail.id"
              ></component>
            </div>
          </template>
          <t-empty v-else description="暂无配置详情信息">
            <template #image>
              <iconpark-icon name="zanwushuju" size="100px"></iconpark-icon>
            </template>
          </t-empty>
        </div>
        <div class="consult">
          <span class="title">服务商资质</span>
          <span class="header">服务商名称：北京泰尔英福科技有限公司</span>
          <t-button type="primary" size="large" @click="buyConsult"
            >购买咨询</t-button
          >
        </div>
      </div>
    </div>
  </div>
  <AuthMemberModal
    v-if="authModalVisible"
    :product-id="prodDetail.id"
    :delivery-set-id="selectVersion.id"
    @cancel="onAuthCancel"
    @confirm="onAuthConfirm"
  ></AuthMemberModal>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message, Modal } from '@tele-design/web-vue';

import { apiProductDetail, apiComputePrice } from '@/api/wow/mall';
import { SaleType, AccountType } from '@/enums/common';
import { useUserStore } from '@/store/modules/user';

import { useOrderStore } from '@/store/modules/order';
import WowFooter from '@/views/wow/components/wowFooter/index.vue';
import defaultImg from '@/assets/images/wow/mall/default_product_logo.png';
import { apiDataPoint } from '@/api/data-point';
import Template1 from './layout/template1.vue';
import Template2 from './layout/template2.vue';
import Template3 from './layout/template3.vue';
import Template4 from './layout/template4.vue';
import Template5 from './layout/template5.vue';
import Template6 from './layout/template6.vue';

import AuthMemberModal from './authMember.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const orderStore = useOrderStore();
const authModalVisible = ref(false);
const priceParams = ref<Record<string, any>>({
  deliveryVersionId: null,
  accountId: null,
  durationId: null,
});
const previewImgList = ref<string[]>([]);
const bigImgPath = ref();
const versionObj: Record<string, any> = {}; // {【versionId】: {}}, 目的是 版本radio变更后，能够获取到当前选择的 version data
const computing = ref(false);
const price = ref();
const templateList = ref<Record<string, any>[]>([]);
const navRef = ref<any[]>([]); // ref<any[]>([]);
const forCompList = [
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
];

const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const deliveryList = ref<Record<string, any>[]>([]);
const selectVersion = ref<Record<string, any>>({});
const isPreview = ref(false);
const introParentRef = ref();
const fixedTop = ref(false);
const activeNavIndex = ref(0);

const setNavRef = (el: any) => {
  if (el) {
    navRef.value.push(el);
  }
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
  const { accountNumList, durationList } = selectVersion.value;
  const { accountId, durationId } = priceParams.value;

  let accountDesc = '不限';
  let durationDesc = '不限';

  let accountItem = null;
  if (saleType === SaleType.PACKAGE) {
    accountItem = accountNumList.find(
      (item: Record<string, any>) => item.id === accountId
    );
    const durationItem = durationList.find(
      (item: Record<string, any>) => item.id === durationId
    );
    accountDesc = `${accountItem.accountNum}个`;
    durationDesc =
      durationItem.duration > 0 ? `${durationItem.duration}个月` : '不限'; // 套餐里时长有不限
  }

  if (
    (accountItem?.accountNum || 0) > 0 &&
    memberIdList?.length > accountItem?.accountNum - 1
  ) {
    Message.warning('已超出购买账号数');
    return;
  }

  authModalVisible.value = false;

  // TODO 封装确认订单需要的字段
  orderStore.createOrderInfo = {
    companyId,
    productId: id,
    deliveryVersionId: selectVersion.value.id,
    price: price.value,
    accountDesc,
    durationDesc,
    accountId,
    durationId,
    companyName,
    name,
    deliveryType,
    logo,
    orderSource: source,
    saleType,
    memberIdList,
  };

  router.push({
    path: '/order/confirm',
  });
};

const clickAddCart = (): void => {
  // TODO w: 立即购买打点
  console.log('立即购买打点', route.params.id);
  const { userInfo, userInfoByCompany } = userStore;

  if (!userInfo?.userId) {
    sessionStorage.setItem('mallDetailPath', route.fullPath);
    userStore.jumpToLogin('wowMallDetail'); // 目的是从这里跳到登录页的，登录后再回来
    return;
  }

  if (userInfoByCompany?.companyId === prodDetail.value.companyId) {
    Message.warning('无法购买本企业商品!');
    return;
  }

  if (userInfoByCompany?.primary === AccountType.MAIN) {
    // 标识应用需要判断是否做过企业节点认证
    authModalVisible.value = true;

    return;
  }

  if (userInfoByCompany?.primary === AccountType.MEMBER) {
    Modal.warning({
      title: '请联系企业管理员购买开通服务',
      titleAlign: 'start',
      okText: '好的',
      hideCancel: true,
      content: '',
    });

    return;
  }

  if (userInfoByCompany?.primary === AccountType.UNAUTH) {
    Modal.info({
      title: '使用提醒',
      content: '需申请企业认证后使用，请先进行企业认证。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不认证',
      okText: '去认证',
      onOk: () => {
        router.push({
          path: '/buyer/index',
        });
      },
    });
  }
};

const getPrice = () => {
  if (prodDetail.value.saleType === SaleType.CONSULT) {
    return;
  }
  computing.value = true;
  apiComputePrice({
    productId: prodDetail.value.id,
    ...priceParams.value,
  })
    .then((data) => {
      price.value = data;
    })
    .catch(() => {})
    .finally(() => {
      computing.value = false;
    });
};

const onVersionChange = (versionId: string) => {
  selectVersion.value = versionObj[versionId];
  const { id, accountNumList, durationList } = selectVersion.value;

  priceParams.value.deliveryVersionId = id;
  priceParams.value.accountId = accountNumList?.[0].id;
  priceParams.value.durationId = durationList?.[0].id;
  getPrice();
};
const onRadioChange = () => {
  getPrice();
};

const clickNav = (index: number) => {
  activeNavIndex.value = index;
  navRef.value[index].scrollIntoView(true);

  // nav 吸顶后会占用 46 的高度，如果不加，会覆盖一部分 title
  const topNum = document.querySelector('#scrollMain')?.scrollTop || 0;
  document.querySelector('#scrollMain')?.scrollTo({
    top: topNum - 92,
  });
};

const buyConsult = () => {
  // TODO w: 购买咨询打点
  console.log('购买咨询打点', route.params.id);
  // apiDataPoint(route.params.id as string, null, 4, 4);
  window.open('https://www.wjx.top/vm/rZCiupC.aspx#', '_blank');
};

const onIntroScroll = () => {
  const { top } = introParentRef.value?.getBoundingClientRect() || {};

  fixedTop.value = Boolean(top < 70);
};

onMounted(() => {
  // TODO w: 商品详情打点
  console.log('商品详情打点', route.params.id);
  // apiDataPoint(route.params.id as string, null, 4, 3);
  isPreview.value = route.name === 'wowMallPreview'; // 预览模式不允许点击【立即购买】
  apiProductDetail({ id: route.params.id })
    .then((data) => {
      prodDetail.value = data;
      deliveryList.value = data.productDeliverySetList || [];
      previewImgList.value = data.detailImg.split(',');
      bigImgPath.value = previewImgList.value?.[0];

      templateList.value = JSON.parse(data.detail);

      const { saleType } = data;

      if (Array.isArray(deliveryList.value) && deliveryList.value.length) {
        if ([SaleType.ONEOFF, SaleType.PACKAGE].includes(saleType)) {
          // 一口价
          //   priceParams.value.deliveryVersionId = deliveryList.value[0].id;
          //   getPrice();
          // } else if (saleType === SaleType.PACKAGE) {
          deliveryList.value.forEach((item: Record<string, any>) => {
            versionObj[item.id] = item;
          });

          //  套餐，初始化去计算
          selectVersion.value = deliveryList.value?.[0];
          const { id, accountNumList, durationList } = selectVersion.value;

          priceParams.value.deliveryVersionId = id;
          priceParams.value.accountId = accountNumList?.[0].id;
          priceParams.value.durationId = durationList?.[0].id;
          getPrice();
        } else if (saleType === SaleType.CONSULT) {
          deliveryList.value.forEach((item: Record<string, any>) => {
            versionObj[item.id] = item;
          });

          selectVersion.value = deliveryList.value?.[0];
          const { id } = selectVersion.value;

          priceParams.value.deliveryVersionId = id;
        }
      }
    })
    .catch(() => {});

  window.addEventListener('scroll', onIntroScroll, true);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onIntroScroll);
});
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;

  .productIntro {
    width: 1176px;
    margin-top: 32px;

    .baseInfo {
      display: flex;
      align-items: start;
      width: 100%;
      margin-bottom: 16px;
      padding: 24px;
      background-color: #fff;
      border-radius: 4px;

      .left {
        margin-right: 32px;

        .bigImg {
          img {
            width: 450px;
            height: 450px;
          }
        }

        .imgList {
          display: flex;
          margin-top: 14px;

          img {
            width: 68px;
            height: 68px;
            margin-right: 8px;
            border-radius: 4px;

            &:hover,
            &.active {
              box-shadow: 0 0 0 2px #1664ff;
            }
          }
        }
      }

      .right {
        flex: 1;

        .header {
          margin-bottom: 16px;
          color: #1d2129;
          font-weight: 500;
          font-size: 24px;
          line-height: 32px;
        }

        .description {
          margin-bottom: 42px;
          color: #1d2129;
          line-height: 22px; /* 157.143% */
          word-break: break-all;
        }

        .price {
          margin-bottom: 20px;
          padding: 12px;
          line-height: 22px;
          background: #ffece8;
          border-radius: 4px;

          span:first-child {
            margin-right: 24px;
            color: #4e5969;
          }

          span:last-child {
            color: #e63f3f;
            font-weight: 700;
            font-size: 20px;
          }
        }

        .custom {
          margin-bottom: 12px;
          padding: 4px 12px;

          &:last-of-type {
            margin-bottom: 42px;
          }

          .label {
            display: inline-block;
            width: 60px;
            margin-right: 16px;
          }

          :deep(.tele-radio-button-content) {
            color: #1664ff;
            font-weight: 500;
            font-size: 12px;
            line-height: 20px; /* 166.667% */
          }
        }
      }
    }

    .intro {
      display: flex;
      justify-content: start;
      margin-bottom: 132px;

      .template {
        flex: 1;
        width: 900px;
        margin-right: 16px;

        .nav {
          display: flex;
          align-content: center;
          padding: 0 24px;
          background-color: #fff;
          box-shadow: 0 -1px 0 0 #e5e8ef inset;
          // border-bottom: 1px solid #efefef;
          &.fixed {
            position: fixed;
            top: 64px;
            width: 900px;
          }

          // :deep(.tele-link)
          > span {
            display: inline-block;
            flex: 1;
            margin: 12px auto;
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px; /* 157.143% */
            text-align: center;
            cursor: pointer;

            .active {
              position: relative;
              color: #1664ff;
              font-weight: 500;

              &::after {
                position: absolute;
                top: 31px;
                left: 0;
                width: 100%;
                border: 1px solid #1664ff;
                content: '';
              }
            }
          }
        }
      }

      .consult {
        display: flex;
        flex-direction: column;
        width: 260px;
        height: 178px;
        padding: 24px;
        color: #000;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px; /* 157.143% */
        background-color: #fff;
        border-radius: 4px;

        .title {
          margin-bottom: 12px;
          font-weight: 500;
        }

        .header {
          margin-bottom: 12px;
        }

        button {
          width: 208px;
        }
      }
    }
  }
}
</style>
