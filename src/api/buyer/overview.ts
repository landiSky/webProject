import $http from '@/utils/http';

// 买家中心  订单概览
export function orderOver(params: Record<string, any>) {
  return $http.get('/server/web/order/dataStatistics', { params });
}

// 已购应用
export function authDialogdata(params: Record<string, any>) {
  return $http.get('/server/web/order/purchasedApps', { params });
}
// 获取当前公司下用户的信息
export function apiUserProfile(params: Record<string, any>) {
  return $http.get('/server/web/user/profile', { params });
}

// 获取商品类型接口  一二级树结构
export function apiProductType() {
  return $http.get('/server/web/product/type/tree');
}

//  获取企业下成员列表
export function apiMemberList(params: Record<string, any>) {
  return $http.get('/server/web/member/getCompanyMember', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/server/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
// export function apiAuthMember(data: Record<string, any>) {
//   return $http.post('/server/web/product/appConfig', data);
// }
