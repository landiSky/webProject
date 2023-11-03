import $http from '@/utils/http';

import { LoginByUsernameParams } from '@/types/login';

// 用户登录
export function apiLoginName(params: LoginByUsernameParams) {
  return $http.post('/api/v1/login/name', params);
}

// // 用户登出
// export function apiLogout() {
//   return $http.post('/api/v1/logout');
// }

// 用户注册
export function apiRegisterUser(data: Record<string, any>) {
  return $http.post('/web/user/register', data);
}

// 发送验证码
export function apiSendCaptcha(params: Record<string, any>) {
  return $http.get('/web/captcha/sendCaptcha', {
    params,
  });
}

// 获取配置信息
export function apiConfigInfo() {
  return $http.get('/web/config/info');
}

// 获取登录 code
export function apiWebOauth(params: Record<string, any>) {
  return $http.get('/sso/web/oauth/authorize', {
    params,
  });
}

// 真正登录
export function apiLogin(data: Record<string, any>) {
  return $http.post('/sso/web/login', data);
}

// 获取 token
export function apiLoginToken(data: Record<string, any>) {
  return $http.post('/sso/web/oauth/token', data);
}

// 退出登录
export function apiLogout() {
  return $http.post('/sso/web/logout');
}
