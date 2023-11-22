<template>
  <div class="container">
    <div class="container-bg">
      <img class="container-bg-img" src="@/assets/images/login-bg.jpg" />
    </div>
    <Register />
  </div>
</template>

<script lang="ts" setup>
import Register from './components/register.vue';
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .container-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .container-bg-img {
    width: 100%;
    min-width: 1920px;
    height: auto;
  }

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
