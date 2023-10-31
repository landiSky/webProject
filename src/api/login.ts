import $http from '@/utils/http';

import { LoginByUsernameParams } from '@/types/login';

// 用户登录
export function apiLoginName(params: LoginByUsernameParams) {
  return $http.post('/api/v1/login/name', params);
}

// 用户登出
export function apiLogout() {
  return $http.post('/api/v1/logout');
}

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
