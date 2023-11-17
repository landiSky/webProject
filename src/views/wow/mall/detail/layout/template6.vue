<template>
  <div class="container">
    <div class="title">{{ props.templateData.moduleName }}</div>
    <div>
      <div
        v-for="(item, index) in props.templateData.blockList"
        :key="index"
        class="list"
      >
        <span v-for="(subItem, subIndex) in item" :key="subIndex" class="item">
          <img :src="subItem.url" alt="" />
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
});
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
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
    justify-content: start;
    padding: 0 24px;

    .item {
      display: flex;
      align-items: start;
      margin-right: 12px;
      padding: 20px;

      img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
      }
    }
  }
}
</style>
