import { defineStore } from 'pinia';
import { appMenus } from '@/router';

export const useMenuStore = defineStore({
  id: 'app-menu',
  state: (): {
    leftMenu: Array<any>;
    firstRoutePath: string;
  } => ({
    leftMenu: [],
    firstRoutePath: '',
  }),

  actions: {
    genLeftMenu(auths: string[]) {
      try {
        this.leftMenu = appMenus(auths);

        // if (!this.leftMenu?.length) {
        //   return '/403';
        // }

        // // 取第一个有权限的路由
        // let menuItem = this.leftMenu[0];
        // while (menuItem.children?.length) {
        //   menuItem = menuItem?.children[0] || {};
        // }
        // this.firstRoutePath = menuItem.path || path;
      } catch (e) {
        console.log('===menu-store,生成左侧菜单失败', e);
      }
    },
  },
});
