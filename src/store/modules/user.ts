import { defineStore } from 'pinia';
import { apiUsersInfo } from '@/api/user';
import { apiLogout, apiConfigInfo } from '@/api/login';
import { apiUserProfile } from '@/api/buyer/overview';
import { UserInfo } from '@/types/store';
import { clearToken, getToken } from '@/utils/auth';
import { AccountType, CompanyAuthStatus, NodeAuthStatus } from '@/enums/common';
import { useRouter } from 'vue-router';

// import { useMenuStore } from './menu';

interface UserState {
  userInfo: Record<string, any> | null; // UserInfo | null;
  counter: number;
  token?: string | null;
  userInfoByCompany: Record<string, any> | null;
  selectCompany: Record<string, any> | null;
  configInfo: Record<string, any> | null;
  updateMenu: boolean;
  authPathList: string[];
  menuIndex: number;
  authData: Record<string, any> | null;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    userInfoByCompany: {
      certificateStatus: CompanyAuthStatus.UNAUTH,
      nodeStatus: NodeAuthStatus.UNAUTH,
    }, // 存储选择的对应公司下的用户信息
    selectCompany: {}, // 对象，存储选择的公司信息，{companyId, memeberId}
    counter: 0,
    token: null,
    configInfo: {},
    updateMenu: false,
    authPathList: [], // 存放已有权限的 path 列表
    menuIndex: 1,
    authData: {},
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
    getUserAuthData(): any | null {
      return this.authData || {};
    },
  },
  actions: {
    setUserAuthData(data: any) {
      this.authData = data;
    },
    setUserMenuIndex(index: number) {
      this.menuIndex = index;
    },
    getUserByCompany() {
      const { companyId, memberId } = this.selectCompany || {};

      return apiUserProfile({ companyId, memberId })
        .then((data: Record<string, any>) => {
          this.userInfoByCompany = data || {
            certificateStatus: CompanyAuthStatus.UNAUTH,
            nodeStatus: NodeAuthStatus.UNAUTH,
          };
        })
        .catch(() => {});
    },

    async changeSelectCompany(data: Record<string, any>) {
      this.selectCompany = data;
      await this.getUserByCompany();
      this.updateMenu = !this.updateMenu;
    },
    /**
     * 初始化信息：判断需不需要加载侧边栏，获取topmenu之后，对比当前的route path和id，从server获取sidemenu
     * @param path 当前浏览器上的路由
     */
    async getUserBasicInfo() {
      try {
        const userInfo = await apiUsersInfo();
        this.userInfo = userInfo as any;
        const { companyId, companyList, isAdmin } = userInfo;

        //   {
        //     "memberId": 1717495373822156800, //成员id
        //     "memberType": 1, //成员类型 0:普通成员 1:管理员
        //     "companyId": 1391254317244416, //企业id 必传
        //     "companyName": "y1t企业" //企业名称
        // }

        if (isAdmin) {
          this.updateMenu = !this.updateMenu;
          return userInfo;
        }
        if (Array.isArray(companyList) && companyList.length) {
          const resultList = companyList.filter(
            (company: Record<string, any>) =>
              company.memberType === AccountType.MAIN
          );
          const companyIndex = Number(localStorage.getItem('companyIndex'));
          const adminCompany =
            Array.isArray(resultList) && resultList.length && !companyIndex
              ? resultList[0]
              : null;
          await this.changeSelectCompany(
            adminCompany ||
              companyList[
                companyList.length === companyIndex + 1 ? companyIndex : 0
              ]
          );
        } else {
          await this.changeSelectCompany({ companyId, companyName: '' });
          this.updateMenu = !this.updateMenu;
        }
        return userInfo;
      } catch (error: any) {
        clearToken();
        return {};
      }
    },

    // 返回登录需要的 clientid/secret/publickey
    async getConfigInfo() {
      try {
        const configInfo = await apiConfigInfo();
        this.configInfo = configInfo;
        localStorage.setItem('configInfo', JSON.stringify(configInfo));
      } catch (error: any) {
        console.log('获取配置信息异常:', error);
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
      this.userInfo = null;
      this.userInfoByCompany = {
        certificateStatus: CompanyAuthStatus.UNAUTH,
        nodeStatus: NodeAuthStatus.UNAUTH,
      };
      this.selectCompany = {};
      this.token = '';

      await apiLogout();
      clearToken();

      // const serverUri = import.meta.env.DEV
      //   ? import.meta.env.VITE_APP_DEV_HOST
      //   : this.configInfo?.redirectUri;
      // window.location.href = `${this.configInfo?.logoutUrl}?server_uri=${serverUri}`;
      // /zst
      window.location.href = `${window.location.origin}/zst/`;
    },

    clearUserInfo(): void {
      this.userInfo = null;
    },

    jumpToLogin(routeName: string | undefined = ''): void {
      // const { loginUrl } = this.configInfo || {};

      if (routeName !== 'wowMallDetail') {
        sessionStorage.setItem('mallDetailPath', '');
      }
      // /zst
      window.location.href = `${window.location.origin}/zst/#/login`;
      // window.location.reload(); // 防止白屏

      // window.location.href = loginUrl;
      // window.location.href = `${import.meta.env.VITE_APP_DEV_LOGIN}`;
      // window.location.href = import.meta.env.DEV
      //   ? `${import.meta.env.VITE_APP_DEV_LOGIN}` // 'http://sso-auth-gateway-a.dev.idx.space/sso/web/oauth/authorize?response_type=code&client_id=sso_platform&redirect_uri=http://10.14.148.246:3001&scope=all' // `${import.meta.env.VITE_APP_DEV_LOGIN}`
      //   : loginUrl; // TODO 上线后去掉
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
