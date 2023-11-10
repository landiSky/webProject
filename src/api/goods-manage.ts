import $http from '@/utils/http';

// 商品列表
export function goodsList(data: any) {
  return $http.post('/web/product/selectPageList', data);
}

// 详情
export function goodsDetail(id: number) {
  return $http.get(`/web/product/selectById?id=${id}`);
}

// 商品ID
export function genGoodsId() {
  return $http.get('/web/product/getProductId');
}

// 商品分类
export function fetchClassList() {
  return $http.get('/web/product/type/tree');
}

// 上传文件
export function uploadFile(data: any) {
  return $http.post('/web/file/upload', data);
}

// 下载文件
export function downloadFile(params: any) {
  console.log(params);
  return $http.get('/web/file/download', { params });
}

// 上架
export function upGoods(id: number) {
  return $http.post(`/web/product/upShelfById?id=${id}`);
}

// 下架
export function downGoods(id: number) {
  return $http.post(`/web/product/downShelfById?id=${id}`);
}

// 保存1
export function saveGoods1(data: any) {
  return $http.post(`/web/product/insert`, data);
}

// 保存2
export function saveGoods2(data: any) {
  return $http.post(`/web/product/delivery/save`, data);
}

// 保存并上架
export function saveAndUp(data: any) {
  return $http.post(`/web/product/delivery/upShelf`, data);
}

// 删除
export function deleteGoods(id: any) {
  return $http.post(`/web/product/deleteById?id=${id}`);
}

// 上架检查
export function preUp(id: any) {
  return $http.post(`/web/product/upShelfCheck?id=${id}`);
}
