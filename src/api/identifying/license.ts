import $http from '@/utils/http';

// 普通用户分页查询
export function userLicenseList(data: Record<string, any>) {
  return $http.post('/server/web/license/page/list', data);
}

// 管理员分页查询
export function manageLicenseList(data: Record<string, any>) {
  return $http.post('/inventory/web/license/pageList', data);
}

// license申请
export function userCreateLicense(data: Record<string, any>) {
  return $http.post('/server/web/license/create', data);
}

// license审核
export function manageApproveDetail(data: Record<string, any>) {
  return $http.post('/inventory/web/license/approve', data);
}

// license详情-重新申请调用
export function userLicenseDetail(params: Record<string, any>) {
  return $http.get('/server/web/license/detail', { params });
}

// license详情
export function manageLicenseDetail(params: Record<string, any>) {
  return $http.get('/inventory/web/license/detail', { params });
}

// license审核信息回显
export function manageLicenseInfoDetail(params: Record<string, any>) {
  return $http.get('/inventory/web/license/info', { params });
}

// 解析前缀是否存在
export function userResolvePrefix(data: Record<string, any>) {
  return $http.post(`/server/web/license/resolvePrefix?prefix=${data.prefix}`);
}

// 获取指纹码地址
export function userDownloadTool() {
  return $http.get(`/server/web/license/getFingerPrintUrl`);
}

// 获取用户前缀列表
export function userGetAllPrefix() {
  return $http.get(`/server/web/license/getAllPrefix`);
}
