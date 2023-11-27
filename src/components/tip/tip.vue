<template>
  <t-tooltip
    effect="dark"
    :content="props.tooltipContent ? props.tooltipContent : props.content"
    placement="top"
    :disabled="isShow"
  >
    <template #content>
      <slot name="tooltipContent">{{
        props.tooltipContent ? props.tooltipContent : props.content
      }}</slot>
    </template>
    <div
      class="content"
      :style="{ width: props.width }"
      @mouseover="isShowTooltip"
    >
      <span ref="contentRef">
        <!-- 给一个没有写插槽的默认值，兼容纯文本的情况 -->
        <slot name="content">{{ props.content }}</slot>
      </span>
    </div>
  </t-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// 定义props的类型
interface props {
  content?: string;
  width: string;
  tooltipContent?: string;
}
// 使用withDefaults来给props赋默认值
// eslint-disable-next-line no-redeclare
const props = withDefaults(defineProps<props>(), {
  content: '',
  width: '',
  tooltipContent: '',
});
// 使用isShow来控制tooltip是否显示
const isShow = ref<boolean>(true);
// 在span标签上定义一个ref
const contentRef = ref();
// eslint-disable-next-line func-names
const isShowTooltip = function (): void {
  // 计算span标签的offsetWidth与盒子元素的offsetWidth，给isShow赋值
  if (contentRef.value.parentNode.offsetWidth > contentRef.value.offsetWidth) {
    isShow.value = true;
  } else {
    isShow.value = false;
  }
};
</script>

<style>
.content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
