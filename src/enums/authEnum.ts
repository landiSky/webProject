const BaseRouteAuth: { [name: string]: any } = {
  '/home': 'ROUTE_HOME', // 首页
  '/organization': 'ROUTE_ORG', // 组织架构
  '/organization/user': 'ROUTE_ORG_USER_DEPT', // 用户与部门
  '/organization/role': 'ROUTE_ORG_ROLE', // 角色管理
  '/organization/hdl-identity': 'ROUTE_ORG_ID', // 标识身份
  '/authority': 'ROUTE_AUTH', // 权限录入
  '/authority/menu': 'ROUTE_AUTH_MENU', // 权限录入-菜单管理
  '/authority/api': 'ROUTE_AUTH_API', // 权限录入-接口管理
  '/authority/auth': 'ROUTE_AUTH_AUTH', // 权限录入-权限管理
};

export const RouteAuthEnum = { ...BaseRouteAuth };

const BaseButtonAuth = {
  /*= =====用户与组织架构======= */
  TAB_ORG_USER: 'TAB_ORG_USER', // 用户管理tab
  TAB_ORG_DEPT: 'TAB_ORG_DEPT', // 部门管理tab
  // 用户管理按钮
  BTN_USER_ADD: 'BTN_USER_ADD', // 新建用户
  BTN_USER_EDIT: 'BTN_USER_EDIT', // 编辑用户
  BTN_USER_CHANGE_DEPT: 'BTN_USER_CHANGE_DEPT', // 变更部门
  BTN_USER_ENABLE: 'BTN_USER_ENABLE', // 启用用户
  BTN_USER_BAT_ENABLE: 'BTN_USER_BAT_ENABLE', // 批量启用用户
  BTN_USER_DISABLE: 'BTN_USER_DISABLE', // 停用用户
  BTN_USER_BAT_DISABLE: 'BTN_USER_BAT_DISABLE', // 批量停用用户
  BTN_USER_DEL: 'BTN_USER_DEL', // 删除用户
  BTN_USER_BAT_DEL: 'BTN_USER_BAT_DEL', // 批量删除用户
  BTN_USER_DETAIL: 'BTN_USER_DETAIL', // 查看用户详情

  /*= =====角色管理======= */
  BTN_ROLE_ADD: 'BTN_ROLE_ADD', // 新增角色
  BTN_ROLE_MEMBER: 'BTN_ROLE_MEMBER', // 成员管理
  BTN_ROLE_AUTH: 'BTN_ROLE_AUTH', // 授权管理
  BTN_ROLE_ENABLE: 'BTN_ROLE_ENABLE', // 启用角色
  BTN_ROLE_DISABLE: 'BTN_ROLE_DISABLE', // 停用角色
  BTN_ROLE_EDIT: 'BTN_ROLE_EDIT', // 编辑角色
  BTN_ROLE_DEL: 'BTN_ROLE_DEL', // 删除角色

  /*= ========个人中心========= */
  PERSONAL_CENTER: 'PERSONAL_CENTER', // 个人中心，目前未挂载任何前端权限
  MY_HDL: 'MY_HDL', // 我的标识身份
};

export const ButtonAuthEnum = { ...BaseButtonAuth };
