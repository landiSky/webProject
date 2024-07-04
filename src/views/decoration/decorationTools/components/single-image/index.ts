// import propsSchema from './CarouselImg.json';
// import uiSchema from './uiSchema.js';
// import errorSchema from './errSchema.js';

import { defineAsyncComponent } from 'vue';

const View = () => defineAsyncComponent(() => import('./view.vue'));
const Config = () => defineAsyncComponent(() => import('./ui-config.vue'));
export default {
  View,
  Config,
};
