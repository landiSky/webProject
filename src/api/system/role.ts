import $http from '@/utils/http';

// 角色
export function rolelist(data: Record<string, any>) {
  return $http.post('/web/role/list', data);
}

//  角色树结构
export function apiMemberlist(params: Record<string, any>) {
  return $http.get('/web/menu/tree', { params });
}
// 添加角色
export function apiRoleAdd(data: Record<string, any>) {
  return $http.post('/web/role/saveOrUpdate', data);
}
// 删除角色
export function apiRoleDelete(data: Record<string, any>) {
  return $http.post(`/web/role/removeById?roleId=${data.roleId}`, data, {
    customFields: {
      // @ts-ignore
      returnRawResponse: true, // 业务方直接处理原始 response
    },
  });
}

// // 编辑角色
export function apiRoleUpdate(data: Record<string, any>) {
  return $http.post('/web/role/changeMenu', data);
}
// 查看角色详情
export function apiRoleDetails(params: Record<string, any>) {
  return $http.get('/web/role/info', { params });
}
