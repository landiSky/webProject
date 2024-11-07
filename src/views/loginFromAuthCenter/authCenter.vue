<template>
  <div class="main-login-content"></div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps } from 'vue';
import { thirdPartyUserInfo } from '@/api/wow/index';
import { useRouter } from 'vue-router';
import { setToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
  code: String,
});
const singleSignOn = () => {
  if (!props.code) return;
  const params = {
    code: props.code,
  };
  thirdPartyUserInfo(params)
    .then((data: any) => {
      if (Number(data.checkStatus) === 1) {
        // 手机号和认证信息都存在时直接单点登录进本系统  token
        userStore.clearUserInfo();
        setToken(data?.tokenValue);
      } else {
        useUserStore().setUserAuthData(data);
      }
      router.push({
        path: '/wow/index',
        query: {
          type: '1',
        },
      });
    })
    .catch(() => {
      router.push({
        path: '/wow/index',
        query: {},
      });
    });
};
onMounted(() => {
  singleSignOn();
});
</script>

<style lang="less" scoped>
.main-login-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
