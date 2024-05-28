const BaseRouteAuth: { [name: string]: any } = {
  '/buyer': 'ROUTE_BUYER',
  '/buyer/order': 'ROUTE_BUYER_ORDER', // 买家中心-订单
  '/buyer/index': 'ROUTE_BUYER_INDEX', // 买家中心-概览

  '/seller': 'ROUTE_SELLER',
  '/seller/goods': 'ROUTE_SELLER_GOODS', // 服务商中心-商品
  '/seller/order': 'ROUTE_SELLER_ORDER', // 服务商中心-订单

  '/system': 'ROUTE_SYSTEM',
  '/system/users': 'ROUTE_SYSTEM_USERS', // 企业管理-用户
  '/system/roles': 'ROUTE_SYSTEM_ROLES', // 企业管理-角色
  '/devCenter': 'ROUTE_SYSTEM_DEVELOPER', // 开发者中心
  '/devCenter/manage': 'ROUTE_SYSTEM_APP', // 开发者中心-应用接入管理
  // '/seller/dataoverview': 'ROUTE_SYSTEM_DATAOVERVIEW', // 企业管理-角色
};

// 运营后台的菜单
const operationAuth = {
  '/goods': 'ROUTE_GOODS', // 商品管理与订阅
  '/goods/manage': 'ROUTE_GOODS_MANAGE', // 商品管理
  '/goods/observe': 'ROUTE_GOODS_OBSERVE', // 商品订阅

  '/user': 'ROUTE_USER', // 用户管理
  '/user/verify': 'ROUTE_USER_VERIFY', // 认证管理

  '/sync': 'ROUTE_SYNC', // 清单管理
  '/sync/class': 'ROUTE_SYNC_CLASS', // 商品分类管理
  '/sync/goods': 'ROUTE_SYNC_GOODS', // 商品管理
  '/sync/label/manage': 'ROUTE_SYNC_LABEL', // 标签管理
};
export const RouteAuthEnum = { ...BaseRouteAuth, ...operationAuth } as Record<
  string,
  any
>;
