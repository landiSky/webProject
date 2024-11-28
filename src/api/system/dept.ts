import $http from '@/utils/http';

// 部门树
export function deptList(params: Record<string, any>) {
  return $http.get('/server/web/dept/tree', { params });
}

// 新增/修改部门
export function updateDept(data: Record<string, any>) {
  return $http.post('/server/web/dept/saveOrUpdate', data);
}
