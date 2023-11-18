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
      // margin-right: 12px;
      padding: 20px;

      img {
        width: 140px;
        height: 140px;
        // margin-right: 12px;
      }
    }
  }
}
</style>
