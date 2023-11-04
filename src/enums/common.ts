export const DeliverType = {
  SAAS: 0,
  DEPLOY: 1,
};

export const DeliverTypeDesc = {
  [DeliverType.SAAS]: 'SaaS',
  [DeliverType.DEPLOY]: '独立部署',
};

export const SaleType = {
  PACKAGE: 0, // 套餐
  ONEOFF: 1, // 一口价
  CONSULT: 2, // 面议
};
