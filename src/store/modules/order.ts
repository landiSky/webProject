import { defineStore } from 'pinia';
import { apiUsersInfo } from '@/api/user';
import { apiLogout, apiConfigInfo } from '@/api/login';
import { UserInfo } from '@/types/store';
import { clearToken, getToken } from '@/utils/auth';

export const useOrderStore = defineStore({
  id: 'app-order',
  state: () => ({
    createOrderInfo: {}, // 创建订单对象
  }),
  getters: {
    // // 获取用户信息
    // apiUsersInfo(): UserInfo {
    //   return this.userInfo || {};
    // },
    // // 获取token
    // getToken(): string | null {
    //   return this.token || getToken();
    // },
  },
  actions: {
    // async initProject() {
    //   try {
    //     const userInfo = await apiUsersInfo();
    //     this.userInfo = userInfo as any;
    //     return userInfo;
    //   } catch (error: any) {
    //     if (error?.code === 502) {
    //       // 已登录下，服务端不可用，避免无限重定向
    //       clearToken();
    //     }
    //     return {};
    //   }
    // },
  },
});
