import $http from '@/utils/http';

// 用户注册
export function apiRegisterUser(data: Record<string, any>) {
  return $http.post('/server/web/user/register', data);
}

// 发送验证码
export function apiSendCaptcha(params: Record<string, any>) {
  return $http.get('/server/web/captcha/sendCaptcha', {
    params,
  });
}

// 获取配置信息
export function apiConfigInfo() {
  return $http.get('/sso/web/config');
}

// 获取 token
export function apiLoginToken(data: Record<string, any>) {
  return $http.post('/sso/web/oauth/token', data, {
    customFields: {
      withoutToken: true,
    },
    headers: {
      Authorization:
        'Basic c3NvX3BsYXRmb3JtOjhiOWNkNzRlNWE4YzVjMjk3YzM4NTFiYjliY2NiZjVi',
    },
  });
}

// 退出登录
export function apiLogout() {
  return $http.get('/sso/web/logout');
}
