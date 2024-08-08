<template>
  <div class="header"></div>
  <div class="content">
    <div class="search">
      <span class="item">
        <span class="label">商品分类:</span>
        <span class="value">
          <span
            :class="{ active: !apiParams.productTypeId }"
            class="span-padding"
            @click="(apiParams.productTypeId = null), clickSearchBtn()"
            >不限</span
          >
          <span
            v-for="item in productTypeList"
            :key="item.id"
            :class="{ active: apiParams.productTypeId === item.id }"
            @click="(apiParams.productTypeId = item.id), clickSearchBtn()"
          >
            {{ item.name }}
          </span>
        </span>
      </span>
      <span class="item">
        <span class="label">商品类型:</span>
        <span class="value">
          <span
            :class="{
              active: ![DeliverType.DEPLOY, DeliverType.SAAS].includes(
                apiParams.deliveryType
              ),
            }"
            class="span-padding"
            @click="(apiParams.deliveryType = null), clickSearchBtn()"
            >不限</span
          >
          <span
            :class="{ active: apiParams.deliveryType === DeliverType.DEPLOY }"
            @click="
              (apiParams.deliveryType = DeliverType.DEPLOY), clickSearchBtn()
            "
            >{{ DeliverTypeDesc[DeliverType.DEPLOY] }}</span
          >
          <span
            :class="{ active: apiParams.deliveryType === DeliverType.SAAS }"
            @click="
              (apiParams.deliveryType = DeliverType.SAAS), clickSearchBtn()
            "
            >{{ DeliverTypeDesc[DeliverType.SAAS] }}</span
          >
        </span>
      </span>
      <span class="item goods-price">
        <span class="label">商品价格:</span>
        <span class="value">
          <span
            :class="{ active: selectPriceInterval === -1 }"
            class="span-padding"
            @click="(selectPriceInterval = -1), clickSearchBtn()"
            >不限</span
          >
          <span
            :class="{ active: selectPriceInterval === -2 }"
            class="span-padding"
            @click="(selectPriceInterval = -2), clickSearchBtn()"
            ><span class="free"></span>免费</span
          >
          <span
            v-for="(item, index) in PriceEnum"
            :key="index"
            :class="{ active: selectPriceInterval === index }"
            @click="(selectPriceInterval = index), clickSearchBtn()"
            >{{ item.length > 1 ? `${item[0]}-${item[1]}` : `${item[0]}以上` }}
          </span>
          <span class="customPrice">
            <span>
              自定义区间：
              <t-input-number
                v-model="customPriceStart"
                :style="{ width: '98px' }"
                placeholder="最小价格"
                :min="0"
                @blur="onCustomPriceBlur"
              />
              ~
              <t-input-number
                v-model="customPriceEnd"
                :style="{ width: '98px' }"
                placeholder="最大价格"
                :min="0"
                @blur="onCustomPriceBlur"
              />
            </span>
            <t-button
              type="primary"
              style="margin-left: 4px"
              @click="clickSearchBtn"
            >
              查询</t-button
            >
          </span>
        </span>
      </span>
      <span v-for="(item, index) in tagList" :key="index" class="item">
        <span class="label">{{ item.name }}:</span>
        <span class="value">
          <span
            :class="{ active: apiParams.tagIdList[index] === null }"
            class="span-padding"
            @click="tagsClick(index, null)"
            >不限</span
          >
          <span
            v-for="item2 in item.children"
            :key="item2.id"
            :class="{ active: apiParams.tagIdList[index] === item2.id }"
            @click="tagsClick(index, item2)"
          >
            {{ item2.name }}
          </span>
        </span>
      </span>

      <!-- <span>
        <t-button
          type="primary"
          style="margin-right: 16px"
          @click="clickSearchBtn"
        >
          查询</t-button
        >
        <t-button @click="clickResetBtn"> 重置</t-button>
      </span> -->
    </div>
    <div class="result">
      <div class="sort">
        <span
          :class="{
            active: !(
              [priceSortEnum.ASC, priceSortEnum.DES].includes(
                apiParams.priceSort
              ) ||
              [shelveSortEnum.ASC, shelveSortEnum.DES].includes(
                apiParams.upShelfTimeSort
              )
            ),
          }"
          class="allSort"
          @click="clickAllSort"
          >综合排序</span
        >
        <span>
          <span>价格</span>
          <span class="caretWrap">
            <icon-caret-up
              :class="{ active: apiParams.priceSort === priceSortEnum.ASC }"
              @click="clickPriceSort(priceSortEnum.ASC)"
            />
            <icon-caret-down
              :class="{ active: apiParams.priceSort === priceSortEnum.DES }"
              @click="clickPriceSort(priceSortEnum.DES)"
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
              @click="clickUpShelfSort(shelveSortEnum.ASC)"
            />
            <icon-caret-down
              :class="{
                active: apiParams.upShelfTimeSort === shelveSortEnum.DES,
              }"
              @click="clickUpShelfSort(shelveSortEnum.DES)"
            />
          </span>
        </span>
      </div>
      <t-spin
        :loading="btnLoading"
        :size="32"
        tip="加载中"
        style="min-height: 150px; text-align: center"
      >
        <div class="list">
          <span v-for="item in productsList" :key="item.id" class="card">
            <span class="left">
              <img
                :src="
                  `/server/web/file/download?name=${item.logo}&productId=${item.id}` ||
                  'src/assets/images/wow/mall/default_product_logo.svg'
                "
                mode="scaleToFill"
                alt=""
                @click="() => goMallDetail(item.id)"
              />
            </span>
            <span class="right">
              <span class="right-top">
                <t-typography-paragraph
                  class="name"
                  style="width: 130px; text-align: left"
                  :ellipsis="{
                    rows: 1,
                    showTooltip: {
                      type: 'tooltip',
                      props: {
                        isBright: true,
                      },
                    },
                  }"
                  @click="() => goMallDetail(item.id)"
                >
                  <span>
                    {{ item.name }}
                  </span>
                </t-typography-paragraph>
                <span class="desc">
                  <t-typography-paragraph
                    class="introduction"
                    :ellipsis="{
                      rows: 2,
                      showTooltip: {
                        type: 'tooltip',
                        props: {
                          isBright: true,
                        },
                      },
                    }"
                    >{{ item.introduction }}
                  </t-typography-paragraph>
                  <span class="companyName">{{ item.companyName }}</span>

                  <span class="tag">
                    <t-tag color="#E8F4FF">{{
                      DeliverTypeDesc[item.deliveryType]
                    }}</t-tag>
                    <div
                      v-for="(item2, index) in item?.tagList"
                      :key="index"
                      class="tagList"
                    >
                      <t-typography-paragraph
                        class="tagList-color"
                        :ellipsis="{
                          rows: 1,
                          showTooltip: true,
                        }"
                      >
                        {{ item2.name }}
                      </t-typography-paragraph>
                    </div>
                  </span>
                </span>
              </span>
              <span class="price">
                <template v-if="item.lowPrice == '-2.00'">
                  <span class="prefix">免费</span>
                </template>
                <template v-else-if="item.lowPrice !== '-1.00'">
                  <span class="prefix">¥ {{ item.lowPrice || '-' }}</span>
                  <span class="suffix">元起</span>
                </template>
                <span v-else class="prefix">价格面议</span>
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
        <t-empty
          v-if="!btnLoading && !productsList.length"
          description="暂无上架商品"
        >
          <template #image>
            <iconpark-icon name="zanwushuju" size="100px"></iconpark-icon>
          </template>
        </t-empty>
      </t-spin>
    </div>
  </div>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiProductList } from '@/api/wow/mall';
