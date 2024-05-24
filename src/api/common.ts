import $http from '@/utils/http';

// 获取商品类型接口  一二级树结构
export function apiProductType() {
  return $http.get('/server/web/product/type/tree');
}

// 前台标签筛选配置
export function apiTagList() {
  return $http.get('/server/web/reception/tagList');
}

//  获取企业下成员列表
export function apiMemberList(params: Record<string, any>) {
  return $http.get('/server/web/member/getCompanyMember', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(data: Record<string, any>) {
  return $http.post('/server/web/product/member/selectConfig', data);
}

//  获取自建应用详情拿取成员信息回显展示
export function apiSelectById(params: Record<string, any>) {
  return $http.get('/server/web/app/info/selectById', { params });
}

//  自建应用修改信息-概览页
export function apiUpdateOrLineStatus(data: Record<string, any>) {
  return $http.post('/server/web/app/info/updateOrLineStatus', data);
}

// 给应用授权可查看的成员
export function apiAuthMember(data: Record<string, any>) {
  return $http.post('/server/web/product/member/saveConfig', data);
}
