import $http from '@/utils/http';

// 角色列表
export function apiRolePage(params: any) {
  return $http.get('/api/v1/role/page', {
    params,
  });
}

// 添加角色
export function apiRoleAdd(data: any) {
  return $http.post('/api/v1/role/add', {
    data,
  });
}

// 编辑角色
export function apiRoleUpdate(data: any) {
  return $http.put('/api/v1/role/update', {
    data,
  });
}

// 角色启用、停用
export function apiRoleChangeState(data: any) {
  return $http.put('/api/v1/role/change-state', {
    data,
  });
}

// 删除角色
export function apiRoleDelete(id: number) {
  return $http.delete(`/api/v1/role/delete?id=${id}`);
}
