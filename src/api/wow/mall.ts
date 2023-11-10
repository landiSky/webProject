import $http from '@/utils/http';

// 获取商品列表
export function apiProductList(data: Record<string, any>) {
  return $http.post('/web/reception/selectReceptionPageList', data);
}

// 获取商品详情页
export function apiProductDetail(params: Record<string, any>) {
  return $http.get('/web/reception/selectById', {
    params,
  });
}

// 计算商品组合价格
export function apiComputePrice(data: Record<string, any>) {
  return $http.post('/web/reception/computePrice', data);
}
