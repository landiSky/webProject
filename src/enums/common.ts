export const DeliverType = {
  SAAS: 0,
  DEPLOY: 1,
  PLUGIN: 3,
};

export const DeliverTypeDesc = {
  [DeliverType.SAAS]: 'SaaS',
  [DeliverType.DEPLOY]: '独立部署',
  [DeliverType.PLUGIN]: '插件',
};

export const SaleType = {
  PACKAGE: 0, // 套餐
  ONEOFF: 1, // 一口价
  CONSULT: 2, // 面议
  FREE: 3, // 免费
};

export const AccountType = {
  MAIN: 1,
  MEMBER: 2,
  UNAUTH: 3,
};

export const AccountTypeDesc = {
  [AccountType.MAIN]: '主账号',
  [AccountType.MEMBER]: '子账号',
  [AccountType.UNAUTH]: '未认证',
};
// 企业认证状态
export const CompanyAuthStatus = {
  TO_CHECK: 0,
  AUTHED: 1,
  REJECT: 2,
  UNAUTH: 3,
};

export const CompanyAuthStatusDESC = {
  [CompanyAuthStatus.TO_CHECK]: '待审核',
  [CompanyAuthStatus.AUTHED]: '已认证',
  [CompanyAuthStatus.REJECT]: '已驳回',
  [CompanyAuthStatus.UNAUTH]: '未认证',
};

// 企业节点认证状态
export const NodeAuthStatus = {
  TO_CHECK: 0,
  AUTHED: 1,
  REJECT: 2,
  UNAUTH: 3,
};

export const NodeAuthStatusDESC = {
  [NodeAuthStatus.TO_CHECK]: '待审核',
  [NodeAuthStatus.AUTHED]: '已认证',
  [NodeAuthStatus.REJECT]: '已驳回',
  [NodeAuthStatus.UNAUTH]: '未认证',
};

export const AppType = {
  COMMON: 0, // 普通应用
  IDAPP: 1, // 标识应用
};
// 角色
export const rolestatusled = {
  // 2 普通用户
  ROLESTATUS: 2,
};

export const orderTypes = {
  ORDINARY: 0, // 普通订单
  SPECIAL_SAAS: 1, // 特殊处理订单-saas付费对接轻流
};
