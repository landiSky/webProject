import $http from '@/utils/http';

// 商品打标
export function fetchLabel(params: Record<string, any>) {
  return $http.get('/inventory/web/tag/tree', {
    params,
  });
}

// 打标确定
export function comfirmLabel(data: Record<string, any>) {
  return $http.post('/inventory/web/product/tag', data);
}
