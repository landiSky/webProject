<!-- 平台服务页 -->
<template>
  <Container :components-list="componentList" show-anchor />
  <div v-if="componentList && componentList.length" class="platServices">
    <WowFooter></WowFooter>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from 'vue';

import Container from '@/views/decoration/decorationTools/pageContainer.vue';
import { apiGetNavData } from '@/api/decoration/decoration-tools';
import { ChannelType } from '@/enums/decoration';
import WowFooter from '../components/wowFooter/index.vue';

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
const componentList = ref([]);
onMounted(() => {
  apiGetNavData({ type: ChannelType.PLATFORM_SERVE }).then((res: any) => {
    if (res.data.length > 0) {
      const { detail } = res.data[0];
      if (!detail) return;
      componentList.value = JSON.parse(res.data[0].detail);
    }
  });
});
</script>

<style scoped lang="less">
.platServices {
  margin-top: 120px;
}
</style>
