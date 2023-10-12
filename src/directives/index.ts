import type { App } from 'vue';
import { has } from './permission';

export function setupGlobalDirective(app: App<Element>) {
  app.directive('has', has);
}
