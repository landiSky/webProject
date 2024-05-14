import $http from '@/utils/http';

// 商品打标
export function fetchLabel(params: Record<string, any>) {
  return $http.get('/inventory/web/tag/tree', {
    params,
  });
}

// 获取已打标的标签
export function getLabel(data: Record<string, any>) {
  return $http.get(`/inventory/web/product/tag?roleId=${data.roleId}`);
}

// 打标确定
export function comfirmLabel(data: Record<string, any>) {
  return $http.post('/inventory/web/product/tag', data);
}
