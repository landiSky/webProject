<!-- 装饰工具 -->
<template>
  <div class="bar-box">
    <div class="bar-title">装修组件</div>
    <editorToolBar :config-tools="configTools" @on-end="onEnd"></editorToolBar>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from 'vue';
import configTools from '@/views/decoration/decorationTools/config/tools';
import eventBus from '@/utils/bus';
import editorToolBar from './editor-tool-bar.vue';

const props = defineProps({
  yyy: {
    type: Object,
    default() {
      return {};
    },
  },
});
const selectIndex = ref(-1);

// 左侧工具栏拖入后在列表中的位置
const onEnd = (index: number) => {
  selectIndex.value = index;
  console.log('onEnd:', selectIndex.value);
  eventBus.emit('insertIndex', index);
};
</script>

<style scoped lang="less">
.bar-box {
  display: flex;
  flex-direction: column;
  height: 100%;

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
