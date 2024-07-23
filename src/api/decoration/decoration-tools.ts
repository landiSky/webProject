import $http from '@/utils/http';

// 导航栏数据接口
export function apiGetNavData(params: Record<string, any>) {
  return $http.get('/operation/web/renovation/selectList', { params });
}

// 更新导航栏数据接口
export function apiUpdateNavData(data: Record<string, any>) {
  return $http.post('/operation/web/renovation/update', data);
}

// 获取所有产品列表数据
export function apiGetProductList() {
  return $http.get('/server/web/product/selectProductList');
}
