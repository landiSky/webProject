<template>
  <div class="container" :class="{ hasBg: props.bgIndex % 2 === 0 }">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div class="list">
      <template
        v-for="(item, index) in props.templateData.blockList"
        :key="index"
      >
        <span v-if="index % 2 === 0" class="item">
          <span class="leftWrap">
            <span class="subtitle">{{ item.name }}</span>
            <span class="desc">{{ item.desc }}</span>
          </span>
          <img
            :src="`/server/web/file/download?name=${item.picUrl}&productId=${props.productId}`"
            alt=""
          />
        </span>
        <span v-else class="item">
          <img
            :src="`/server/web/file/download?name=${item.picUrl}&productId=${props.productId}`"
            alt=""
          />
          <span class="rightWrap">
            <span class="subtitle">{{ item.name }}</span>
            <span class="desc">{{ item.desc }}</span>
          </span>
        </span>
      </template>
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
  padding-top: 12px;
  padding-bottom: 12px;

  &.hasBg {
    background-color: #fff;
  }

  &:not(.hasBg) {
    background-image: url('@/assets/images/wow/mall/detail_bg.jpg');
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
    flex-direction: column;
    justify-content: start;

    .item {
      display: flex;
      align-items: start;
      padding: 8px 24px 20px 24px;

      img {
        width: 460px;
        height: 300px;
      }

      .leftWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 402px;
        margin-top: 20px;
        padding-right: 20px;
      }

      .rightWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 402px;
        margin-top: 20px;
        padding-left: 20px;
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
        word-break: break-all;
      }
    }
  }
}
</style>
