import $http from '@/utils/http';

// 部门树
export function deptTreeData(params: Record<string, any>) {
  return $http.get('/server/web/dept/tree', { params });
}

// 新增/修改部门
export function updateDept(data: Record<string, any>) {
  return $http.post('/server/web/dept/saveOrUpdate', data);
}

// 部门详情
export function deptInfo(params: Record<string, any>) {
  return $http.get('/server/web/dept/info', { params });
}
