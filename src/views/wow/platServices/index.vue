<!-- 平台服务页 -->
<template>
  <Container :components-list="componentList" />
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

import Container from '@/views/decoration/decorationTools/pageContainer.vue';

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
const componentList = ref([
  {
    title: '单图',
    maxNum: 3,
    icon: 'singleImg',
    name: 'SigleImg',
    value: {
      src: '',
      title: '2222',
      linkType: 0,
      linkUrl: 'http://www.baidu.com',
      desc: 'balabala',
    },
    bgColor: '#ffffff#e2ecff',
  },
]);
onMounted(() => {
  // TODO 获取本模块的组件列表数据
  // componentList.value = [];
});
</script>

<style scoped lang="less"></style>
