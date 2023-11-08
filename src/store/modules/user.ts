import { defineStore } from 'pinia';
import { apiUsersInfo } from '@/api/user';
import { apiLogout, apiConfigInfo } from '@/api/login';
import { apiUserProfile } from '@/api/buyer/overview';
import { UserInfo } from '@/types/store';
import { clearToken, getToken } from '@/utils/auth';
import { AccountType } from '@/enums/common';
import { useMenuStore } from './menu';

interface UserState {
  userInfo: Record<string, any> | null; // UserInfo | null;
  counter: number;
  token?: string | null;
  userInfoByCompany: Record<string, any> | null;
  selectCompany: Record<string, any> | null;
  configInfo: Record<string, any> | null;
}

// const menuStore = useMenuStore();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    userInfoByCompany: null, // 存储选择的对应公司下的用户信息
    selectCompany: {}, // 对象，存储选择的公司信息，{companyId, memeberId}
    counter: 0,
    token: null,
    configInfo: {},
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
    getUserByCompany() {
      const { companyId, memberId } = this.selectCompany || {};
      apiUserProfile({ companyId, memberId })
        .then((data: Record<string, any>) => {
          this.userInfoByCompany = data;
        })
        .catch(() => {});
    },

    async changeSelectCompany(data: Record<string, any>) {
      this.selectCompany = data;
      await this.getUserByCompany();

      useMenuStore().genLeftMenu(this.userInfoByCompany?.menuCodes);
    },
    /**
     * 初始化信息：判断需不需要加载侧边栏，获取topmenu之后，对比当前的route path和id，从server获取sidemenu
     * @param path 当前浏览器上的路由
     */
    async getUserBasicInfo() {
      try {
        // const userInfo = await apiUsersInfo();

        const userInfo = {
          userId: 1,
          username: 'super',
          nickName: '超级管理员',

          auths: [
            'ROUTE_BUYER',
            'ROUTE_BUYER_INDEX',
            'ROUTE_BUYER_ORDER',
            'ROUTE_SELLER',
            'ROUTE_SELLER_GOODS',
            'ROUTE_SELLER_ORDER',
            'ROUTE_SYSTEM',
            'ROUTE_SYSTEM_USERS',
            'ROUTE_SYSTEM_ROLES',
            // 'ROUTE_SYSTEM_DATAOVERVIEW',
          ],
          companyList: [],
        };

        this.userInfo = userInfo as any;

        const { companyList } = userInfo;

        //   {
        //     "memberId": 1717495373822156800, //成员id
        //     "memberType": 1, //成员类型 0:普通成员 1:管理员
        //     "companyId": 1391254317244416, //企业id 必传
        //     "companyName": "y1t企业" //企业名称
        // }
        if (Array.isArray(companyList) && companyList.length) {
          const adminCompany = companyList.filter(
            (company: Record<string, any>) =>
              company.memberType === AccountType.ADMIN
          );

          this.changeSelectCompany(adminCompany || companyList[0]);
        } else {
          useMenuStore().genLeftMenu([]);
        }

        return userInfo;
      } catch (error: any) {
        console.log('user.ts:63==获取用户信息失败', Object.keys(error));

        // if (error?.code === 502) {
        // 已登录下，服务端不可用，避免无限重定向
        clearToken();
        // }
        return {};
      }
    },

    // 返回登录需要的 clientid/secret/publickey
    async getConfigInfo() {
      try {
        const configInfo = await apiConfigInfo();
        this.configInfo = configInfo;
        localStorage.setItem('configInfo', JSON.stringify(configInfo));
        console.log('user.ts:73====apiConfigInfo', this.configInfo);
      } catch (error: any) {
        console.log('user.ts:58==获取配置信息异常', error);
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

    jumpToLogin(): void {
      // eslint-disable-next-line camelcase
      const { client_id, redirect_uri } = this.configInfo || {};

      window.location.href = `${
        import.meta.env.VITE_APP_LOGIN
        // eslint-disable-next-line camelcase
      }?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}` as string;
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
