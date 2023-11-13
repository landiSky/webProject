import type { Router } from 'vue-router';
import { whiteList } from '@/router';
import { getToken, setToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';

// import { useMenuStore } from '@/store/modules/menu';
import { apiLoginToken } from '@/api/login';

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
    // const menuStore = useMenuStore();

    // console.log('permissionGuard.ts:28', to.path, from.path);

    if (getToken()) {
      if (!userStore.userInfo) {
        // const userInfo: Record<string, any> =
        // console.log('permissionGuard.ts:35', userStore.userInfo);
        const userInfo: Record<
          string,
          any
        > = await userStore.getUserBasicInfo();
        // console.log('permissionGuard.ts:36', userInfo);

        const indexUrl = userInfo?.isAdmin ? '/goods' : '/buyer';
        if (userInfo?.userId) {
          console.log('permissionGuard.ts:43', to.fullPath);
          next(indexUrl);
        } else {
          console.log('permissionGuard.ts:46', to.fullPath);
          next('/wow/index');
        }
        // if (userInfo?.userId) {
        //   // 获取用户信息失败后，跳转到login页面
        //   const path = menuStore.genLeftMenu(userInfo?.auths, to.fullPath);
        //   next(path);
        // } else {
        //   next(`/login`);
        // }
      } else if (to.matched.length === 0) {
        console.log('permissionGuard.ts:55', to.fullPath);
        const indexUrl = userStore.userInfo?.isAdmin ? '/goods' : '/buyer';
        next(indexUrl);
      } else {
        console.log('permissionGuard.ts:58', to.fullPath);
        next();
      }
    } else if (window.location.search.includes('code=')) {
      console.log('permissionGuard.ts:52', window.location.search);

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
      const { clientId, clientSecret, redirectUri } = configInfo;

      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('scope', 'all');
      formData.append('code', code);

      formData.append(
        'redirect_uri',
        import.meta.env.DEV
          ? `${import.meta.env.VITE_APP_DEV_HOST}`
          : redirectUri
      ); // TODO 只做本地测试这样写，上线
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);

      apiLoginToken(formData)
        .then((data: Record<string, any>) => {
          console.log('permissionGuard.ts:60', data.accessToken);
          setToken(data.accessToken);

          const indexUrl = userStore.userInfo?.isAdmin ? '#/goods' : '#/buyer';
          console.log('permissionGuard.ts:61', indexUrl);
          window.location.href = `${window.location.protocol}//${window.location.host}/${indexUrl}`;
        })
        .catch((err: any) => {
          console.log('permissionGuard.ts:89==获取 token 异常', err);
          window.location.href = `${window.location.protocol}//${window.location.host}/#/wow`;
        });
    } else if (whiteList.indexOf(to.path) !== -1) {
      console.log('permissionGuard.ts:113', to.fullPath);
      next();
    } else {
      // next('/login');
      userStore.jumpToLogin();
    }
  });
}
