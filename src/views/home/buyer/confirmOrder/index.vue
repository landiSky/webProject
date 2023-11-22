<template>
  <div class="wrapper">
    <div class="header">
      <t-link @click="onGoBack">
        <icon-left />
        返回
      </t-link>
      <span>确认订单信息</span>
    </div>
    <div class="content">
      <div class="label">
        <span class="divider"></span>
        <span>商品信息</span>
      </div>
      <div class="table">
        <div class="thead">
          <span>商家: {{ createOrderInfo?.companyName || '-' }}</span>
          <span>交付类型</span>
          <span>商品金额</span>
          <span>帐号数量</span>
          <span>购买时长</span>
          <span>实付金额</span>
        </div>
        <div class="tbody">
          <span>
            <img
              :src="`/server/web/file/download?name=${createOrderInfo?.logo}&productId=${createOrderInfo.productId}`"
            />
            <span>{{ createOrderInfo?.name }}</span>
          </span>
          <span>{{ DeliverTypeDesc[createOrderInfo?.deliveryType] }}</span>
          <span>
            <template v-if="createOrderInfo?.saleType === SaleType.CONSULT">
              面议
            </template>
            <template v-else>¥{{ createOrderInfo?.price || '-' }} 元</template>
          </span>
          <span>{{ createOrderInfo?.accountDesc }}</span>

          <span>{{ createOrderInfo?.durationDesc }}</span>

          <span>
            <span>
              <template v-if="createOrderInfo?.saleType === SaleType.CONSULT">
                面议
              </template>
              <template v-else
                >¥{{ createOrderInfo?.price || '-' }} 元</template
              >
            </span>

            <!-- <span>(含减优惠券: 500元)</span> -->
          </span>
        </div>
      </div>
    </div>
    <div class="footer">
      <t-button style="margin-right: 10px" @click="onGoBack">取消</t-button>
      <t-button
        type="primary"
        :loading="submitLoading"
        @click="clickCreateOrder"
        >提交订单</t-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useOrderStore } from '@/store/modules/order';
import { apiCreateOrder } from '@/api/buyer/order';

import { DeliverType, DeliverTypeDesc, SaleType } from '@/enums/common';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const orderStore = useOrderStore();
const { createOrderInfo }: { createOrderInfo: Record<string, any> } =
  storeToRefs(orderStore);
const submitLoading = ref(false);
const onGoBack = () => {
  router.go(-1);
};

const clickCreateOrder = () => {
  const {
    companyId,
    productId,
    deliveryType,
    price,
    deliveryVersionId,
    orderSource,
    accountId,
    durationId,
    memberIdList,
  } = createOrderInfo.value;
  const params = {
    memberId: userStore.selectCompany?.memberId,
    memberIdList,
    sellerId: companyId, // 卖家id（商品创者所属机构id）
    productId, // 商品id
    deliveryType, // 交付类型 0-saas类,1-独立部署类
    productPrice: price, // 商品金额
    deliveryVersionId, // 交付版本id
    orderSource, // 订单来源：0-本平台，1-跨平台
    accountId, // 账号id
    durationId, // 时长id
    userCompanyId: userStore.selectCompany?.companyId, // 用户企业id
  };
  submitLoading.value = true;
  apiCreateOrder(params)
    .then((data) => {
      router.push({
        name: 'buyerOrderDetail',
        params: {
          id: data.id,
        },
      });
    })
    .finally(() => {
      submitLoading.value = false;
    });
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f6f7fb;

  .header {
    z-index: 1;
    padding: 12px 24px;
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px; /* 150% */
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

    & > span {
      margin-left: calc(50% - 48px);
    }

    :deep(.tele-link) {
      color: #1d2129;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .content {
    flex: 1;
    margin: 0 80px;
    padding: 40px 48px 0 48px;
    background-color: #fff;

    .label {
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px; /* 157.143% */

      .divider {
        display: inline-block;
        width: 4px;
        height: 12px;
        margin-right: 8px;
        background-color: #1664ff;
      }
    }

    .table {
      margin-top: 24px;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px; /* 166.667% */
      border: 1px solid #e5e8ef;
      border-radius: 2px;

      .thead,
      .tbody {
        display: flex;
        align-items: center;

        & > span {
          display: inline-block;
          width: 160px;
          padding: 10px 12px;

          &:first-child {
            display: flex;
            flex: 1;
            align-items: center;
          }

          &:last-child {
            width: 200px;
          }
        }

        img {
          width: 80px;
          height: 80px;
          margin-right: 10px;
          border: 1px solid #e5e8ef;
          border-radius: 2px;
        }
      }

      .thead {
        height: 40px;
        padding-left: 12px;
        color: #4e5969;
        background: #f2f3f8;
      }

      .tbody {
        color: #1d2129;
      }
    }
  }

  .footer {
    height: 64px;
    padding: 14px 80px;
    text-align: right;
    background-color: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
