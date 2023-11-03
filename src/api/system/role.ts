import $http from '@/utils/http';

// 角色
export function rolelist(params: Record<string, any>) {
  return $http.get('/web/role/list');
}

//  获取企业下成员列表
export function apiMemberList(params: Record<string, any>) {
  return $http.get('/web/member/getCompanyMember', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
export function apiAuthMember(data: Record<string, any>) {
  return $http.post('/web/product/appConfig', data);
}
