<!-- 装饰工具 -->
<template>
  <div class="bar-box">
    <div class="bar-title">装修组件</div>
    <t-popover position="rt" :popup-visible="isFirstUse">
      <div
        :style="{
          position: 'absolute',
          top: '80px',
          left: '80px',
          color: 'transparent',
        }"
      >
        10
      </div>
      <template #title> 操作引导 </template>
      <template #content>
        <p>拖动左侧icon到指定区域，松开</p>
        <p>鼠标完成模版添加</p>
      </template>
    </t-popover>
    <editorToolBar @on-end="onEnd"></editorToolBar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import eventBus from '@/utils/bus';
import { apiGetIsFirstUseDecoration } from '@/api/decoration/decoration-tools';
import editorToolBar from './editor-tool-bar.vue';

const selectIndex = ref(-1);
const isFirstUse = ref(false);

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
  console.log(
    'editor-tool-bar-wrap 收到onEnd事件 开始广播insertIndex事件:',
    selectIndex.value
  );
};

onMounted(() => {
  apiGetIsFirstUseDecoration().then((res) => {
    isFirstUse.value = !res;
    console.log('是否第一次使用', !res);
    // 发消息
    setTimeout(() => {
      eventBus.emit('isFirstUseDecoration', isFirstUse.value);
    }, 100);
    setTimeout(() => {
      isFirstUse.value = false;
    }, 2000);
  });
});
</script>

<style scoped lang="less">
.bar-box {
  display: flex;
  flex-direction: column;
  height: 100vh;
  // width: 90px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* 标准语法 */

  .bar-title {
    height: 54px;
    color: #1d2129;
    font-weight: 500;
    font-size: 14px;
    line-height: 54px;
    text-align: center;
    box-shadow: 0 1px 2px 0 #0000001a;
  }
}
</style>
