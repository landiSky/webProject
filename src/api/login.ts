import $http from '@/utils/http';

// 用户注册
export function apiRegisterUser(data: Record<string, any>) {
  return $http.post('/server/web/user/register', data);
}

// 发送验证码
export function apiSendCaptcha(params: Record<string, any>) {
  return $http.get('/server/web/captcha/sendCaptcha', {
    params,
    customFields: {
      returnRawResponse: true, // 业务方直接处理原始 response
    },
  });
}

// 绑定手机号或安全校验接口
export function apiBindPhone(data: Record<string, any>) {
  return $http.post('/server/web/user/userBind', data);
}

// 获取配置信息
export function apiConfigInfo() {
  return $http.get('/server/web/config');
}

// 获取 token
export function apiLoginToken(data: Record<string, any>, basic: string) {
  return $http.post('/sso/web/oauth/token', data, {
    customFields: {
      withoutToken: true,
    },
    headers: {
      Authorization: `Basic ${basic}`,
    },
  });
}

// 退出登录
export function apiLogout() {
  return $http.post('/auth/logout');
}

// 真正登录， 放到 form 表单那了
export function apiLogin(data: Record<string, any>) {
  return $http.post(`/auth/login`, data);
}

// 找回密码
export function userforgotPassword(data: Record<string, any>) {
  return $http.post(`/server/web/user/forgotPassword`, data);
}

// 登录前校验
export function apiChheckLogin(data: Record<string, any>) {
  return $http.post(`/sso/web/checkLogin`, data);
}

// 获取验证码
export function verificationCode(params: Record<string, any>) {
  return $http.get('/server/web/captcha/sendCaptcha', { params });
}

// 二级节点第三方登录
export function snmsClientLogin(params: Record<string, any>) {
  return $http.get('/auth/snmsClientLogin', {
    params,
    customFields: {
      returnRawResponse: true, // 业务方直接处理原始 response
    },
  });
}
