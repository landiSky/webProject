import $http from '@/utils/http';

// 普通用户概览页查询
export function userLicensePreview(params: Record<string, any>) {
  return $http.get('/server/web/license/preview', params);
}

// 买家中心 已购应用前往
export function alreadyBuyClientLogin(params: Record<string, any>) {
  return $http.get('/auth/alreadyBuyClientLogin', {
    params,
    customFields: {
      returnRawData: true,
    },
  });
}

// 获取商品详情页
export function apiProductDetail(params: Record<string, any>) {
  return $http.get('/server/web/reception/selectById', {
    params,
  });
}
// 计算商品组合价格
export function apiComputePrice(data: Record<string, any>) {
  return $http.post('/server/web/reception/computePrice', data);
}
