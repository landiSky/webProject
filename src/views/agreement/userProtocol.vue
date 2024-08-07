<template>
  <div class="single">
    <div v-html="textData"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { agreementDetail } from '@/api/operation/agreement';

const textData: Record<string, any> = ref(``);

onMounted(() => {
  agreementDetail().then((res) => {
    textData.value = res.data.protocol;
  });
});
</script>

<style lang="less" scoped>
.single {
  padding: 20px;
  overflow: auto;
}
</style>
