import $http from '@/utils/http';

// 获取商品类型接口  一二级树结构
export function apiProductType() {
  return $http.get('/server/web/product/type/tree');
}

//  获取企业下成员列表
export function apiMemberList(params: Record<string, any>) {
  return $http.get('/server/web/member/getCompanyMember', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(data: Record<string, any>) {
  return $http.post('/server/web/product/member/selectConfig', data);
}

// 给应用授权可查看的成员
export function apiAuthMember(data: Record<string, any>) {
  return $http.post('/server/web/product/member/saveConfig', data);
}
