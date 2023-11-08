<template>
  <div class="container">
    <!-- <Login v-if="optType === 'login'" @register="loginToRegister" /> -->
    <Register />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiConfigInfo } from '@/api/login';
// import Login from './components/login.vue';
import Register from './components/register.vue';

const router = useRouter();
// const route = useRoute();
// const optType = ref(route.params.type || 'login');
// const configInfo = ref<Record<string, any>>({});

// const regisToLogin = () => {
//   // optType.value = 'login';
//   router.push('/buyer');
// };

// const loginToRegister = () => {
//   optType.value = 'register';
// };

onMounted(() => {
  // apiConfigInfo().then((data) => {
  //   // const tt = {
  //   //   client_id: 'sso_platform',
  //   //   client_secret: '8b9cd74e5a8c5c297c3851bb9bccbf5b',
  //   //   redirect_uri: 'http://10.14.148.246:3000/#/login',
  //   //   login_url: '',
  //   // };
  //   configInfo.value = data;
  //   // if ('code' in window.location.href) {
  //   // }
  //   // window.location.replace(configInfo.value.login_url);
  //   // console.log('index.vue:37', window.location);
  // });
});
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
