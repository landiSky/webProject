<template>
  <div class="container">
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
          <img :src="item.picUrl" alt />
        </span>
        <span v-else class="item">
          <img :src="item.picUrl" alt />
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
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  font-family: PingFang SC;
  background-color: #fff;

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

    .item {
      display: flex;
      // flex-direction: column;
      align-items: center;
      margin-right: 8px;
      padding: 20px 24px 20px 24px;

      img {
        width: 480px;
        height: 128px;
        margin-bottom: 12px;
      }

      .leftWrap {
        display: flex;
        flex-direction: column;
        align-items: end;
        margin-right: 24px;
      }

      .rightWrap {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-left: 24px;
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
      }
    }
  }
}
</style>
