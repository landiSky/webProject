<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';
import { clearToken } from './utils/auth';

const userStore = useUserStore();

const infoRouteList = [
  'ROUTE_GOODS',
  'ROUTE_GOODS_MANAGE',
  'ROUTE_GOODS_OBSERVE',
  'ROUTE_USER',
  'ROUTE_USER_VERIFY',
  'ROUTE_SYNC',
  'ROUTE_SYNC_CLASS',
  'ROUTE_SYNC_GOODS',
];

const opearationRouteList = [
  'ROUTE_GOODS',
  'ROUTE_GOODS_MANAGE',
  'ROUTE_GOODS_OBSERVE',
  'ROUTE_USER',
  'ROUTE_USER_VERIFY',
];

watch(
  () => userStore.updateMenu,
  () => {
    const { isAdmin, source } = userStore.userInfo || {};
    let authList = userStore.userInfoByCompany?.menuCodes || [];
    if (isAdmin) {
      authList = infoRouteList;
    }
    if (source) {
      authList = opearationRouteList;
    }
    useMenuStore().genLeftMenu(authList);
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  userStore.getConfigInfo();
  // 统一添加网络异常提示
  window.addEventListener('offline', () => {
    Message.error('网络有异常，请检查网络后再试。');
  });

  window.addEventListener(
    'error',
    (event) => {
      try {
        const typeList = ['SCRIPT', 'LINK']; // , 'IMG', 'AUDIO', 'VIDEO' 防止页面加载图片失败报错
        const errorTarget: {
          [name: string]: any;
        } = event.target as HTMLElement;
        if (
          errorTarget !== window &&
          errorTarget?.nodeName &&
          typeList.includes(errorTarget?.nodeName.toUpperCase())
        ) {
          Message.error('资源加载失败，请尝试刷新浏览器。');
        }
      } catch (e) {
        console.log('error 监听异常:', e);
      }
    },
    true
  );

  window.addEventListener('beforeunload', () => {
    // 页面卸载前清除 token，其实是在安全校验页面回退时清空 token
    if (window.location.hash === '#/safetycheck') {
      clearToken();
    }
  });
});
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
