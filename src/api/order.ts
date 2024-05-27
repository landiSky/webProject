import $http from '@/utils/http';

// 获取订单详情评价
export function getOrderDetailEstimate(params: Record<string, any>) {
  return $http.get('/server/web/product/evaluate/info', { params });
}

// 订单评价
export function orderEvaluate(params: Record<string, any>) {
  return $http.post('/server/web/product/evaluate/add', params);
}
