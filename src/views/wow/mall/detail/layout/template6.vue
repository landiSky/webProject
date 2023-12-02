<template>
  <div class="container" :class="{ hasBg: props.bgIndex % 2 === 0 }">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div>
      <div
        v-for="(item, index) in props.templateData.blockList"
        :key="index"
        class="list"
      >
        <span v-for="(subItem, subIndex) in item" :key="subIndex" class="item">
          <img :src="`${subItem.url}&productId=${props.productId}`" alt="" />
        </span>
      </div>
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
  padding: 12px 24px 12px 24px;

  &.hasBg {
    background-color: #fff;
  }

  &:not(.hasBg) {
    background-image: url('@/assets/images/wow/mall/detail_bg.png');
  }

  .title {
    margin-bottom: 12px;
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
      align-items: start;
      margin-right: 13px;
      padding-bottom: 20px;

      &:last-child {
        margin-right: 0;
      }

      img {
        width: 160px;
        height: 160px;
        // margin-right: 12px;
      }
    }
  }
}
</style>
