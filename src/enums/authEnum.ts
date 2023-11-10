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
  // '/seller/dataoverview': 'ROUTE_SYSTEM_DATAOVERVIEW', // 企业管理-角色
};

export const RouteAuthEnum = { ...BaseRouteAuth };
