import type { Router } from 'vue-router';
import { whiteList } from '@/router';
import { getToken, setToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';

import { apiLoginToken } from '@/api/login';

// 直接通过 url 访问没有权限的地址，跳到概览页
const isBackAuthFirstPath = (toPath: string) => {
  const pathList = useUserStore().authPathList;

  // 如果新增了要权限判断的 path,要再这里添加
  const needAuth = /^\/(buyer|seller|system)\//.test(toPath);

  if (
    Array.isArray(pathList) &&
    pathList.length &&
    needAuth &&
    !pathList.includes(toPath)
  ) {
    return true;
  }
  return false;
};

/**
 * 创建路由守卫
 * @param router 路由
 */
export function createPermissionGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    // s1: 有 token， 已登录态
    if (getToken()) {
      if (userStore.userInfo) {
        // 在标识管理-license管理页面刷新路由，需要手动更新左侧菜单和选中一级菜单
        if (to.path === '/license/index' || to.path === '/overview/index') {
          useMenuStore().setMenuIndex(2, userStore.userInfo);
        } else {
          useMenuStore().setMenuIndex(1, userStore.userInfo);
        }
      }
      // s1-1: 没有用户信息
      if (!userStore.userInfo) {
        // async 形式的控制台总报 invalid guard 问题
        userStore
          .getUserBasicInfo()
          .then((res) => {
            const userInfo: Record<string, any> = res;

            if (userInfo?.id) {
              if (userInfo?.bindStatus === 1 || userInfo?.safeCheck) {
                // 跳转到绑定页面，进行手机号绑定和安全校验
                next('/safetycheck');
                // return;
              }
              // isadmin 账号能跳转到前台预览页，会走到这里，所以有下面的判断
              if (userInfo?.isAdmin && to.fullPath.startsWith('/buyer')) {
                next('/goods');
              } else if (isBackAuthFirstPath(to.path)) {
                // 用 path 是为了避免 fullpath 携带的查询参数
                next('/buyer/index');
              } else {
                next();
              }
            } else {
              next('/wow/index');
            }
          })
          .catch(() => next());
      } else if (userStore.userInfo?.bindStatus === 1) {
        // safecheck 会一直为 true，如果开启的话
        // s1-2: 有用户信息，且需要做绑定验证
        if (to.fullPath === '/safetycheck' || to.fullPath.startsWith('/wow/')) {
          next();
        } else if (to.query.safeCheck) {
          // 安全校验成功后，而不是停留在校验页面，能继续往后走
          next();
        } else {
          next('/safetycheck');
        }
        // 跳转到绑定页面，进行手机号绑定和安全校验
      } else if (to.matched.length === 0) {
        // s1-3: 有用户信息，路由均不匹配，跳到首页，运营跳运营，前台跳前台
        const indexUrl = userStore.userInfo?.isAdmin ? '/goods' : '/buyer';
        next(indexUrl);
      } else if (isBackAuthFirstPath(to.path)) {
        next('/buyer/index');
      } else {
        next();
      }
    } else if (window.location.search.includes('code=')) {
      // s2: 没有 token, url 上有 code, 代表登录要成功了，去获取 token
      const { search } = window.location;
      const codeIndex = search.indexOf('code=');
      const code = search.slice(codeIndex + 5, codeIndex + 12);

      let configInfo: Record<string, any> = {};
      if (userStore.configInfo?.client_id) {
        configInfo = userStore.configInfo;
      } else {
        configInfo = JSON.parse(localStorage.getItem('configInfo') as string);
      }
      // eslint-disable-next-line camelcase
      const { clientId, clientSecret, redirectUri, basic } = configInfo;

      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('scope', 'all');
      formData.append('code', code);

      formData.append(
        'redirect_uri',
        import.meta.env.DEV
          ? `${import.meta.env.VITE_APP_DEV_HOST}`
          : redirectUri
      );
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);

      apiLoginToken(formData, basic)
        .then((data: Record<string, any>) => {
          setToken(data.accessToken);

          // 这时候还拿不到userInfo
          // 从商品详情页跳转登录，成功后也返回到商品详情页，详情路径存放在sessionstorage 中
          const mallDetailPath = sessionStorage.getItem('mallDetailPath');
          const uriHash = mallDetailPath || '/buyer/index';
          window.location.replace(
            `${window.location.protocol}//${window.location.host}/#${uriHash}`
          );
        })
        .catch(() => {
          window.location.href = `${window.location.protocol}//${window.location.host}/#/wow`;
        });
    } else if (
      whiteList.indexOf(to.path) !== -1 ||
      to.path.startsWith('/wow/mall/detail/') ||
      to.path.startsWith('/wow/platProducts') ||
      to.path.startsWith('/wow/lightApplicationMall')
    ) {
      // s3: 路由在白名单里，不需要做鉴权，商城的商品详情页也不需要鉴权
      next();
    } else {
      // s4: 没有 token，需要鉴权，去登录页
      next('/login');
    }
  });
}
