export const PAGE_LAYOUT = () => import('@/layout/home/layout.vue');

const homeRoutesList = [
  //   {
  //     path: '/home',
  //     component: PAGE_LAYOUT,
  //     redirect: '/home/index',
  //     children: [
  //       {
  //         path: '/home/index',
  //         name: 'home',
  //         component: () => import('@/views/home/index.vue'),
  //         meta: {
  //           name: 'index',
  //           hideInMenu: false,
  //         },
  //       },
  //     ],
  //     meta: {
  //       name: '首页',
  //       hideInMenu: false,
  //     },
  //   },
  {
    path: '/buyer',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/buyer/index',
        name: 'buyerIndex',
        component: () => import('@/views/home/buyer/index/index.vue'),
        meta: {
          name: '概览',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
        },
      },
      {
        path: '/buyer/order',
        name: 'buyerOrder',
        component: () => import('@/views/home/buyer/order/index.vue'),
        meta: {
          name: '订单管理',
        },
      },
    ],
    meta: {
      name: '买家中心',
    },
  },
  {
    path: '/seller',
    component: PAGE_LAYOUT,
    children: [
      // {
      //   path: '/seller/dataoverview',
      //   name: 'sellerDataoverview',
      //   component: () => import('@/views/home/seller/dataoverview/index.vue'),
      //   meta: {
      //     name: '数据概览',
      //   },
      // },

      {
        path: '/seller/goods',
        name: 'sellerGoods',
        component: () => import('@/views/home/seller/goods/index.xz.vue'),
        meta: {
          name: '商品管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
        },
      },
      {
        path: '/seller/order',
        name: 'sellerOrder',
        component: () => import('@/views/home/seller/order/index.vue'),
        meta: {
          name: '订单管理',
        },
      },
    ],
    meta: {
      name: '服务商中心',
    },
  },
  {
    path: '/system',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/system/users',
        name: 'systemUsers',
        component: () => import('@/views/home/system/users/index.vue'),
        meta: {
          name: '企业成员管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
        },
      },
      {
        path: '/system/roles',
        name: 'systemRoles',
        component: () => import('@/views/home/system/roles/index.vue'),
        meta: {
          name: '企业角色管理',
        },
      },
    ],
    meta: {
      name: '企业管理',
    },
  },
];

export default homeRoutesList;
