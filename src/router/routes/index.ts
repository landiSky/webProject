export const PAGE_LAYOUT = () => import('@/layout/page-layout.vue');

const routes = [
  {
    path: '/home',
    component: PAGE_LAYOUT,
    redirect: '/home/index',
    children: [
      {
        path: '/home/index',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          name: 'index',
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '首页',
      hideInMenu: false,
    },
  },
  // {
  //   path: '/buyer',
  //   component: PAGE_LAYOUT,
  //   redirect: '/buyer/overview/index',
  //   children: [
  //     {
  //       path: '/buyer/overview/index',
  //       name: 'buyer',
  //       component: () => import('@/views/buyer/overview/index.vue'),
  //       meta: {
  //         name: 'index',
  //         hideInMenu: false,
  //       },
  //     },
  //   ],
  //   meta: {
  //     name: '买家中心',
  //     hideInMenu: false,
  //   },
  // },
  {
    path: '/organization',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/organization/user',
        name: 'user',
        component: () => import('@/views/organization/user-depart/index.vue'),
        meta: {
          name: '用户与部门',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
        },
      },

      {
        path: '/organization/role',
        name: 'role',
        component: () => import('@/views/organization/role/index.vue'),
        meta: {
          name: '角色管理',
        },
      },

      {
        path: '/organization/user/:id',
        name: 'user-detail',
        component: () =>
          import('@/views/organization/user-depart/detail/index.vue'),
        meta: {
          hideInMenu: true,
          parentPath: '/organization/user',
        },
      },
    ],
    meta: {
      name: '系统管理',
    },
  },
];

export default [...routes];
