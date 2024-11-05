import $http from '@/utils/http';

// 活跃企业节点数
export function apiActiveNode() {
  return $http.get('/server/web/company/getSnmsData');
}

// 企业节点概览
export function apiNodeOverall() {
  return $http.get('/server/web/company/getSnmsNodeData');
}

// 平台产品商品 id 跳转
export function apiGetProductId() {
  return $http.get('/server/web/reception/home');
}

// 根据code码判断登录或注册企业
export function thirdPartyUserInfo(params: Record<string, any>) {
  return $http.get(`/auth/web/client/publicServer/userInfo`, { params });
}

// 第三方用户注册
export function thirdPartyRegister(data: Record<string, any>) {
  return $http.post('/server/web/user/client/register', data);
}
