<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';

const userStore = useUserStore();

const opearationRouteList = [
  'ROUTE_GOODS',
  'ROUTE_GOODS_MANAGE',
  'ROUTE_GOODS_OBSERVE',
  'ROUTE_USER',
  'ROUTE_USER_VERIFY',
  'ROUTE_SYNC',
  'ROUTE_SYNC_CLASS',
  'ROUTE_SYNC_GOODS',
];

watch(
  () => userStore.updateMenu,
  () => {
    const { isAdmin } = userStore.userInfo || {};
    console.log('App.vue:15===更新菜单', isAdmin, userStore.userInfo);
    const authList = isAdmin // 是后台管理员的话显示运营后台菜单
      ? opearationRouteList
      : userStore.userInfoByCompany?.menuCodes || [];
    console.log('App.vue:31', authList);
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
        console.log("window addEventListener('error')");
      }
    },
    true
  );
});
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
