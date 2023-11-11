import $http from '@/utils/http';

// 卖家列表
export function orderList(data: Record<string, any>) {
  return $http.post('/web/order/page/merchant', data);
}
// {
//   // @ts-ignore
//   returnRawResponse: true, // 业务方直接处理原始 response
//   },
// 订单状态数量统计
export function orderNum(params: Record<string, any>) {
  return $http.get('/web/order/dataStatistics', { params });
}

// 服务商交付
export function merchantSub(data: Record<string, any>) {
  return $http.post('/web/order/merchant-confirm', data);
}
// 修改金额
export function amountUpdata(data: Record<string, any>) {
  return $http.post('/web/order/update/price', data);
}
// 卖家订单详情
export function sellerDetail(params: Record<string, any>) {
  return $http.get('/web/order/detail', { params });
}
// 卖家订单 驳回
export function sellerTurndown(data: Record<string, any>) {
  return $http.post('/web/order/voucher/reject', data);
}
// 卖家订单 通过
export function sellerPass(data: Record<string, any>) {
  return $http.post('/web/order/voucher/approve', data);
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
