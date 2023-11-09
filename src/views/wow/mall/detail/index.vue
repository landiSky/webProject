<template>
  <div class="wrap">
    <div class="productIntro">
      <div class="baseInfo">
        <div class="left">
          <div class="bigImg">
            <img :src="`/web/file/download?name=${bigImgPath}`" />
          </div>

          <ul class="imgList">
            <li
              v-for="(imgPath, index) in previewImgList"
              :key="index"
              @mouseenter="bigImgPath = imgPath"
            >
              <img
                :src="`/web/file/download?name=${imgPath}`"
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
          <div class="description">{{ prodDetail.introduction }}</div>
          <div class="price">
            <span>产品价格:</span>
            <span v-if="computing">计算中...</span>
            <span v-else-if="prodDetail.saleType === SaleType.CONSULT">
              价格面议
            </span>
            <span v-else>{{ price || '-' }}</span>
          </div>

          <div class="custom">
            <span class="label">版本:</span>
            <span>
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
            @click="clickAddCart"
            >立即购买</t-button
          >
        </div>
      </div>
      <div class="intro">
        <div class="template">
          <component
            :is="forCompList[item.type - 1]"
            v-for="(item, index) in templateList"
            :key="index"
            :template-data="item"
          ></component>
        </div>
        <div class="consult">
          <span class="title">服务商资质</span>
          <span class="header">服务商名称：北京泰尔英福科技有限公司</span>
          <t-button type="primary" size="large">购买咨询</t-button>
        </div>
      </div>
    </div>
  </div>
  <AuthMemberModal
    v-if="authModalVisible"
    :product-id="prodDetail.id"
    @cancel="onAuthCancel"
    @confirm="onAuthConfirm"
  ></AuthMemberModal>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Modal } from '@tele-design/web-vue';

import { apiProductDetail, apiComputePrice } from '@/api/wow/mall';
import { SaleType } from '@/enums/common';
import { useUserStore } from '@/store/modules/user';

import { useOrderStore } from '@/store/modules/order';
import WowFooter from '@/views/wow/components/wowFooter/index.vue';
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

// // 模块一二三
// const testData =
//   '[{"type":1,"moduleName":"模板一","blockList":[{"name":"区块一","desc":"区块一简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块二","desc":"区块二简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块三","desc":"区块三简介：建议图片尺寸：200px * 200px，支持jpg、png、bmp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"}]},{"type":2,"moduleName":"模板二","blockList":[{"name":"区块一","desc":"区块一简介：建议图片尺寸：200px * 200px，支持jpg、png、","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块一11","desc":"区块一11简介：建议图片尺寸：200px * 200px，支持jpg、png、","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"}]},{"type":3,"moduleName":"模板三","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp","blockList":[{"name":"区块一","desc":"图片紫葡萄"},{"name":"区块二","desc1":"简介 1：把尔粉色发非法人非法是的色粉舒服分手的方式实习","desc2":"简介 2：把尔粉色发非法人非法是的色粉舒服分手的方式实习","desc3":"简介 3：把尔粉色发非法人非法是的色粉舒服分手的方式实习"}]}]';

// // 模块四
// const testData =
//   '[{"type":4,"moduleName":"模块四","blockList":[{"name":"区块一","desc":"建议图片尺寸：200px * 200px，支持jp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块二","desc":"建议图片尺寸：200px * 200px，支持jp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块三","desc":"建议图片尺寸：200px * 200px，支持jp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"name":"区块四","desc":"建议图片尺寸：200px * 200px，支持jp","picUrl":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"}]}]';

// // 模块五
// const testData =
//   '[{"type":5,"moduleName":"模块五","blockList":[{"name1":"标题一","desc1":"简介一","name2":"标题二","desc2":"简介二","name3":"标题三","desc3":"简介三"},{"name":"","desc":"","picUrl":"","name1":"标题一一","name2":"标题二二","name3":"标题三三","desc1":"简介二","desc2":"简介二","desc3":"简介二"}]}]';

// 模块六
// const testData =
//   '[{"type":6,"moduleName":"模块六","blockList":[{"url":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"url":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"url":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"url":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"},{"url":"https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"}]}]';

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

const onAuthCancel = () => {
  authModalVisible.value = false;
};

const onAuthConfirm = () => {
  authModalVisible.value = false;
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

  if (saleType === SaleType.PACKAGE) {
    const accountItem = accountNumList.find(
      (item: Record<string, any>) => item.id === accountId
    );
    const durationItem = durationList.find(
      (item: Record<string, any>) => item.id === durationId
    );
    accountDesc = `${accountItem.accountNum}个账号`;
    durationDesc =
      durationItem.duration > 0 ? `${durationItem.duration}个月` : '不限'; // 套餐里时长有不限
  }

  // 封装确认订单需要的字段
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
  };

  router.push({
    path: '/order/confirm',
  });
};

const clickAddCart = () => {
  const { userInfo, userInfoByCompany } = userStore;
  if (!userInfo?.userId) {
    userStore.jumpToLogin();
  } else if (!userInfoByCompany?.primary) {
    Modal.warning({
      title: '请联系企业管理员购买开通服务',
      okText: '好的',
      hideCancel: true,
    });
  } else {
    authModalVisible.value = true;
  }
};

// const templateList = JSON.parse(testData);

const getPrice = () => {
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

onMounted(() => {
  apiProductDetail({ id: route.params.id })
    .then((data) => {
      prodDetail.value = data;
      deliveryList.value = data.productDeliverySetList || [];
      previewImgList.value = data.detailImg.split(',');
      bigImgPath.value = previewImgList.value?.[0];
      templateList.value = JSON.parse(data.detail);

      console.log('index.vue:285', templateList.value);
      const { saleType } = data;

      if (Array.isArray(deliveryList.value) && deliveryList.value.length) {
        if (saleType === SaleType.ONEOFF) {
          // 一口价
          priceParams.value.deliveryVersionId = deliveryList.value;
          getPrice();
        } else if (saleType === SaleType.PACKAGE) {
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
        }
      }
    })
    .catch(() => {});
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
        }
      }
    }

    .intro {
      display: flex;
      justify-content: start;

      .template {
        flex: 1;
        margin-right: 16px;
      }

      .consult {
        width: 260px;
        height: 178px;
        padding: 24px;
        color: #000;
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
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
