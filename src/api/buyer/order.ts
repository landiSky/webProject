import $http from '@/utils/http';

//
export function orderList(data: Record<string, any>) {
  return $http.post('/server/web/order/page/customer', data);
}
// {
//   // @ts-ignore
//   returnRawResponse: true, // 业务方直接处理原始 response
//   },
// 订单状态数量统计
export function orderNum(params: Record<string, any>) {
  return $http.get('/server/web/order/dataStatistics', { params });
}

// 凭证提交
export function submitImg(data: Record<string, any>) {
  return $http.post('/server/web/order/voucher/submit', data);
}
// 买家交付
export function buyerDeployed(data: Record<string, any>) {
  return $http.post('/server/web/order/confirm-deployed', data);
}
// 买家订单详情
export function buyerOrderDetail(params: Record<string, any>) {
  return $http.get('/server/web/order/detail', { params });
}
// 文件上传
export function fileUpload(data: Record<string, any>) {
  return $http.post('/server/web/file/orderUpload', data);
}

//  文件下载
export function fileDownload(params: Record<string, any>) {
  return $http.get('/server/web/file/orderDownload', {
    params,
    // customFields: {
    //     // @ts-ignore
    //     returnRawResponse: true // 业务方直接处理原始 response
    // }
  });
}

// 创建订单
export function apiCreateOrder(data: Record<string, any>) {
  return $http.post('/server/web/order/create', data);
}

// 订单新建时判断轻应用是否需要重新安装
export function apiReInstall(data: Record<string, any>) {
  return $http.post('/server/web/order/reInstall', data);
}

// 购买套餐-保存套餐成员关联
export function apiSaveServicePackageUser(data: Record<string, any>) {
  return $http.post('/server/web/qingFlow/saveServicePackageUser', data);
}

// 获取套餐成员
export function getServicePackageMember(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/getServicePackageMember', { params });
}

// 修改套餐成员
export function apiEditServicePackageMember(data: Record<string, any>) {
  return $http.post('/server/web/qingFlow/editServicePackageMember', data);
}
