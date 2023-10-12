<template>
  <div class="container">
    <div class="header-cls">
      <t-space>
        <iconpark-icon
          name="logo-white"
          size="24px"
          color="white"
        ></iconpark-icon>
        <span class="title"> 元数据管理平台 </span>
      </t-space>
    </div>
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;
  overflow: auto;
  background: url('@/assets/images/login-bg.jpg') no-repeat center center;
  background-size: 100% 100%;

  .container-title {
    padding-bottom: 18px;
    font-size: 48px;
  }

  .header-cls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    padding: 11px 0 10px 20px;
    color: #fff;
    vertical-align: middle;
    background: #1d2129;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200px;
  }
}
</style>
