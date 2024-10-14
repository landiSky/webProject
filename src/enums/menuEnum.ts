export const usermenuList = [
  [
    'ROUTE_BUYER',
    'ROUTE_BUYER_ORDER', // 买家中心-订单
    'ROUTE_BUYER_INDEX', // 买家中心-概览

    'ROUTE_SELLER',
    'ROUTE_SELLER_GOODS', // 服务商中心-商品
    'ROUTE_SELLER_ORDER', // 服务商中心-订单

    'ROUTE_SYSTEM',
    'ROUTE_SYSTEM_USERS', // 企业管理-用户
    'ROUTE_SYSTEM_ROLES', // 企业管理-角色
    'ROUTE_SYSTEM_DEVELOPER', // 开发者中心
    'ROUTE_SYSTEM_APP', // 开发者中心-应用接入管理
  ],
  [
    'ROUTE_OVERVIEW', // 标识服务-概览页
    'ROUTE_LICENSE', // 标识服务-License管理
  ],
];

export const managemenuList = [
  [
    'ROUTE_GOODS', // 商品管理与订阅
    'ROUTE_GOODS_MANAGE', // 商品管理
    'ROUTE_GOODS_OBSERVE', // 商品订阅

    'ROUTE_USER', // 用户管理
    'ROUTE_USER_VERIFY', // 认证管理
    'ROUTE_SYNC', // 清单管理
    'ROUTE_SYNC_CLASS', // 商品分类管理
    'ROUTE_SYNC_GOODS', // 商品管理
    'ROUTE_SYNC_LABEL', // 标签管理
    'ROUTE_SYNC_LICENSE', // 标识服务-License管理
    'ROUTE_DECORATION',
    'ROUTE_DECORATION_BASE',
    'ROUTE_DECORATION_CHANNEL',
    'ROUTE_DECORATION_TOOLS',
    'ROUTE_DECORATION_TOOLS_INDEX',
    'ROUTE_DECORATION_FOOTERCONFIG',
    'ROUTE_USERAGREEMENT',
  ],
];
export const userMenu = (num: number) => {
  return usermenuList[num - 1];
};

export const manageMenu = (num: number) => {
  return managemenuList[num - 1];
};
