<template>
  <div class="header"></div>
  <div class="content">
    <div class="search">
      <span class="item">
        <span class="label">商品分类:</span>
        <span class="value">
          <span
            :class="{ active: !apiParams.productTypeId }"
            @click="apiParams.productTypeId = null"
            >不限</span
          >
          <span
            v-for="item in productTypeList"
            :key="item.id"
            :class="{ active: apiParams.productTypeId === item.id }"
            @click="apiParams.productTypeId = item.id"
          >
            {{ item.name }}
          </span>
        </span>
      </span>
      <span class="item">
        <span class="label">商品类型:</span>
        <span class="value">
          <span :class="{ active: !apiParams.deliveryType }">不限</span>
          <span
            :class="{ active: apiParams.deliveryType === DeliverType.DEPLOY }"
            @click="apiParams.deliveryType = DeliverType.DEPLOY"
            >{{ DeliverTypeDesc[DeliverType.DEPLOY] }}</span
          >
          <span
            :class="{ active: apiParams.deliveryType === DeliverType.SAAS }"
            @click="apiParams.deliveryType = DeliverType.SAAS"
            >{{ DeliverTypeDesc[DeliverType.SAAS] }}</span
          >
        </span>
      </span>
      <span class="item">
        <span class="label">商品价格:</span>
        <span class="value">
          <span
            :class="{ active: selectPriceInterval === -1 }"
            @click="selectPriceInterval = -1"
            >不限</span
          >
          <span
            v-for="(item, index) in PriceEnum"
            :key="index"
            :class="{ active: selectPriceInterval === item }"
            @click="selectPriceInterval = item"
            >{{
              item.length > 1 ? `${item[0]}-${item[1]}` : `${item[0]}以上`
            }}</span
          >
          <span class="customPrice">
            <span>
              自定义区间：
              <t-input-number
                v-model="customPriceStart"
                :style="{ width: '98px' }"
                placeholder="请输入数值"
                :min="0"
                @blur="onCustomPriceBlur"
              />
              ~
              <t-input-number
                v-model="customPriceEnd"
                :style="{ width: '98px' }"
                placeholder="请输入数值"
                :min="0"
                @blur="onCustomPriceBlur"
              />
            </span>
          </span>
        </span>
      </span>
      <span>
        <t-button
          type="primary"
          style="margin-right: 16px"
          :loading="btnLoading"
          @click="clickSearchBtn"
        >
          查询</t-button
        >
        <t-button @click="clickResetBtn"> 重置</t-button>
      </span>
    </div>
    <div class="result">
      <div class="sort">
        <span
          :class="{
            active: !(apiParams.priceSort || apiParams.upShelfTimeSort),
          }"
          @click="clickAllSort"
          >综合排序</span
        >
        <span>
          <span>价格</span>
          <span class="caretWrap">
            <icon-caret-up
              :class="{ active: apiParams.priceSort === priceSortEnum.ASC }"
              @click="clickSort('priceSort', priceSortEnum.ASC)"
            />
            <icon-caret-down
              :class="{ active: apiParams.priceSort === priceSortEnum.DES }"
              @click="clickSort('priceSort', priceSortEnum.DES)"
            />
          </span>
        </span>
        <span>
          <span>上架时间</span>
          <span class="caretWrap">
            <icon-caret-up
              :class="{
                active: apiParams.upShelfTimeSort === shelveSortEnum.ASC,
              }"
              @click="clickSort('upShelfTimeSort', shelveSortEnum.ASC)"
            />
            <icon-caret-down
              :class="{
                active: apiParams.upShelfTimeSort === shelveSortEnum.DES,
              }"
              @click="clickSort('upShelfTimeSort', shelveSortEnum.DES)"
            />
          </span>
        </span>
      </div>
      <div class="list">
        <span
          v-for="item in productsList"
          :key="item.id"
          class="card"
          @click="() => goMallDetail(item.id)"
        >
          <span class="left">
            <img
              :src="
                item.logo ||
                'src/assets/images/wow/mall/default_product_logo.svg'
              "
              mode="scaleToFill"
              alt=""
            />
          </span>
          <span class="right">
            <span class="name">{{ item.name }}</span>
            <span class="companyName">{{ item.companyName }}</span>

            <span class="tag">
              <t-tag color="#E8F4FF">{{
                DeliverTypeDesc[item.deliveryType]
              }}</t-tag>
            </span>
            <span class="desc">{{ item.introduction }}</span>
            <span class="price">
              <span class="prefix">{{ item.price }}</span>
              <span class="suffix">元起</span>
            </span>
          </span>
        </span>
      </div>
      <div>
        <div v-if="!hideOnSinglePage" class="paginationArea">
          <t-pagination
            v-model:current="pagination.page"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            show-total
            show-jumper
            show-page-size
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiProductList } from '@/api/wow/mall';
import { apiProductType } from '@/api/common';
import { DeliverType, DeliverTypeDesc } from '@/enums/common';
import { PriceEnum } from './constant';
import WowFooter from '../components/wowFooter/index.vue';

const router = useRouter();
const route = useRoute();

const pagination = reactive({
  page: 1,
  size: 8,
  total: 0,
});
const priceSortEnum = {
  ASC: 0,
  DES: 1,
};
const shelveSortEnum = {
  ASC: 0,
  DES: 1,
};
const productsList = ref<Record<string, any>>([]);
const hideOnSinglePage = computed(() => pagination.total <= 8);
const productTypeList = ref<Record<string, any>[]>([]);
const btnLoading = ref(false);
const selectPriceInterval = ref<number[] | null | -1>(-1); // 选择的价格区间，-1 是 【不限】， null是不选择任何一个
const customPriceStart = ref(); // 自定义价格区间起止
const customPriceEnd = ref();
const apiParams = ref<Record<string, any>>({
  productTypeId: null,
  deliveryType: null,
  priceSort: null,
  upShelfTimeSort: null,
  name: route.params.goodsName || null,
});

