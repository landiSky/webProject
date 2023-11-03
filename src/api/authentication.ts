import $http from '@/utils/http';

// 认证状态
export function authentication(params: Record<string, any>) {
  return $http.get('/web/company/getStatus', { params });
}

//  认证详情
export function authDetails(params: Record<string, any>) {
  return $http.get('/web/company/info', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
export function authSubmit(data: Record<string, any>) {
  return $http.post('/web/company/saveOrUpdate', data);
}
