import $http from '@/utils/http';

// 认证状态
export function authentication(params: Record<string, any>) {
  return $http.get('/web/company/getStatus', {
    params,
  });
}

//  认证详情
export function authDetails(params: Record<string, any>) {
  return $http.get('/web/company/info', { params });
}
// 根据社会信用代码判断是否重复
export function authRepeat(params: Record<string, any>) {
  return $http.get('/web/company/getByCreditCode', {
    params,
    customFields: {
      returnRawResponse: true, // 业务方直接处理原始 response
    },
  });
}
//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
export function authSubmit(data: Record<string, any>) {
  return $http.post('/web/company/saveOrUpdate', data);
}

// 认证前去判断是否有重复企业
export function apiHasCompany(data: Record<string, any>) {
  return $http.post('/web/company/getCompanyById', data);
}
