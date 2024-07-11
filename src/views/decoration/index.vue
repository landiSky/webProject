<!-- 基本信息 -->
<template>
  <div>基本信息配置</div>
  <SourceMaterial />
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
} from 'vue';
import SourceMaterial from '@/components/sourceMaterial/index.vue';

const props = defineProps({
  xxx: {
    type: Boolean,
    default: false,
  },
  yyy: {
    type: Object,
    default() {
      return {};
    },
  },
});
</script>
