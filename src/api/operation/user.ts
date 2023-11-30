import $http from '@/utils/http';

// 认证审核
export function verify(data: any) {
  return $http.post('/operation/web/company/cert', data);
}

// 认证列表
export function verifyList(data: any) {
  return $http.post('/operation/web/company/list', data);
}

// 认证详情
export function verifyDetail(id: any) {
  return $http.get(`/operation/web/company/info?companyId=${id}`);
}

// 获取用户企业信息
export function getCreditCodeByCompany(id: any) {
  return $http.get(
    `/server/web/company/getCreditCodeByCompany?companyId=${id}`
  );
}
