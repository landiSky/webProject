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

    if (getToken()) {
      if (!userStore.userInfo) {
        const userInfo: Record<
          string,
          any
        > = await userStore.getUserBasicInfo();

        if (userInfo?.userId) {
          if (userInfo?.bindStatus === 1 || userInfo?.safeCheck) {
            // 跳转到绑定页面，进行手机号绑定和安全校验
            next('/safetycheck');
            // return;
          }
          // isadmin 账号能跳转到前台预览页，会走到这里，所以有下面的判断
          if (userInfo?.isAdmin && to.fullPath.startsWith('/buyer')) {
            next('/goods');
          } else {
            next();
          }
        } else {
          next('/wow/index');
        }
      } else if (
        userStore.userInfo?.bindStatus === 1 ||
        userStore.userInfo?.safeCheck
      ) {
        if (to.fullPath === '/safetycheck' || to.fullPath.startsWith('/wow/')) {
          next();
        } else {
          next('/safetycheck');
        }
        // 跳转到绑定页面，进行手机号绑定和安全校验
      } else if (to.matched.length === 0) {
        const indexUrl = userStore.userInfo?.isAdmin ? '/goods' : '/buyer';
        next(indexUrl);
      } else {
        next();
      }
    } else if (window.location.search.includes('code=')) {
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
      );
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);

      apiLoginToken(formData)
        .then((data: Record<string, any>) => {
          setToken(data.accessToken);

          // 这时候还拿不到userInfo
          // const indexUrl = userStore.userInfo?.isAdmin ? '#/goods' : '#/buyer';
          // 从商品详情页跳转登录，成功后返回
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
      to.path.startsWith('/wow/mall/detail/')
    ) {
      next();
    } else {
      // next('/login');
      userStore.jumpToLogin();
    }
  });
}
