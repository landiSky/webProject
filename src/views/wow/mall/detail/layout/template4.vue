<template>
  <div class="container" :class="{ hasBg: props.bgIndex % 2 === 0 }">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div class="list">
      <span
        v-for="(item, index) in props.templateData.blockList"
        :key="index"
        class="item"
      >
        <img
          :src="`/server/web/file/download?name=${item.picUrl}&productId=${props.productId}`"
          alt=""
        />
        <span class="wrap">
          <span class="subtitle">{{ item.name }}</span>
          <span class="desc">{{ item.desc }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  templateData: {
    type: Object,
    default: () => {},
  },
  bgIndex: {
    type: Number,
    default: 0,
  },
  productId: String,
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-bottom: 20px;
  padding: 20px;

  &.hasBg {
    background-color: #fff;
  }

  .title {
    margin-bottom: 8px;
    padding: 12px 0;
    color: #1d2129;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px; /* 140% */
  }

  .list {
    display: flex;
    justify-content: start;
    // padding: 0 24px;
    .item {
      display: flex;
      align-items: start;
      width: 200px;
      margin-right: 12px;

      img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
      }

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: start;

        .subtitle {
          margin-bottom: 8px;
          color: #1d2129;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px; /* 150% */
        }

        .desc {
          color: #4e5969;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px; /* 157.143% */
        }
      }
    }
  }
}
</style>
