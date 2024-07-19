import $http from '@/utils/http';

// 分类列表
export function classList() {
  return $http.get('/operation/web/product/type/tree');
}

// 订阅列表
export function observeList() {
  return $http.get('/operation/web/subscribe/tree');
}

// 修改订阅
export function changeObserve(data: any) {
  return $http.post('/operation/web/subscribe/update', data);
}

// 商品列表
export function goodsList(data: any) {
  return $http.post('/operation/web/product/selectPageList', data);
}

// 删除商品
export function deleteGoods(id: number) {
  return $http.post(`/operation/web/product/deleteById?id=${id}`);
}

// 上架
export function upGoods(id: number) {
  return $http.post(`/operation/web/product/upShelfById?id=${id}`);
}

// 下架
export function downGoods(id: number) {
  return $http.post(`/operation/web/product/downShelfById?id=${id}`);
}

// 详情
export function goodsDetail(id: number) {
  return $http.get(`/server/web/product/selectById?id=${id}`);
}

// 审核
export function verifyGoods(data: any) {
  return $http.post(`/operation/web/product/verify`, data);
}
