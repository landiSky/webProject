export const PAGE_LAYOUT = () => import('@/layout/home/layout.vue');

const operationRoutesList = [
  {
    path: '/goods',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/goods/manage',
        name: 'goodsManage',
        component: () => import('@/views/operation/goods/manage/index.vue'),
        meta: {
          name: '商品管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
      {
        path: '/goods/observe',
        name: 'goodsObserve',
        component: () => import('@/views/operation/goods/observe/index.vue'),
        meta: {
          name: '商品订阅',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '商品管理与订阅',
      hideInMenu: false,
    },
  },
  {
    path: '/user',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/user/verify',
        name: 'userVerify',
        component: () => import('@/views/operation/user/verify/index.vue'),
        meta: {
          name: '认证管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
      {
        path: '/user/verify/detail',
        name: 'verify-detail',
        component: () => import('@/views/operation/user/verify/detail.vue'),
        meta: {
          hideInMenu: true,
          parentPath: '/user/verify',
        },
      },
    ],
    meta: {
      name: '用户管理',
      hideInMenu: false,
    },
  },
  {
    path: '/sync',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/sync/class',
        name: 'classManage',
        component: () => import('@/views/operation/sync/class/index.vue'),
        meta: {
          name: '商品分类管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
      {
        path: '/sync/goods',
        name: 'syncGoodsManage',
        component: () => import('@/views/operation/sync/goods/index.vue'),
        meta: {
          name: '商品管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '清单管理',
      hideInMenu: false,
    },
  },
];

export default operationRoutesList;
