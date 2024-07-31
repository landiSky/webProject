import $http from '@/utils/http';

// 详情回显
export function agreementDetail() {
  return $http.get(`/operation/web/protocol/detail`);
}

// 修改
export function agreementuUpdate(data: any) {
  return $http.post(`/operation/web/protocol/update`, data);
}
