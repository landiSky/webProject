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

// 编辑分组
export function fetchEditGroup(data: Record<string, any>) {
  return $http.post('/inventory/web/group/update', data);
}

// 删除分组
export function fetchDelGroup(id: string) {
  return $http.get(`/inventory/web/group/deleteById?id=${id}`);
}

// 标签新增
export function fetchAddLabel(data: Record<string, any>) {
  return $http.post('/inventory/web/tag/insert', data);
}

// 标签编辑
export function fetchEditLabel(data: Record<string, any>) {
  return $http.post('/inventory/web/tag/update', data);
}

// 标签删除
export function fetchDelLabel(id: string) {
  return $http.get(`/inventory/web/tag/deleteById?id=${id}`);
}
