import { createApp } from 'vue';
import router, { setupRouter } from '@/router/index';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
import { setupGlobalDirective } from '@/directives/index';
// import { setupGlobalComponents } from '@/components';
import { setupArco } from '@/utils/tele-design';

import '@/assets/style/global.less';
import { ButtonAuthEnum } from '@/enums/authEnum';
import App from './App.vue';

(async () => {
  const app = createApp(App);

  app.config.globalProperties.$authCode = ButtonAuthEnum;

  // Arco初始化
  setupArco(app);

  // 路由配置
  setupRouter(app);

  // 路由拦截器
  setupRouterGuard(router);

  // pinia配置
  setupStore(app);

  // 自定义指令配置
  setupGlobalDirective(app);

  // // 定义全局组件
  // setupGlobalComponents

  await router.isReady();
  app.mount('#app');
})();
