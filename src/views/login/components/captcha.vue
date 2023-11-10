<template>
  <t-slider-captcha
    :visible="visible"
    :get-picture-config="pictureConfig"
    :check-picture-config="checkPictureConfig"
    @success="onSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';

// const props = defineProps({
//   visible: {
//     type: Boolean,
//     default: false,
//   },
// });
const visible = ref(true);
const emit = defineEmits(['success']);
const pictureConfig = {
  url: '/static/api/v1/captcha/get',
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
  url: '/static/api/v1/captcha/check',
  method: 'post',
};

const onSuccess = () => emit('success');
</script>

<style lang="less"></style>
