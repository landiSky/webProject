<template>
  <t-slider-captcha
    v-model:visible="visible"
    :get-picture-config="pictureConfig"
    :check-picture-config="checkPictureConfig"
    @success="onSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, defineEmits, watch } from 'vue';

const visible = ref(true);

const emit = defineEmits(['success', 'cancel']);
const pictureConfig = {
  url: '/auth/captcha/get',
  method: 'post',
  customFields: {
    returnRawResponse: true,
  },
  data: {
    captchaType: 'blockPuzzle',
    clientUid: 'slider-b0e40059-aa45-42a9-84e3-b3752fb8e2ea',
    ts: 1698923751665,
  },
};

const checkPictureConfig = {
  url: '/auth/captcha/check',
  method: 'post',
};

watch(
  () => visible.value,
  (newV: boolean) => {
    if (!newV) {
      emit('cancel');
    }
  }
);

const onSuccess = () => emit('success');
</script>

<style lang="less"></style>
