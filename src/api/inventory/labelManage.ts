import $http from '@/utils/http';

// 分组列表接口
export function fetchGroupData() {
  return $http.get('/inventory/web/group/selectList');
}

// 行业分组标签接口
export function fetchLabelData(groupId: string) {
  return $http.get(`/inventory/web/tag/selectList?groupId=${groupId}`);
}

// 获取前台筛选默认值
export function fetchFilterData() {
  return $http.get('/inventory/web/group/selectCountByType');
}

// 新增分组
export function fetchAddGroup(data: Record<string, any>) {
  return $http.post('/inventory/web/group/insert', data);
}
