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
  return $http.get(
    `/server/web/member/getCompanyMember?companyId=${companyId}`
  );
}

// 应用上线
export function fetchLaunch(data: Record<string, any>) {
  return $http.post('/server/web/app/info/upLine', data, {
    customFields: {
      returnRawResponse: true,
    },
  });
}

// 应用保存
export function fetchSave(data: Record<string, any>) {
  return $http.post('/server/web/app/info/save', data, {
    customFields: {
      returnRawResponse: true,
    },
  });
}

// 判断应用是否可以下线
export function fetchOffineStatus(id: string) {
  return $http.get(`/server/web/app/info/checkStatus?id=${id}`);
}

// 应用下线
export function fetchOffine(data: Record<string, any>) {
  return $http.post('/server/web/app/info/lineStatus', data);
}

// 应用删除
export function fetchDel(id: string) {
  return $http.get(`/server/web/app/info/deleteById?id=${id}`);
}

// 取消调试-应用状态修改
export function fetchCancelDebug(params: Record<string, any>) {
  return $http.get(`/server/web/app/info/cancelDebug`, { params });
}

// 调试中应用登录
export function fetchDebuggingLogin(params: Record<string, any>) {
  return $http.get(`/auth/debuggingLogin`, { params });
}