import { apiProductType, apiTagList } from '@/api/common';
import { DeliverType, DeliverTypeDesc } from '@/enums/common';
import { apiDataPoint } from '@/api/data-point';
import { useUserStore } from '@/store/modules/user';
import { PriceEnum } from './constant';
import WowFooter from '../components/wowFooter/index.vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const { userInfo } = userStore;

const pagination = reactive({
  page: 1,
  size: 10,
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
const hideOnSinglePage = computed(() => pagination.total <= 10);
const productTypeList = ref<Record<string, any>[]>([]);
const btnLoading = ref(false);
const selectPriceInterval = ref<number | null | -1>(-1); // 选择的价格区间，-1 是 【不限】， null是不选择任何一个
const customPriceStart = ref(); // 自定义价格区间起止
const customPriceEnd = ref();
const apiParams = ref<Record<string, any>>({
  productTypeId: null,
  deliveryType: null,
  priceSort: null,
  upShelfTimeSort: null,
  name: route.query.goodsName || null,
  tagIdList: [null, null, null],
});

const tagList = ref<Record<string, any>>([]);

const onCustomPriceBlur = () => {
  if (!customPriceStart.value && !customPriceEnd.value) {
    selectPriceInterval.value = -1; // 选择不限
  } else {
    selectPriceInterval.value = null; // 取消区间选中
  }
};

const getProductList = () => {
  const { page, size } = pagination;
  const tagIdList = apiParams.value.tagIdList.filter((item: any) => {
    return item;
  });
  const params: Record<string, any> = {
    pageNum: page,
    pageSize: size,
    ...apiParams.value,
    tagIdList: tagIdList.length > 0 ? tagIdList : null,
  };
  // 价格区间是选择了已有的，还是自定义的
  if (customPriceStart.value || customPriceEnd.value) {
    params.startPrice = customPriceStart.value || null;
    params.endPrice = customPriceEnd.value || null;
  } else {
    const temp =
      Number(selectPriceInterval.value) >= 0
        ? PriceEnum[selectPriceInterval.value as number]
        : [];

    [params.startPrice, params.endPrice] =
      selectPriceInterval.value === -1 ? [] : temp;
  }
  params.free =
    selectPriceInterval.value === -2 ? selectPriceInterval.value : null;

  apiProductList(params) // TODO 添加查询参数
    .then((response) => {
      const { total, records } = response || {};
      const dataList = records.map((item: any) => {
        const params = item;
        const tagList = params.tagList.filter(
          (tag: any) => String(tag.id) !== '2'
        );
        return { ...params, tagList };
      });
      productsList.value = dataList || [];
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

const goMallDetail = (id: string) => {
  console.log('goMallDetail');
  router.push({
    name: 'wowMallDetail',
    params: { id },
  });
};

const getProductType = () => {
  apiProductType() // TODO 添加查询参数
    .then((data: any) => {
      productTypeList.value = data || [];
    })
    .catch(() => {});
};

const getTagList = () => {
  apiTagList() // TODO 添加查询参数
    .then((data: any) => {
      tagList.value = data || [];
    })
    .catch(() => {});
};

const clickSearchBtn = () => {
  pagination.page = 1;
  btnLoading.value = true;
  getProductList();
};

const clickResetBtn = () => {
  apiParams.value.productTypeId = null;
  apiParams.value.deliveryType = null;
  selectPriceInterval.value = -1;
  customPriceStart.value = null;
  customPriceEnd.value = null;
  pagination.page = 1;
  getProductList();
};

const clickPriceSort = (value: number) => {
  apiParams.value.upShelfTimeSort = null; // 综合排序、价格排序、上架时间排序都互斥
  apiParams.value.priceSort = value;
  pagination.page = 1;
  getProductList();
};

const clickUpShelfSort = (value: number) => {
  apiParams.value.priceSort = null;
  apiParams.value.upShelfTimeSort = value;
  pagination.page = 1;
  getProductList();
};

const clickAllSort = () => {
  apiParams.value.priceSort = null;
  apiParams.value.upShelfTimeSort = null;
  pagination.page = 1;
  getProductList();
};

const tagsClick = (parentsubscript: any, item: any) => {
  const tagList = apiParams.value.tagIdList;
  tagList[parentsubscript] = item?.id ?? item;
  apiParams.value.tagIdList = tagList;
  getProductList();
};

watch(
  () => route.query.goodsName,
  (newV) => {
    pagination.page = 1;
    apiParams.value.name = newV;
    getProductList();
  }
);

watch(
  () => route.query.free,
  (newV) => {
    if (newV) {
      pagination.page = 1;
      selectPriceInterval.value = -2;
      apiParams.value.free = -2;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => route.query.idinside,
  (newV) => {
    if (newV) {
      apiTagList() // TODO 添加查询参数
        .then((data: any) => {
          const params = data.filter((item: any) => {
            return item.name === 'IDInside';
          });
          const index = data.findIndex((item: any) => item.name === 'IDInside');
          // console.log(params[0].children[0].id);
          tagsClick(index, params[0].children[0]);
        })
        .catch(() => {});
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  apiDataPoint(null, null, userInfo?.id, 3, 1).then((res) => {
    console.log('商城首页页面打点');
  });
  getProductType();
  getTagList();
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
  width: 1176px;
  margin: -30px auto 120px auto;

  .search {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    padding: 16px 24px;
    background-color: #fff;

    // span:last-child {
    //   text-align: right;
    // }
    // .goods-price {
    //   padding-bottom: 18px;
    //   border-bottom: 1px solid #e5e8ef;
    // }
    .item {
      display: flex;
      justify-content: start;
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 22px;

      .label {
        display: inline-block;
        min-width: 70px;
        margin-right: 20px;
        color: #4e5969;
        font-weight: 500;
      }

      .value {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        color: #1d2129;
        font-weight: 400;

        & > span:not(.customPrice) {
          display: flex;
          align-items: center;
          justify-content: center;
          // display: inline-block;
          margin-right: 40px;
          margin-bottom: 2px;
          padding: 2px 2px;
          // line-height: 22px;
          cursor: pointer;

          &:hover {
            background-color: #e8f4ff;
            border-radius: 4px;
          }

          &.active {
            // display: block;
            display: flex;
            // width: 52px;
            height: 26px;
            color: #fff;
            text-align: center;
            background: #1664ff;
            border-radius: 4px;
          }
        }

        .span-padding {
          padding: 2px 10px !important;

          .free {
            width: 16px;
            height: 16px;
            margin-right: 2px;
            background-image: url('@/assets/images/wow/mall/free.png');
            background-size: 100% 100%;
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

      .allSort {
        cursor: pointer;
      }

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
        width: 552px;
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
            border-radius: 2px;
            cursor: pointer;
          }
        }

        .right {
          display: flex;
          flex: 1;
          flex-direction: column;
          // justify-content: start;
          align-items: start;

          .right-top {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: start;
            width: 100%;
            text-align: left;
          }

          .name {
            margin-bottom: 0;
            color: #1d2129;
            font-weight: 500;
            font-size: 22px;
            line-height: 22px;
            cursor: pointer;
          }

          .introduction {
            margin-bottom: 8px;
          }

          .companyName {
            display: inline-block;
            margin-bottom: 8px;
            color: #86909c;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
          }

          .tag {
            display: flex;

            :deep(.tele-tag) {
              color: #1664ff;
              font-weight: 400;
              font-size: 12px;
              line-height: 22px; /* 183.333% */
            }

            :deep(.tele-typography) {
              margin-bottom: 0;
            }
          }

          .desc {
            width: 264px;
            margin-top: 16px;
            margin-bottom: 16px;
            color: #4e5969;
            font-weight: 500;
            font-size: 18px;
            line-height: 22px; /* 157.143% */
            word-break: break-all;
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

    .paginationArea {
      :deep(.tele-pagination) {
        justify-content: center;
      }
    }
  }
}

.tagList {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 24px;
  margin-left: 8px;
  padding: 1px 8px;
  color: rgba(22, 100, 255, 1);
  font-weight: 400;
  font-size: 12px;
  font-family: PingFang SC;
  background: #f2f3f8;
  border-radius: 2px;

  .tagList-color {
    width: 100%;
    color: rgba(22, 100, 255, 1);
  }
}
</style>
