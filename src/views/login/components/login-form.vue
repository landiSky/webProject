<template>
  <div class="login-form-wrapper">
    <login-username
      ref="refLoginUsername"
      @success="handleLoginSuccess"
    ></login-username>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginUsername from './login-username.vue';

const router = useRouter();

const refLoginUsername = ref();

// 登录成功
function handleLoginSuccess() {
  router.push('/home');
}
</script>

<style lang="less" scoped>
.login-form-wrapper {
  width: 600px;
  padding: 50px 100px 70px 100px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 4px 30px rgba(44, 91, 213, 0.5);

  :deep(.tele-form-item) {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.tele-form-item-label) {
    color: #1d2129;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;

    .tele-form-item-label-required-symbol {
      display: none;
    }
  }
}
</style>
