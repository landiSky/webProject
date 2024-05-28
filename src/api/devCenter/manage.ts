import $http from '@/utils/http';

// 应用接入列表
export function fetchApplicationList(data: Record<string, any>) {
  return $http.post('/server/web/app/info/selectPageList', data);
}

// 应用接入新增
export function fetchApplicationAdd(data: Record<string, any>) {
  return $http.post('/server/web/app/info/insert', data);
}

// 应用详情
export function fetchApplicationDetail(id: string) {
  return $http.get(`/server/web/app/info/selectById?id=${id}`);
}

// 成员列表
export function fetchCompanyMember(companyId: string | undefined) {
  return $http.get(`/server/member/getCompanyMember?companyId=${companyId}`);
}

// 应用上线
export function fetchLaunch(data: Record<string, any>) {
  return $http.post('/server/web/app/info/updateOrLineStatus', data);
}
