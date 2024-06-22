<template>
  <div id="box" class="box1">
    <div class="certificate-01">
      <div>1</div>
      <div>2</div>
    </div>
    <div class="certificate-02"> IDInside产品认证证书 </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, onMounted } from 'vue';

const emit = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  productId: String,
});

onMounted(() => {});
</script>

<style scoped lang="less" scope>
.box1 {
  width: 509px;
  width: 509px;
  height: 100%;
  height: 707px;
  margin: 0 auto;
  padding: 57px 74px 0;
  //   background-image: url(@/assets/images/idinside/unified/icon-01.png);
  //   background-size: 100% 100%;
  background: beige;

  .certificate-01 {
    display: flex;
  }
}
</style>
