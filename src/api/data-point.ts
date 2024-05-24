import $http from '@/utils/http';

// 埋点接口
export function apiDataPoint(
  productId?: string | null,
  searchWord?: string | null,
  source?: number,
  target?: number
) {
  return $http.post('/operation/web/datapoint/save', {
    productId,
    searchWord,
    source,
    target,
  });
}
