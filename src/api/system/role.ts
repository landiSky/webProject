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
//  获取企业下某个应用下有权限的成员列表
// export function apiMemListByProduct(params: Record<string, any>) {
//   return $http.get('/web/product/selectConfig', { params });
// }

// 给应用授权可查看的成员
// export function apiAuthMember(data: Record<string, any>) {
//   return $http.post('/web/product/appConfig', data);
// }

// // 角色启用、停用
// export function apiRoleChangeState(data: any) {
//   return $http.put('/api/v1/role/change-state', {
//     data,
//   });
// }
