import { defineStore } from 'pinia';
import { apiUsersInfo } from '@/api/user';
import { apiLogout } from '@/api/login';
import { UserInfo } from '@/types/store';
import { clearToken, getToken } from '@/utils/auth';

interface UserState {
  userInfo: Record<string, any> | null; // UserInfo | null;
  counter: number;
  token?: string | null;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    counter: 0,
    token: null,
  }),
  getters: {
    // 获取用户信息
    apiUsersInfo(): UserInfo {
      return this.userInfo || {};
    },

    // 获取token
    getToken(): string | null {
      return this.token || getToken();
    },
  },
  actions: {
    /**
     * 初始化信息：判断需不需要加载侧边栏，获取topmenu之后，对比当前的route path和id，从server获取sidemenu
     * @param path 当前浏览器上的路由
     */
    async initProject() {
      try {
        const userInfo = await apiUsersInfo();
        this.userInfo = userInfo as any;

        return userInfo;
      } catch (error: any) {
        if (error?.code === 502) {
          // 已登录下，服务端不可用，避免无限重定向
          clearToken();
        }
        return {};
      }
    },

    /**
     * 获取用户信息
     */
    async setUserInfo() {
      const userInfo = await apiUsersInfo();
      this.userInfo = userInfo as any;
    },

    /**
     * 获取随机数
     */
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random());
      return this.counter;
    },

    /**
     * 根据用户名登录
     * @param userInfo 登录信息
     */
    // async loginByUsername(userInfo: LoginData) {
    //   const res = await login(userInfo);
    //   const { token } = res;
    //   this.token = token;
    //   setToken(token);
    // },

    /**
     * 登出
     */
    async logout(): Promise<void> {
      await apiLogout();
      this.userInfo = null;
      this.token = '';
      clearToken();
    },

    clearUserInfo(): void {
      this.userInfo = null;
    },
  },
});

// /**
//  * Need to be used outside the setup
//  * @returns
//  */
// export function useUserStoreWithOut() {
//   return useUserStore(store);
// }
