<!-- 装饰工具 -->
<template>
  <div class="bar-box">
    <div class="bar-title">装修组件</div>
    <editorToolBar @on-end="onEnd"></editorToolBar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import eventBus from '@/utils/bus';
import editorToolBar from './editor-tool-bar.vue';

const selectIndex = ref(-1);

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
  console.log(
    'editor-tool-bar-wrap 收到onEnd事件 开始广播insertIndex事件:',
    selectIndex.value
  );

  eventBus.emit('insertIndex', index);
};

onMounted(() => {});
</script>

<style scoped lang="less">
.bar-box {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  }
}
</style>
