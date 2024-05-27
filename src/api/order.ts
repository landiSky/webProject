import $http from '@/utils/http';

// 获取订单详情评价
export function getOrderDetailEstimate(params: Record<string, any>) {
  return $http.get('/server/web/product/evaluate/info', { params });
}
