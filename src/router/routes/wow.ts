export const PAGE_LAYOUT = () => import('@/layout/wow/layout.vue');

const wowRoutesList = [
  {
    path: '/wow',
    component: PAGE_LAYOUT,
    redirect: '/wow/index',
    children: [
      {
        path: '/wow/index',
        name: 'wowIndex',
        component: () => import('@/views/wow/index/index.vue'),
        props: (route: any) => ({
          type: route.query.type,
        }),
      },
      {
        path: '/wow/freeApp',
        name: 'wowFreeApp',
        component: () => import('@/views/wow/freeApp/index.vue'),
      },
      {
        path: '/wow/platProducts/:type',
        name: 'wowPlatProducts',
        component: () => import('@/views/wow/platProducts/index.vue'),
      },
      // 单独处理的路由
      {
        path: '/public/idhub-open',
        name: 'publicIdhubOpen',
        component: () => import('@/views/wow/idhubOpen/index.vue'),
      },
      {
        path: '/wow/platServices',
        name: 'wowPlatServices',
        component: () => import('@/views/wow/platServices/index.vue'),
      },
      // IDInside专区
      {
        path: '/wow/idInsideZone',
        name: 'idInsideZone',
        component: () => import('@/views/wow/idInsideZone/index.vue'),
      },
      {
        path: '/wow/mall',
        name: 'wowMall',
        component: () => import('@/views/wow/mall/index.vue'),
      },
      {
        path: '/wow/doc',
        name: 'wowDoc',
        component: () => import('@/views/wow/doc/index.vue'),
      },
      {
        // 前台商品详情页预览
        path: '/wow/mall/preview/:id',
        name: 'wowMallPreview',
        component: () => import('@/views/wow/mall/detail/index.vue'),
      },
      {
        path: '/wow/mall/detail/:id',
        name: 'wowMallDetail',
        component: () => import('@/views/wow/mall/detail/index.vue'),
      },
      {
        path: '/wow/filepreview/',
        name: 'wowFileFreview',
        component: () => import('@/views/wow/filepreview/index.vue'),
      },
    ],
  },
];

export default wowRoutesList;
