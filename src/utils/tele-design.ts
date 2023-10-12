import type { App } from 'vue';
import TeleVue, { TeleBizVue } from '@tele-design/web-vue';
import TeleVueIcon from '@tele-design/web-vue/es/icon';
import $http from '@/utils/http';
import '@tele-design/web-vue/dist/tele.css';
import '@/assets/icon-park/icon';

export function setupArco(app: App<Element>) {
  app.use(TeleVue, {});
  app.use(TeleVueIcon);
  app.use(TeleBizVue, { $http });
}
