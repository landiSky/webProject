<template>
  <div class="exception-container">
    <div class="img-wrapper">
      <img :src="statusImg[props.status.toString()]" />
    </div>
    <div class="title">
      <h4>{{ statusTip[props.status.toString()] }}</h4>
      <div class="margin-top-lg">
        <t-button type="primary" size="small" @click="backHome">
          重新访问
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

import image404 from '@/assets/images/img_404.png';
import image403 from '@/assets/images/img_403.png';
import image500 from '@/assets/images/img_500.png';
import { clearToken } from '@/utils/auth';

const props = defineProps({
  status: {
    type: [Number, String],
    default: '404',
  },
});

const userStore = useUserStore();

const router = useRouter();
const backHome = () => {
  switch (props.status) {
    case '403':
      clearToken();
      userStore.clearUserInfo();
      router.replace({ path: '/login' });
      break;
    default:
      router.go(0);
  }
};

const statusImg: { [name: string]: any } = {
  403: image403,
  404: image404,
  500: image500,
};

const statusTip: { [name: string]: any } = {
  403: '您没有权限访问该页面,请申请权限后重新登录',
  404: '您访问的页面不存在',
  500: '您访问的页面出错啦',
};
</script>

<style lang="less" scoped>
.exception-container {
  height: 100%;
  text-align: center;

  .img-wrapper {
    width: 80%;
    margin: 0 auto;

    & > img {
      width: 100%;
    }
  }

  .title {
    margin-top: -50px;
  }
}
</style>
