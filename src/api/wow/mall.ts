import $http from '@/utils/http';

// 获取商品列表
export function apiProductList(data: Record<string, any>) {
  return $http.post('/server/web/reception/selectReceptionPageList', data);
}

// 获取商品详情页
export function apiProductDetail(params: Record<string, any>) {
  return $http.get('/server/web/reception/selectById', {
    params,
  });
}

// 计算商品组合价格
export function apiComputePrice(data: Record<string, any>) {
  return $http.post('/server/web/reception/computePrice', data);
}

// 获取商品列表
export function apiBypageList(data: Record<string, any>) {
  return $http.post('/server/web/product/evaluate/listByPage', data);
}
