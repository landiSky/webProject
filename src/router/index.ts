import type { App } from 'vue';
import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import { useUserStore } from '@/store/modules/user';
import { RouteAuthEnum } from '@/enums/authEnum';
// import DynamicRoutes from './routes';
import homeRoutesList from './routes/home';
import wowRoutesList from './routes/wow';
import operationRoutesList from './routes/operation';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 配置项目中没有涉及权限的公共路由
const constantRoutes = [
  {
    path: '/',
    name: 'root',
    redirect: '/wow',
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('@/views/agreement/userProtocol.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/safetycheck',
    name: 'safetyCheck',
    component: () => import('@/views/login/safetyCheck.vue'),
  },
];

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/error-page/404.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/error-page/500.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/error-page/403.vue'),
  },
];

const routesList = [...constantRoutes, ...errorRoutes];

// 不需要做登陆鉴权的路由放白名单里
export const whiteList = [
  '/login',
  '/register',
  '/404',
  '/500',
  '/403',
  '/agreement',
  '/wow/index',
  '/wow/freeApp',
  '/wow/mall',
  '/wow/platProducts',
  '/devCenter/manage',
];

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory(),
  routes: [
    ...routesList,
    ...homeRoutesList,
    ...wowRoutesList,
    ...operationRoutesList,
  ],
  scrollBehavior() {
    // 路由切换时，自动滚到页面顶部
    document.querySelector('#scrollMain')?.scrollTo(0, 0);
  },
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}

export function JumpToLogin() {
  router.push({ path: '/login' });
}

// 全部左侧menu，在store中根据permission动态生成左侧菜单
export const appMenus = (authsList: Array<string> = []) => {
  const { isAdmin } = useUserStore().userInfo || {};
  const pathList: string[] = [];

  // TODO 优化迭代逻辑
  const iterMenu = (list: Array<any>): any => {
    const menuList: Array<{
      name: string;
      path: string;
      children: Array<any>;
    }> = [];
    const len = list.length;

    for (let i = 0; i < len; i += 1) {
      const { path, children = [], meta = {} } = list[i];

      // TODO mock环境先去掉路由权限显示 && authsList.includes(RouteAuthEnum[path])
      if (
        !meta.hideInMenu &&
        (authsList.includes(RouteAuthEnum[path]) || (!isAdmin && meta.noAuth))
      ) {
        const menuItem = {
          name: meta.name,
          path,
          parentPath: meta.parentPath,
          children: [],
        };
        if (children.length) {
          menuItem.children = iterMenu(children);
        }
        pathList.push(path);
        menuList.push(menuItem);
      }
    }

    return menuList;
  };

  const menuList = iterMenu([...homeRoutesList, ...operationRoutesList]);
  useUserStore().authPathList = pathList;
  return menuList;
};

export default router;
