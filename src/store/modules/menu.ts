import { defineStore } from 'pinia';
import { appMenus } from '@/router';
import { userMenu, manageMenu } from '@/enums/menuEnum';

export const useMenuStore = defineStore({
  id: 'app-menu',
  state: (): {
    leftMenu: Array<any>;
    firstRoutePath: string;
    menuIndex: number;
  } => ({
    leftMenu: [],
    firstRoutePath: '',
    menuIndex: 1,
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
    setMenuIndex(num: number, userInfo: any) {
      this.menuIndex = num;
      const menuList = userInfo.isAdmin ? manageMenu(num) : userMenu(num);
      this.leftMenu = appMenus(menuList);
      // // 取第一个有权限的路由
      let menuItem = this.leftMenu[0];
      while (menuItem.children?.length) {
        menuItem = menuItem?.children[0] || {};
      }
      this.firstRoutePath = menuItem.path || '';
    },
  },
});
