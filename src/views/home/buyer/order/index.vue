<template>
  <div class="biox">
    <Orderindex v-if="orderstatus === 0"> </Orderindex>
    <Dataoverview v-if="orderstatus === 1"></Dataoverview>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import Dataoverview from '@/components/dataoverview/index.vue';

import Orderindex from './orderindex.vue';

const orderstatus = ref(0);
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
