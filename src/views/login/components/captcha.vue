<template>
  <t-slider-captcha
    v-model:visible="captchaVisible"
    :get-picture-config="pictureConfig"
    :check-picture-config="checkPictureConfig"
    @success="onSuccess"
  />
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['success']);
const pictureConfig = {
  url: '/api/v1/captcha/get',
  method: 'post',
};

const checkPictureConfig = {
  url: '/api/v1/captcha/check',
  method: 'post',
};

const onSuccess = () => emit('success');
</script>

<style lang="less"></style>
