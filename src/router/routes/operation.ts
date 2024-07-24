export const PAGE_LAYOUT = () => import('@/layout/home/layout.vue');
export const DECORATION_LAYOUT = () =>
  import('@/layout/decoration/decoration-layout.vue');
const operationRoutesList = [
  {
    path: '/goods',
    component: PAGE_LAYOUT,
    redirect: '/goods/manage',
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
      // {
      //   path: '/license',
      //   component: PAGE_LAYOUT,
      //   redirect: '/license/index',
      //   children: [
      //     {
      //       path: '/license/index',
      //       name: 'licenseIndex',
      //       component: () => import('@/views/home/license/index.vue'),
      //       meta: {
      //         name: 'index',
      //         hideInMenu: true,
      //       },
      //     },
      //     {
      //       path: '/license/addlicensedetail',
      //       name: 'AddLicenseDetail',
      //       component: () =>
      //         import('@/views/home/license/components/addLicenseDetail.vue'),
      //       meta: {
      //         hideInMenu: true,
      //         parentPath: '/license/index',
      //       },
      //     },
      //     {
      //       path: '/license/admin/reviewdetails',
      //       name: 'licenseAdminReviewDetails',
      //       component: () =>
      //         import('@/views/home/license/components/reviewerDetail.vue'),
      //       meta: {
      //         hideInMenu: true,
      //         parentPath: '/license/index',
      //       },
      //     },
      //   ],
      //   meta: {
      //     name: 'License管理',
      //   },
      // },
      {
        path: '/sync/license',
        name: 'syncLicenseManage',
        component: () => import('@/views/home/license/index.vue'),
        meta: {
          name: 'License管理',
          keepAlive: true, // 从列表页进入详情页，再从详情页返回列表页，列表页要保存状态时使用
          hideInMenu: false,
        },
      },
      {
        path: '/sync/license/addlicensedetail',
        name: 'AddLicenseDetail',
        component: () =>
          import('@/views/home/license/components/addLicenseDetail.vue'),
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: '/sync/license/admin/reviewdetails',
        name: 'licenseAdminReviewDetails',
        component: () =>
          import('@/views/home/license/components/reviewerDetail.vue'),
        meta: {
          hideInMenu: true,
        },
      },
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
      {
        path: '/sync/label/manage',
        name: 'syncLabelManage',
        component: () => import('@/views/operation/sync/labelManage/index.vue'),
        meta: {
          name: '标签管理',
          keepAlive: true,
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '清单管理',
      hideInMenu: false,
    },
  },
  {
    path: '/decoration',
    component: PAGE_LAYOUT,
    children: [
      {
        path: '/decoration/base',
        name: 'baseSettings',
        component: () => import('@/views/decoration/index.vue'),
        meta: {
          name: '基础信息配置',
          keepAlive: true,
          hideInMenu: false,
        },
      },
      {
        path: '/decoration/channel',
        name: 'channelSettings',
        component: () => import('@/views/decoration/channel.vue'),
        meta: {
          name: '频道页面配置',
          keepAlive: true,
          hideInMenu: false,
        },
      },
      {
        path: '/decoration/tools',
        name: 'decorationTools',
        component: () => import('@/views/decoration/decorationTools/index.vue'),
        meta: {
          name: '装修页',
          keepAlive: true,
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '平台装修',
      hideInMenu: false,
    },
  },
  {
    path: '/decoration-tools',
    component: DECORATION_LAYOUT,
    children: [
      {
        path: '/decoration-tools/index',
        name: 'decorationTools',
        component: () => import('@/views/decoration/decorationTools/index.vue'),
        meta: {
          name: '装修页',
          keepAlive: true,
          hideInMenu: false,
        },
      },
    ],
    meta: {
      name: '平台装修页',
      hideInMenu: true,
    },
  },
];

export default operationRoutesList;
