import $http from '@/utils/http';

// 获取商品类型接口  一二级树结构
export function apiProductType() {
  return $http.get('/web/product/type/tree');
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

// 创建订单
export function apiCreateOrder(data: Record<string, any>) {
  return $http.post('/web/order/create', data);
}
