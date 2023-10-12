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
    genLeftMenu(auths: string[], path: string) {
      try {
        this.leftMenu = appMenus(auths);
        if (!this.leftMenu?.length) {
          return '/403';
        }

        // 取第一个有权限的路由
        let menuItem = this.leftMenu[0];
        while (menuItem.children?.length) {
          menuItem = menuItem?.children[0] || {};
        }
        this.firstRoutePath = menuItem.path || path;

        return path;
      } catch (e) {
        return path;
      }
    },
  },
});

