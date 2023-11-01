<template>
  <div class="container">
    <Login v-if="optType === 'login'" @register="loginToRegister" />
    <Register v-else @login="regisToLogin" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Login from './components/login.vue';
import Register from './components/register.vue';

const route = useRoute();
const optType = ref(route.query.type);

const regisToLogin = () => {
  optType.value = 'login';
};

const loginToRegister = () => {
  optType.value = 'register';
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;
  overflow: auto;
  background: url('@/assets/images/login-bg.svg') no-repeat center center;
  background-size: 100%;

  .container-title {
    padding-bottom: 18px;
    font-size: 48px;
  }

  // .content {
  //   position: relative;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;
  //   padding-top: 200px;
  // }
}
</style>
