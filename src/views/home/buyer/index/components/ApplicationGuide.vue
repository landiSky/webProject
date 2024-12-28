<template>
  <div class="application-guide-box">
    <div class="title">应用使用引导</div>
    <div class="guide-box">
      <div class="item-box">
        <div class="sub-title">应用介绍</div>
      </div>
      <div class="item-box item-360-box">
        <div class="sub-title">
          <span> 应用构建 </span>
          <span class="step"> step2 </span>
        </div>
      </div>
      <div class="item-box">
        <div class="sub-title">应用价值变现</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
</script>

<style scoped lang="less">
.application-guide-box {
  width: 100%;
  margin: 0 auto 24px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e5e8ef;
  border-radius: 4px;

  .title {
    margin-bottom: 20px;
    color: #223354;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;

    .sub-title {
      display: flex;
      justify-content: space-between;
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;
    }
  }

  .guide-box {
    display: flex;

    .item-box {
      width: 192px;
      height: 274px;
      margin-right: 24px;
      padding: 12px 16px;
      background: #f6f7fb;
      border-radius: 6px;

      &:last-child {
        margin-right: 0;
      }

      &.item-360-box {
        width: 360px;
      }
    }
  }
}
</style>
