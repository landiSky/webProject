<template>
  <div class="container">
    <div class="container-bg">
      <picture>
        <!-- 可能是一些对兼容性有要求的，但是性能表现更好的现代图片格式-->
        <source
          class="container-bg-img"
          :srcset="getImgPath('avif')"
          type="image/avif"
        />
        <source
          class="container-bg-img"
          :srcset="getImgPath('webp')"
          type="image/webp"
        />

        <!-- 最终的兜底方案-->
        <img class="container-bg-img" :src="getImgPath('jpg')" />
      </picture>
    </div>
    <Login />
  </div>
</template>

<script lang="ts" setup>
import loginBgJpg from '@/assets/images/login-bg.jpg';
import loginBgWebp from '@/assets/images/login-bg.webp';
import loginBgAvif from '@/assets/images/login-bg.avif';
import Login from './components/login.vue';

const getImgPath = (type: string) => {
  const imgObj: Record<string, any> = {
    jpg: loginBgJpg,
    webp: loginBgWebp,
    avif: loginBgAvif,
  };
  return imgObj[type];
};
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
