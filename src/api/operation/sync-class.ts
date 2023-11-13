import $http from '@/utils/http';

// 分类列表
export function classList() {
  return $http.get('/inventory/web/type/tree');
}

// 新增分类
export function addClass(data: any) {
  return $http.post('/inventory/web/type/insert', data);
}

// 编辑分类
export function updateClass(data: any) {
  return $http.post('/inventory/web/type/update', data);
}

// 删除分类
export function delClass(id: number) {
  return $http.post(`/inventory/web/type/deleteById?id=${id}`);
}

// 拖拽分类
export function dragClass(data: any) {
  return $http.post(`/inventory/web/type/dragSave`, data);
}

// 商品列表
export function goodsList(data: any) {
  return $http.post('/inventory/web/product/selectPageList', data);
}

// 详情
export function goodsDetail(id: number) {
  return $http.get(`/inventory/web/product/selectById?id=${id}`);
}

// 开始同步
export function startSync(id: number) {
  return $http.post(`/inventory/web/product/startSynchronizationById?id=${id}`);
}

// 停止同步
export function stopSync(id: number) {
  return $http.post(`/inventory/web/product/stopSynchronizationById?id=${id}`);
}
