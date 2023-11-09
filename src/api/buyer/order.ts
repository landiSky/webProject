import $http from '@/utils/http';

//  获取企业下成员列表
export function orderList(data: Record<string, any>) {
  return $http.post('/web/order/page/customer', data);
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
export function apiAuthMember(data: Record<string, any>) {
  return $http.post('/web/product/appConfig', data);
}
// 文件上传
export function fileUpload(data: Record<string, any>) {
  return $http.post('/web/file/orderUpload', data);
}

//  文件下载
export function fileDownload(params: Record<string, any>) {
  return $http.get('/web/file/orderDownload', {
    params,
    // customFields: {
    //     // @ts-ignore
    //     returnRawResponse: true // 业务方直接处理原始 response
    // }
  });
}

// 创建订单
export function apiCreateOrder(data: Record<string, any>) {
  return $http.post('/web/order/create', data);
}
