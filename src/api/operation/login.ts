import $http from '@/utils/http';

// 获取验证码
export function getCaptcha() {
  return $http.get('/api/web/login/captcha');
}

// 用户登录
export function login(data: any) {
  return $http.post('/api/operation/login', data);
}

// 用户登出
export function logout() {
  return $http.get('/api/operation/logout');
}

// 用户信息
export function fetchUserInfo() {
  return $http.get('/api/operation/web/user/info');
}
