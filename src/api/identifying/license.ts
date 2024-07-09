import $http from '@/utils/http';

// 普通用户分页查询
export function userLicenseList(data: Record<string, any>) {
  return $http.post('/server/web/license/page/list', data);
}

// 管理员分页查询
export function manageLicenseList(data: any) {
  return $http.post('/operation/web/license/pageList', data);
}

// license申请
export function userCreateLicense(data: Record<string, any>) {
  return $http.post('/server/web/license/create', data);
}

// license申请
export function manageApproveDetail(data: Record<string, any>) {
  return $http.post('/operation/web/license/approve', data);
}

// license详情-重新申请调用
export function userLicenseDetail(params: Record<string, any>) {
  return $http.get('/server/web/license/detail', params);
}

// license详情
export function manageLicenseDetail(params: Record<string, any>) {
  return $http.get('/operation/web/license/detail', params);
}
