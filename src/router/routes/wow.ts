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
      },
      {
        path: '/wow/freeApp',
        name: 'wowFreeApp',
        component: () => import('@/views/wow/freeApp/index.vue'),
      },
      {
        path: '/wow/platProducts',
        name: 'wowPlatProducts',
        component: () => import('@/views/wow/platProducts/index.vue'),
      },
      {
        path: '/wow/mall',
        name: 'wowMall',
        component: () => import('@/views/wow/mall/index.vue'),
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
    ],
  },
];

export default wowRoutesList;
