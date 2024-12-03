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

// 验证部门下是否有成员
export function hasDeptMemeber(params: Record<string, any>) {
  return $http.get('/server/web/dept/checkStatus', { params });
}

// 删除部门
export function delDept(data: Record<string, any>) {
  return $http.post(`/server/web/dept/removeById?deptId=${data.deptId}`);
}
