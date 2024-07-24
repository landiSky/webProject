export const PAGE_LAYOUT = () => import('@/layout/home/layout.vue');
export const PAGE_LAYOUT_NOMENU = () =>
  import('@/layout/home/layoutNoMenu.vue'); // 不需要左侧 menu 的页面布局

const homeRoutesList = [
  {
    path: '/buyer',
    component: PAGE_LAYOUT,
    redirect: '/buyer/index',
    children: [
      {
        path: '/buyer/index',
        name: 'buyerIndex',
        component: () => import('@/views/home/buyer/index/index.vue'),
        meta: {
          name: '概览',
          // noAuth: true,
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
      // noAuth: true,
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
        component: () => import('@/views/home/seller/goods/index.vue'),
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
  {
    path: '/devCenter',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/devCenter/manage',
        name: 'devManage',
        component: () => import('@/views/home/devCenter/manage/index.vue'),
        meta: {
          name: '应用接入管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
        },
      },
    ],
    meta: {
      name: '开发者中心',
    },
  },
  {
    path: '/order',
    component: PAGE_LAYOUT_NOMENU,
    children: [
      {
        path: '/order/confirm',
        name: 'orderConfirm',
        component: () => import('@/views/home/buyer/confirmOrder/index.vue'),
        meta: {},
      },
      {
        path: '/order/detail/:id',
        name: 'buyerOrderDetail',
        component: () => import('@/views/home/buyer/order/detail/index.vue'),
        meta: {
          name: '订单详情',
        },
      },
    ],
    meta: {
      name: '订单确认页',
    },
  },
  {
    path: '/license',
    component: PAGE_LAYOUT,
    redirect: '/license/index',
    children: [
      {
        path: '/license/index',
        name: 'licenseIndex',
        component: () => import('@/views/home/license/index.vue'),
        meta: {
          name: 'index',
          hideInMenu: true,
        },
      },
    ],
    meta: {
      name: 'License管理',
    },
  },
  {
    path: '/overview',
    component: PAGE_LAYOUT,
    redirect: '/overview/index',
    children: [
      {
        path: '/overview/index',
        name: 'overviewIndex',
        component: () => import('@/views/home/overview/index.vue'),
        meta: {
          name: 'index',
          hideInMenu: true,
        },
      },
    ],
    meta: {
      name: '二级节点业务管理系统',
    },
  },
];

export default homeRoutesList;
