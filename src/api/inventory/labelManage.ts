import $http from '@/utils/http';

// 分组列表接口
export function fetchGroupData() {
  return $http.get('/inventory/web/group/selectList');
}

// 行业分组标签接口
export function fetchLabelData(groupId: string) {
  return $http.get(`/inventory/web/tag/selectList?groupId=${groupId}`);
}
