import $http from '@/utils/http';

// 获取商品列表
export function apiProductList(params: Record<string, any>) {
  return $http.get('/web/reception/selectReceptionPageList', {
    params,
  });
}

// 获取商品详情页
export function apiProductDetail(params: Record<string, any>) {
  return $http.get('/web/reception/selectById', {
    params,
  });
}

// 计算商品组合价格
export function apiComputePrice(params: Record<string, any>) {
  return $http.get('/web/reception/computePrice', {
    params,
  });
}
