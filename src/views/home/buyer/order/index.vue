<template>
  <!-- 买家订单中心 -->
  <div class="contain">
    <div class="content-heard">
      <div class="heard-name">订单管理</div>
      <div class="cardclass">
        <ul v-for="(item, index) in orderStatusTypeNav" :key="index">
          <li @click="clickNav(item.value, index)">
            <a :class="{ activecclass: activeIndex === index }"
              >{{ item.label }}
              <a class="status_counts">
                {{ item.label === '待支付' ? '(' + item.value + ')' : '' }}
              </a>
              <a class="status_counts">
                {{ item.label === '待审核' ? '(' + item.value + ')' : '' }}
              </a>
              <a class="status_counts">
                {{ item.label === '待交付' ? '(' + item.value + ')' : '' }}
              </a>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';

const orderStatusTypeNav = reactive([
  {
    label: '全部订单',
    value: null,
  },
  {
    label: '待支付',
    value: 2,
  },
  {
    label: '待审核',
    value: 2,
  },
  {
    label: '待交付',
    value: 3,
  },
  {
    label: '已完成',
    value: null,
  },
]);
const activeIndex = ref(0);
const clickNav = (value: number | null, ins: number) => {
  console.log(value, ins);
  activeIndex.value = ins;
};
</script>

<style lang="less">
.contain {
  width: 100%;
  height: auto;
  min-height: 100%;
  background: #f6f7fb;

  .content-heard {
    box-sizing: border-box;
    height: 100px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    .heard-name {
      padding: 24px 0 0 24px;
      color: #1d2129;
      font-weight: 600;
      font-size: 14px;
      font-family: 'PingFang SC';
      font-style: normal;
      line-height: 24px;
    }

    .cardclass {
      display: flex;
      margin-top: 5px;

      .status_counts {
        color: #1664ff;
        font-weight: 400;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        margin: 20px 16px 0 24px;
        color: #4e5969;
        font-weight: 400;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
        cursor: pointer;
      }

      li:hover {
        color: #165dff;
      }

      .nav-active {
        color: #165dff;
      }

      .activecclass {
        padding: 5px 0;
        color: #1664ff;
        font-weight: 600;
        font-size: 14px;
        font-family: 'PingFang SC';
        font-style: normal;
        line-height: 22px;
        border-bottom: 2px solid #1664ff;
      }
    }
  }
}
</style>
