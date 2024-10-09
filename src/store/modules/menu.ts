import { defineStore } from 'pinia';
import { appMenus } from '@/router';
import { userMenu, manageMenu } from '@/enums/menuEnum';
import { useUserStore } from '@/store/modules/user';

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
      const opearationRouteList = [
        'ROUTE_GOODS',
        'ROUTE_GOODS_MANAGE',
        'ROUTE_GOODS_OBSERVE',
        'ROUTE_USER',
        'ROUTE_USER_VERIFY',
        'ROUTE_DECORATION',
        'ROUTE_DECORATION_BASE',
        'ROUTE_DECORATION_CHANNEL',
        'ROUTE_DECORATION_TOOLS',
        'ROUTE_DECORATION_TOOLS_INDEX',
        'ROUTE_DECORATION_FOOTERCONFIG',
        'ROUTE_USERAGREEMENT',
      ];
      this.menuIndex = num;
      useUserStore().setUserMenuIndex(num);
      const userMenuList =
        num === 1 ? useUserStore().userInfoByCompany?.menuCodes : userMenu(num);
      let menuList = userInfo.isAdmin ? manageMenu(num) : userMenuList;
      if (userInfo.isAdmin && !userInfo.source) {
        menuList = opearationRouteList;
      }
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
