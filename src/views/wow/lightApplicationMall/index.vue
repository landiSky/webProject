<template>
  <div class="header">
    <div class="search">
      <t-input
        v-model="searchContent"
        class="inputSearch"
        placeholder="请输入标识轻应用名称"
        @press-enter="onSearch"
      >
        <template #prefix>
          <icon-search />
        </template>
      </t-input>
      <t-button type="primary" class="searchButton" @click="onSearch"
        >搜索</t-button
      >
    </div>
  </div>
  <div class="content">
    <div class="search">
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
        <span class="mall-select">
          <t-select
            v-model="apiParams.priceType"
            :style="{ width: '104px' }"
            placeholder="请选择"
            :bordered="false"
            :options="priceTypeList"
            @change="changePriceType"
          >
          </t-select>
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
                  style="width: 192px; text-align: left"
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
                </span>
              </span>
              <div class="price">
                <template v-if="item.lowPrice == '-2.00'">
                  <span class="prefix">免费</span>
                </template>
                <template v-else-if="item.lowPrice !== '-1.00'">
                  <span class="prefix"> {{ item.lowPrice || '-' }}</span>
                  <span class="suffix">元起</span>
                </template>
                <span v-else class="prefix">价格面议</span>
              </div>
            </span>
            <span v-if="item.isTry == 1" class="label-try">
              <span class="label-try-text">付费</span>
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
              :page-size-options="[12, 24, 36, 45, 51]"
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiProductList } from '@/api/wow/mall';
import { apiTagList } from '@/api/common';
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
  size: 12,
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
const btnLoading = ref(false);
const selectPriceInterval = ref<number | null | -1>(-1); // 选择的价格区间，-1 是 【不限】， null是不选择任何一个
const customPriceStart = ref(); // 自定义价格区间起止
const customPriceEnd = ref();
const priceTypeList = ref<Record<string, any>>([
  {
    value: '0',
    label: '全部价格',
  },
  {
    value: '1',
    label: '免费',
  },
  {
    value: '2',
    label: '付费',
  },
]);
const apiParams = ref<Record<string, any>>({
  productTypeId: null,
  productChildTypeId: null,
  deliveryType: null,
  priceSort: null,
  upShelfTimeSort: null,
  name: route.query.goodsName || null,
  tagIdList: [null, null, null],
  isTry: null,
  priceType: '0',
});

const tagList = ref<Record<string, any>>([]);

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
  const routeData = router.resolve({
    name: 'wowLightApplicationMallDetail',
    params: { id },
  });
  window.open(routeData?.href, '_blank');
};

const getTagList = () => {
  apiTagList() // TODO 添加查询参数
    .then((data: any) => {
      tagList.value = data || [];
    })
    .catch(() => {});
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
// 标识应用名称字段
const searchContent = ref();
const onSearch = () => {
  // TODO w: 商城搜索打点
  apiDataPoint(null, searchContent.value, userInfo?.value?.id, 5, 9).then(
    () => {
      console.log('主导航栏商品搜索打点', searchContent.value);
    }
  );
  pagination.page = 1;
  apiParams.value.name = searchContent.value;
  getProductList();
};
// 选择定价方式时触发
const changePriceType = () => {
  pagination.page = 1;
  getProductList();
};

onMounted(() => {
  apiDataPoint(null, null, userInfo?.id, 3, 1).then(() => {
    console.log('商城首页页面打点');
  });
  getTagList();
  getProductList();
});
</script>

<style lang="less" scoped>
.header {
  display: flex; /* 启用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: 100%;
  min-height: 360px;
  background-image: url('@/assets/images/wow/mall/mall_index_bg.svg');
  background-size: cover;

  .search {
    display: flex;
    align-items: center;
    width: 600px;
    height: 40px;
    box-shadow: 0 4px 30px 0 #2c5bd433;

    .inputSearch {
      width: 500px;
      height: 40px;
      margin: 0;
      //padding: 0;
    }

    .searchButton {
      width: 100px;
      height: 40px;
      margin: 0; /* 移除默认的外边距 */
      padding: 0; /* 移除默认的内边距 */
    }
  }
}

.content {
  width: 1198px;
  margin: -30px auto 0 auto;

  .search {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    padding: 16px 24px;
    background-color: #fff;

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
    padding: 16px 0;

    .sort {
      display: flex;
      margin-bottom: 16px;
      padding: 0;
      padding: 0 24px;
      background: #fff;
      border-radius: 8px;

      .mall-select {
        :deep(.tele-select-view-value) {
          color: #4e5969;
          font-size: 14px;
        }
      }

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
        position: relative;
        display: flex;
        width: 386px;
        margin-right: 20px;
        margin-bottom: 20px;
        padding: 15px;
        overflow: hidden; /* 隐藏超出部分 */
        background: #fff;
        border-radius: 8px;

        &:hover {
          box-shadow: 0 4px 4px 0 rgba(180, 180, 180, 0.25);
        }

        &:nth-child(3n) {
          margin-right: 0;
        }

        .left {
          display: flex;
          align-items: center;
          margin-right: 10px;

          img {
            display: block;
            width: 80px;
            height: 80px;
            border-radius: 24px;
            cursor: pointer;
          }
        }

        .right {
          display: flex;
          flex: 1;
          flex-direction: column;
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
            font-size: 16px;
            line-height: 22px;
            cursor: pointer;
          }

          .introduction {
            margin-bottom: 4px;
            color: #4e5969;
            font-size: 14px;
            line-height: 20px;
          }

          .companyName {
            display: inline-block;
            margin-bottom: 4px;
            color: #86909c;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
          }

          .tag {
            display: flex;
            gap: 8px;

            :deep(.tele-tag) {
              max-width: 58px;
              padding: 0 8px;
              color: #4e5969;
              font-weight: 400;
              font-size: 12px;
              line-height: 22px; /* 183.333% */
              background: #f2f3f8;
            }

            :deep(.tele-typography) {
              margin-bottom: 0;
            }

            > span,
            .tagList {
              text-align: center;
              background: #f2f3f8;
            }
          }

          .desc {
            width: 264px;
            margin-top: 8px;
            margin-bottom: 8px;
            color: #4e5969;
            font-weight: 500;
            font-size: 16px;
            line-height: 22px; /* 157.143% */
            word-break: break-all;
          }

          .price {
            line-height: 22px;

            .prefix {
              margin-right: 10px;
              color: #ff1414;
              font-weight: 500;
              font-size: 16px;
            }

            .suffix {
              color: #1d2129;
              font-weight: 400;
              font-size: 12px;
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

.label-try {
  /* 绝对定位 */
  position: absolute;
  top: 10px;
  left: 324px;
  align-items: center;
  width: 82px;
  height: 20px;
  margin: 0;

  /* 文字不换行 */
  white-space: nowrap;
  background: #fa9600;

  /* 旋转45° */
  transform: rotate(45deg);
}

.label-try-text {
  width: 48px;
  height: 20px;
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
}
</style>
