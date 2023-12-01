import type { App } from 'vue';
import { has } from './permission';
import { copy } from './copy';

export function setupGlobalDirective(app: App<Element>) {
  app.directive('has', has);
  app.directive('copy', copy);
}
