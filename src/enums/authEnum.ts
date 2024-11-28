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
  '/system/frame': 'ROUTE_SYSTEM_FRAME', // 企业管理-架构
  '/devCenter': 'ROUTE_SYSTEM_DEVELOPER', // 开发者中心
  '/devCenter/manage': 'ROUTE_SYSTEM_APP', // 开发者中心-应用接入管理

  '/license': 'ROUTE_LICENSE', // 标识服务-License管理
  '/overview': 'ROUTE_OVERVIEW', // 标识服务-概览页
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

  '/decoration': 'ROUTE_DECORATION', // 平台装修
  '/decoration/base': 'ROUTE_DECORATION_BASE', // 基本信息配置
  '/decoration/channel': 'ROUTE_DECORATION_CHANNEL', // 频道装修配置

  '/decoration-tools': 'ROUTE_DECORATION_TOOLS', // 装修工具页
  '/decoration-tools/index': 'ROUTE_DECORATION_TOOLS_INDEX', // 首页装修工具
  '/decoration/footer': 'ROUTE_DECORATION_FOOTERCONFIG', // footer信息配置
  '/sync/license': 'ROUTE_SYNC_LICENSE', // 标识服务-License管理
  '/useragreement': 'ROUTE_USERAGREEMENT', // 用户协议配置
};
export const RouteAuthEnum = { ...BaseRouteAuth, ...operationAuth } as Record<
  string,
  any
>;
