import type { Router } from 'vue-router';
import { whiteList } from '@/router';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';

/**
 * 创建路由守卫
 * @param router 路由
 */
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    /** 判断token是否有效
      -token有效
      --判断to页面是否登录页
      ---登录页，跳转home
      ---直接跳转
      --判断用户信息是否存在
      ---用户信息不存在，获取用户信息，再跳转页面
      -token无效
      --判断to页面是否需要登录
      ---不需要登录直接跳转
      ---需要跳转登录
    */

    const userStore = useUserStore();
    const menuStore = useMenuStore();

    if (getToken()) {
      if (to.path === '/login') {
        next('/buyer');
      } else if (!userStore.userInfo) {
        const userInfo: Record<string, any> = await userStore.initProject();
        if (userInfo?.userId) {
          // 获取用户信息失败后，跳转到login页面
          const path = menuStore.genLeftMenu(userInfo?.auths, to.fullPath);
          next(path);
        } else {
          next(`/login`);
        }
      } else if (to.matched.length === 0) {
        next(menuStore.firstRoutePath);
      } else {
        next();
      }
    } else if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
    }
  });
}
