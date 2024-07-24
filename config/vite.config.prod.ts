import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  mode: 'production',
  // base: '/zst',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('iconpark-icon'),
        },
      },
    }),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },

      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template. you can remove it, if you don't need.
      },
    ],
    extensions: ['.ts', '.js', '.tsx'],
  },
  define: {
    'process.env': {},
  },
});
