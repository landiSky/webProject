import $http from '@/utils/http';

// 商品分类
export function classList() {
  return $http.get('/web/product/type/tree');
}
