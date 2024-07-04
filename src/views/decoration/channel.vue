<!-- 这里是渠道页面 -->
<template>
  <div>渠道页面待开发</div>
  <div
    style="margin-top: 20px; color: #1664ff; text-align: left; cursor: pointer"
    @click="goDecoration"
    >去装修>></div
  >
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
import { useRouter } from 'vue-router';

const router = useRouter();
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

const goDecoration = () => {
  // router.push({ path: '/decoration/tools' });
  // window.open('/decoration/tools', '_blank');
  const routeUrl = router.resolve({
    name: 'decorationTools',
    query: { id: 'value' },
  });
  window.open(routeUrl.href, '_blank');
};
</script>

<style scoped lang="less"></style>
