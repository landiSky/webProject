<template>
  <div class="header"></div>
  <div class="content">
    <div class="search">
      <span class="item">
        <span class="label">商品分类:</span>
        <span class="value">
          <span>不限</span>
          <span>分类一</span>
          <span>分类二</span>
        </span>
      </span>
      <span class="item">
        <span class="label">商品类型:</span>
        <span class="value">
          <span>不限</span>
          <span>分类一</span>
          <span>分类二</span>
        </span>
      </span>
      <span class="item">
        <span class="label">商品价格:</span>
        <span class="value">
          <span>不限</span>
          <span>分类一</span>
          <span>分类二</span>
        </span>
      </span>
      <span>
        <t-button type="primary" style="margin-right: 16px"> 查询</t-button>
        <t-button> 重置</t-button>
      </span>
    </div>
    <div class="result">
      <div class="sort">
        <span>综合排序</span>
        <span>价格</span>
        <span>上架时间</span>
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
import { useRouter } from 'vue-router';
import { apiProductList } from '@/api/wow/mall';
import { DeliverTypeDesc } from '@/enums/common';
import WowFooter from '../components/wowFooter/index.vue';

const router = useRouter();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
});
const productsList = ref<Record<string, any>>([]);
const hideOnSinglePage = computed(() => pagination.total <= 10);

const getProductList = () => {
  const { page, size } = pagination;
  const params = {
    pageNum: page,
    pageSize: size,
  };

  apiProductList(params) // TODO 添加查询参数
    .then((response) => {
      console.log('index.vue:106', response);
      const { total, records } = response || {};
      productsList.value = records || [];
      pagination.total = total;
    })
    .catch(() => {})
    .finally(() => {
      // loading.value = false;
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

onMounted(() => {
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

        span {
          margin-right: 40px;
        }
      }
    }
  }

  .result {
    padding: 16px 24px;
    background-color: #fff;

    .sort {
      margin-bottom: 16px;
      padding: 0 24px;
      background: #f2f3f8;

      span {
        display: inline-block;
        padding: 11px 16px;
        line-height: 22px;
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
