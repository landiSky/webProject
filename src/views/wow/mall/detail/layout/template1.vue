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
        <span class="subtitle">{{ item.name }}</span>
        <span class="desc">{{ item.desc }}</span>
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
  padding-bottom: 8px;

  &.hasBg {
    background-color: #fff;
  }

  &:not(.hasBg) {
    background-image: url('@/assets/images/wow/mall/detail_bg.png');
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

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 290px;
      margin-right: 15px;
      padding: 20px 24px 40px 24px;

      &:last-child {
        margin-right: 0;
      }

      img {
        width: 128px;
        height: 128px;
        margin-bottom: 12px;
      }

      .subtitle {
        margin-bottom: 12px;
        color: #1d2129;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px; /* 150% */
      }

      .desc {
        color: #4e5969;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px; /* 157.143% */
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>
