<template>
  <div ref="containerRef" class="ellipsis-text-wrap">
    <span v-if="!showTooltip">
      <span v-if="copy" ref="contentRef" v-copy="value">
        {{ value || '-' }}
      </span>
      <span v-else ref="contentRef">
        {{ value || '-' }}
      </span>
    </span>

    <t-tooltip v-else placement="top">
      <template #content>
        <div
          v-if="copy"
          v-copy="value"
          :style="{ width: `${containerRefWidth}px` }"
        >
          {{ value }}
        </div>
        <div v-else :style="{ width: `${containerRefWidth}px` }">
          {{ value }}
        </div>
      </template>
      <span v-if="copy" v-copy="value" class="text-ellipsis">{{
        value || '-'
      }}</span>
      <span v-else class="text-ellipsis">{{ value || '-' }}</span>
    </t-tooltip>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  ref,
  toRefs,
  onMounted,
  onUpdated,
  onUnmounted,
  watch,
} from 'vue';

const timer = ref();

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  copy: {
    // 是否允许复制
    type: Boolean,
    default: true,
  },
  // 手动计算
  refresh: {
    type: Boolean,
    default: false,
  },
});

const { value } = toRefs(props);

const showTooltip = ref(false);

// 获取ref
const contentRef: any = ref();
const containerRef: any = ref();

const containerRefWidth = ref(0);

const calTooltip = () => {
  if (containerRef.value && contentRef.value) {
    containerRefWidth.value = containerRef.value.offsetWidth;
    const show = contentRef.value.offsetWidth > containerRefWidth.value;
    if (show !== showTooltip.value) {
      showTooltip.value = show;
    }
  }
};

watch(
  () => props.refresh,
  (val: boolean) => {
    if (val) {
      calTooltip();
    }
  }
);

onMounted(() => {
  console.log('ellipsis onMounted');
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  timer.value = setTimeout(() => {
    calTooltip();
  });
});
onUpdated(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  timer.value = setTimeout(() => {
    calTooltip();
  });
});

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});
</script>

<style lang="less" scoped>
.ellipsis-text-wrap {
  max-width: 100%;
  white-space: nowrap;
}

.text-ellipsis {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  cursor: pointer;
}
</style>
