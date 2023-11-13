import { defineStore } from 'pinia';
import { apiUsersInfo } from '@/api/user';
import { apiLogout, apiConfigInfo } from '@/api/login';
import { apiUserProfile } from '@/api/buyer/overview';
import { UserInfo } from '@/types/store';
import { clearToken, getToken } from '@/utils/auth';
import { AccountType, CompanyAuthStatus, NodeAuthStatus } from '@/enums/common';
// import { useMenuStore } from './menu';

interface UserState {
  userInfo: Record<string, any> | null; // UserInfo | null;
  counter: number;
  token?: string | null;
  userInfoByCompany: Record<string, any> | null;
  selectCompany: Record<string, any> | null;
  configInfo: Record<string, any> | null;
  updateMenu: boolean;
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

      // this.userInfoByCompany = {
      //   id: 1, // memberId
      //   username: '谢珍', // 用户名称
      //   companyId: 1, // 机构id
      //   companyName: 'kw企业', // 机构名称
      //   certificateStatus: 3, // 机构认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
      //   nodeStatus: 3, // 节点认证状态 0:待审核 1:已认证 2:已驳回 3:未认证
      //   primary: true, // 主账号 true 子账号 false
      //   roleNames: null, // 角色名称
      //   menuCodes: [
      //     'ROUTE_BUYER',
      //     'ROUTE_BUYER_ORDER',
      //     'ROUTE_SELLER',
      //     'ROUTE_SELLER_GOODS',
      //   ], // 菜单code
      // };
      return apiUserProfile({ companyId, memberId })
        .then((data: Record<string, any>) => {
          console.log('===获取用户企业信息===apiUserProfile', data);
          this.userInfoByCompany = data || {
            certificateStatus: CompanyAuthStatus.UNAUTH,
            nodeStatus: NodeAuthStatus.UNAUTH,
          };
        })
        .catch(() => {});
    },

    async changeSelectCompany(data: Record<string, any>) {
      console.log('user.ts:70===给selectCompany赋值', data);
      this.selectCompany = data;
      await this.getUserByCompany();
      console.log('user.ts:79===获取用户企业信息结束==');
      this.updateMenu = !this.updateMenu;
      // useMenuStore().genLeftMenu(this.userInfoByCompany?.menuCodes);
    },
    /**
     * 初始化信息：判断需不需要加载侧边栏，获取topmenu之后，对比当前的route path和id，从server获取sidemenu
     * @param path 当前浏览器上的路由
     */
    async getUserBasicInfo() {
      try {
        const userInfo = await apiUsersInfo();

        // console.log('user.ts:138==去更新 usecompany');

        // const userInfo = {
        //   userId: 1,
        //   mobile: '15210602855',
        //   username: 'super',
        //   nickName: '超级管理员',
        //   companyList: [
        //     {
        //       memberId: 12, // 成员id
        //       memberType: 1, // 成员类型 0:普通成员 1:管理员
        //       companyId: 1, // 企业id 必传
        //       companyName: '泰尔英福巴拉巴拉1', // 企业名称
        //     },
        //     {
        //       memberId: 13, // 成员id
        //       memberType: 0, // 成员类型 0:普通成员 1:管理员
        //       companyId: 2, // 企业id 必传
        //       companyName: '泰尔英福巴拉巴拉2', // 企业名称
        //     },
        //   ],
        // };

        this.userInfo = userInfo as any;

        const { companyId, companyList } = userInfo;
        // const { companyList } = userInfo;

        //   {
        //     "memberId": 1717495373822156800, //成员id
        //     "memberType": 1, //成员类型 0:普通成员 1:管理员
        //     "companyId": 1391254317244416, //企业id 必传
        //     "companyName": "y1t企业" //企业名称
        // }
        if (Array.isArray(companyList) && companyList.length) {
          const resultList = companyList.filter(
            (company: Record<string, any>) =>
              company.memberType === AccountType.ADMIN
          );

          const adminCompany =
            Array.isArray(resultList) && resultList.length
              ? resultList[0]
              : null;
          console.log(
            'user.ts:122====有多个企业',
            adminCompany,
            companyList[0]
          );
          this.changeSelectCompany(adminCompany || companyList[0]);
        } else {
          console.log('user.ts:139==去更新 usecompany');
          this.changeSelectCompany({ companyId, companyName: '' });
          this.updateMenu = !this.updateMenu;
          // useMenuStore().genLeftMenu([]);
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
      this.userInfo = null;
      this.userInfoByCompany = {
        certificateStatus: CompanyAuthStatus.UNAUTH,
        nodeStatus: NodeAuthStatus.UNAUTH,
      };
      this.selectCompany = {};
      this.token = '';

      await apiLogout();
      clearToken();

      const serverUri = import.meta.env.DEV
        ? import.meta.env.VITE_APP_DEV_HOST
        : this.configInfo?.redirectUri;
      window.location.href = `${this.configInfo?.logoutUrl}?server_uri=${serverUri}`;
    },

    clearUserInfo(): void {
      this.userInfo = null;
    },

    jumpToLogin(): void {
      const { loginUrl } = this.configInfo || {};

      // window.location.href = loginUrl;

      // window.location.href = loginUrl;
      window.location.href = import.meta.env.DEV
        ? `${import.meta.env.VITE_APP_DEV_LOGIN}` // 'http://sso-auth-gateway-a.dev.idx.space/sso/web/oauth/authorize?response_type=code&client_id=sso_platform&redirect_uri=http://10.14.148.246:3001&scope=all' // `${import.meta.env.VITE_APP_DEV_LOGIN}`
        : loginUrl; // TODO 上线后去掉
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