const onCustomPriceBlur = () => {
  if (!customPriceStart.value && !customPriceEnd.value) {
    selectPriceInterval.value = -1; // 选择不限
  } else {
    selectPriceInterval.value = null; // 取消区间选中
  }
};

const getProductList = () => {
  const { page, size } = pagination;
  const params: Record<string, any> = {
    pageNum: page,
    pageSize: size,
    ...apiParams.value,
  };
  // 价格区间是选择了已有的，还是自定义的
  if (customPriceStart.value || customPriceEnd.value) {
    params.startPrice = customPriceStart.value || null;
    params.endPrice = customPriceEnd.value || null;
  } else {
    [params.startPrice, params.endPrice] =
      selectPriceInterval.value === -1 ? [] : selectPriceInterval.value || [];
  }

  btnLoading.value = true;
  apiProductList(params) // TODO 添加查询参数
    .then((response) => {
      console.log('index.vue:106', response);
      const { total, records } = response || {};
      productsList.value = records || [];
      pagination.total = total;
    })
    .catch(() => {})
    .finally(() => {
      btnLoading.value = false;
    });
};

const onPageChange = (current: number) => {
  pagination.page = current;
  getProductList();
};
const onPageSizeChange = (size: number) => {
  pagination.size = size;
  pagination.page = 1;
  getProductList();
};

const goMallDetail = (productId: string) => {
  router.push({
    name: 'wowMallDetail',
    params: { id: productId },
  });
};

const getProductType = () => {
  apiProductType() // TODO 添加查询参数
    .then((data: any) => {
      productTypeList.value = data || [];
    })
    .catch(() => {});
};

const clickSearchBtn = () => {
  pagination.page = 1;
  getProductList();
};

const clickResetBtn = () => {
  apiParams.value.productTypeId = null;
  apiParams.value.deliveryType = null;
  selectPriceInterval.value = -1;
  customPriceStart.value = null;
  customPriceEnd.value = null;
};

const clickSort = (key: string, value: number) => {
  apiParams.value[key] = value;
  clickSearchBtn();
};

const clickAllSort = () => {
  apiParams.value.priceSort = null;
  apiParams.value.upShelfTimeSort = null;
  clickSearchBtn();
};

onMounted(() => {
  getProductType();
  getProductList();
});
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  min-height: 480px;
  background-image: url('@/assets/images/wow/mall/mall_index_bg.svg');
  background-size: cover;
}

.content {
  margin: 0 132px 120px 132px;

  .search {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    padding: 16px 24px;
    background-color: #fff;

    span:last-child {
      text-align: right;
    }

    .item {
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 22px;

      .label {
        margin-right: 20px;
        color: #4e5969;
        font-weight: 500;
      }

      .value {
        color: #1d2129;
        font-weight: 400;

        & > span:not(.customPrice) {
          display: inline-block;
          margin-right: 40px;
          padding: 2px 10px;
          line-height: 22px;
          cursor: pointer;

          &:hover {
            background-color: #e8f4ff;
            border-radius: 4px;
          }

          &.active {
            color: #fff;
            background: #1664ff;
            border-radius: 4px;
          }
        }
      }
    }
  }

  .result {
    padding: 16px 24px;
    background-color: #fff;

    .sort {
      display: flex;
      margin-bottom: 16px;
      padding: 0 24px;
      background: #f2f3f8;

      & > span {
        display: flex;
        align-items: center;
        padding: 11px 16px;
        color: #4e5969;
        font-size: 14px;
        line-height: 22px;

        &.active {
          color: #1664ff;
          font-weight: 500;
        }

        .caretWrap {
          display: flex;
          flex-direction: column;
          margin-left: 4px;
          color: #86909c;
          font-size: 12px;

          .active {
            color: #1664ff;
          }

          :deep(.tele-icon) {
            &:first-child {
              margin-bottom: -3px;
            }

            &:last-child {
              margin-top: -3px;
            }
          }
        }
      }
    }

    .list {
      display: flex;
      flex-wrap: wrap;

      .card {
        display: flex;
        min-width: 552px;
        margin-bottom: 16px;
        padding: 16px;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        &:hover {
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        }

        &:nth-child(odd) {
          margin-right: 24px;
        }

        .left {
          margin-right: 16px;
          // display: inline-block;
          img {
            display: block;
            width: 178px;
            height: 178px;
          }
        }

        .right {
          display: flex;
          flex: 1;
          flex-direction: column;
          // justify-content: start;
          align-items: start;

          .name {
            margin-bottom: 4px;
            color: #223354;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
          }

          .companyName {
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
          }

          .tag {
            :deep(.tele-tag) {
              color: #1664ff;
              font-weight: 400;
              font-size: 12px;
              line-height: 22px; /* 183.333% */
            }
          }

          .desc {
            margin-top: 12px;
            color: #1d2129;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px; /* 157.143% */
          }

          .price {
            .prefix {
              color: #e63f3f;
              font-weight: 500;
              font-size: 16px;
              line-height: 24px; /* 150% */
            }

            .suffix {
              color: #86909c;
              font-weight: 400;
              font-size: 14px;
              line-height: 22px; /* 157.143% */
            }
          }
        }
      }
    }
  }
}
</style>
