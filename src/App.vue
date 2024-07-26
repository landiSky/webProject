<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script lang="ts" setup>
import { onMounted, watch, provide, ref } from 'vue';

import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';
import { useRouter } from 'vue-router';
import { userMenu, manageMenu } from '@/enums/menuEnum';
import { clearToken } from './utils/auth';

const router = useRouter();

const userStore = useUserStore();
const menuStore = useMenuStore();

const isRouterAlive = ref(true);

const reload = () => {
  isRouterAlive.value = false; // 先关闭，
  setTimeout(() => {
    isRouterAlive.value = true;
  });
};

provide('reload', reload);

const infoRouteList = [
  'ROUTE_GOODS',
  'ROUTE_GOODS_MANAGE',
  'ROUTE_GOODS_OBSERVE',
  'ROUTE_USER',
  'ROUTE_USER_VERIFY',
  'ROUTE_SYNC',
  'ROUTE_SYNC_CLASS',
  'ROUTE_SYNC_GOODS',
  'ROUTE_SYNC_LABEL',
  'ROUTE_DECORATION',
  'ROUTE_DECORATION_BASE',
  'ROUTE_DECORATION_CHANNEL',
  'ROUTE_DECORATION_TOOLS',
  'ROUTE_DECORATION_TOOLS_INDEX',
  'ROUTE_SYNC_LICENSE',
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
    let authList =
      menuStore.menuIndex === 1
        ? userStore.userInfoByCompany?.menuCodes
        : userMenu(menuStore.menuIndex);
    if (isAdmin) {
      authList = opearationRouteList;
      if (source) {
        // authList = infoRouteList;
        authList = manageMenu(menuStore.menuIndex);
      }
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

  // 点击菜单时，捕捉报错，刷新页面
  router.onError((error) => {
    console.log('router error', error);
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      // reload(); // 类似于点击浏览器上的刷新页面按钮
      window.location.reload();
    }
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
