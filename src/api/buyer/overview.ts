import $http from '@/utils/http';

// 买家中心  订单概览
export function orderOver(params: Record<string, any>) {
  return $http.get('/server/web/order/dataStatistics', { params });
}
// 买家中心 前往
export function orderGo(params: Record<string, any>) {
  return $http.get('/server/web/order/jumpApps', { params });
}
// 买家中心 自建应用前往
export function appInfoClientLogin(params: Record<string, any>) {
  return $http.get('/auth/appInfoClientLogin', {
    params,
    customFields: {
      returnRawData: true,
    },
  });
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

// 已购应用
export function authDialogdata(params: Record<string, any>) {
  return $http.get('/server/web/order/purchasedApps', { params });
}
// 企业自建应用
export function selectSelfApps(params: Record<string, any>) {
  return $http.get('/server/web/app/info/selectSelfApps', { params });
}
// 获取当前公司下用户的信息
export function apiUserProfile(params: Record<string, any>) {
  return $http.get('/server/web/user/profile', { params });
}

// 获取商品类型接口  一二级树结构
export function apiProductType() {
  return $http.get('/server/web/product/type/tree');
}

//  获取企业下成员列表
export function apiMemberList(params: Record<string, any>) {
  return $http.get('/server/web/member/getCompanyMember', { params });
}

//  获取企业下某个应用下有权限的成员列表
export function apiMemListByProduct(params: Record<string, any>) {
  return $http.get('/server/web/product/selectConfig', { params });
}

// 给应用授权可查看的成员
// export function apiAuthMember(data: Record<string, any>) {
//   return $http.post('/server/web/product/appConfig', data);
// }

// 判断成员是否对应用授权
export function apiAuthStatus(data: Record<string, any>) {
  return $http.post('/server/web/product/member/getAuthStatus', data);
}

// 成员对应用授权
export function apiGetAuth(data: Record<string, any>) {
  return $http.post('/server/web/product/member/auth', data);
}

// 获取套餐列表
export function getServicePackage(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/getServicePackage', { params });
}

// 门户跳转
export function dashBoardRedirect(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/dashBoardRedirect', { params });
}

// 应用包跳转
export function appAppPackageRedirect(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/appAppPackageRedirect', { params });
}

// 查询企业的数智化应用列表
export function getCompanyNumeberIntelligence(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/getCompanyNumeberIntelligence', {
    params,
  });
}

// 新增数智化应用
export function saveCompanyNumberIntelligence(data: Record<string, any>) {
  return $http.post('/server/web/qingFlow/saveCompanyNumberIntelligence', data);
}

// 获取轻流门户列表
export function getDashBoardList(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/getDashBoardList', {
    params,
  });
}

// 应用创建跳转
export function appCreateRedirect(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/appCreateRedirect', {
    params,
  });
}

// 判断用户是否被授权
export function userAuthStatus(params: Record<string, any>) {
  return $http.get('/server/web/qingFlow/userAuthStatus', {
    params,
  });
}
