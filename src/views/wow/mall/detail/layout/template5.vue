<template>
  <div class="container" :class="{ hasBg: props.bgIndex % 2 === 0 }">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div class="list">
      <span
        v-for="(item, index) in props.templateData.blockList"
        :key="index"
        class="item"
      >
        <span class="wrap">
          <span class="subtitle">{{ item.name1 }}</span>
          <span class="desc">{{ item.desc1 }}</span>
        </span>
        <span class="wrap">
          <span class="subtitle">{{ item.name2 }}</span>
          <span class="desc">{{ item.desc2 }}</span>
        </span>
        <span class="wrap">
          <span class="subtitle">{{ item.name3 }}</span>
          <span class="desc">{{ item.desc3 }}</span>
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
    flex-direction: column;
    justify-content: start;
    width: 100%;

    .item {
      display: flex;
      //   flex-direction: column;
      align-items: center;
      margin-right: 8px;
      padding: 20px 24px 40px 24px;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 8px;
        padding: 0 24px;

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
          word-break: break-all;
        }
      }
    }
  }
}
</style>
