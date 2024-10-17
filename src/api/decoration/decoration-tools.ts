import $http from '@/utils/http';

// 导航栏数据接口
export function apiGetNavData(params: Record<string, any>) {
  return $http.get('/operation/web/renovation/selectList', { params });
}

// 导航logo修改接口
export function apiNavLogoUpdate(data: Record<string, any>) {
  return $http.post('/operation/web/system/config/update', data);
}

// 导航logo列表接口
export function apiNavLogoList() {
  return $http.get('/operation/web/system/config/selectList');
}

// 更新导航栏数据接口
export function apiUpdateNavData(data: Record<string, any>) {
  return $http.post('/operation/web/renovation/update', data);
}

// 获取所有产品列表数据
export function apiGetProductList() {
  return $http.get('/server/web/product/selectProductList');
}

// 获取用户是否是第一次使用装修功能
export function apiGetIsFirstUseDecoration() {
  return $http.get('/server/web/user/getRenovationStatusByUserId');
}

// 频道页排序接口
export function apiChangeSort(data: Record<string, any>) {
  return $http.post('/operation/web/renovation/changeSort', data);
}

// 频道页修改接口
export function apiChannelUpdate(data: Record<string, any>) {
  return $http.post('/operation/web/renovation/update', data);
}

// 频道页新增接口
export function apiChannelAdd(data: Record<string, any>) {
  return $http.post('/operation/web/renovation/insert', data);
}

// 频道页删除接口
export function apiChannelDel(id: string) {
  return $http.get(`/operation/web/renovation/delete?id=${id}`);
}

// Footer-更新
export function apiFooterUpdate(data: Record<string, any>) {
  return $http.post('/operation/web/footer/update', data);
}

// Footer-详情页
export function apiFooterInfo() {
  return $http.get('/operation/web/footer/info');
}

// 下载文件
export function downloadFile(params: any) {
  return $http.get('/server/web/file/download', {
    params,
  });
}
