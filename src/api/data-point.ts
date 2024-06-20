import $http from '@/utils/http';

// 埋点接口
export function apiDataPoint(
  productId?: string | null,
  searchWord?: string | null,
  userId?: string | null,
  source?: number,
  target?: number
) {
  console.log('usrid==', userId);
  return $http.post('/operation/web/datapoint/save', {
    productId,
    searchWord,
    userId,
    source,
    target,
  });
}
