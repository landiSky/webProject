import $http from '@/utils/http';

// 获取商品列表
export function apiProductList(params: Record<string, any>) {
  return $http.get('/web/reception/selectReceptionPageList', {
    params,
  });
}

// // 编辑用户信息
// export function apiAccountUpdate(data: Record<string, any>) {
//   return $http.post('/api/v1/account/update', data);
// }
