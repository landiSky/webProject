import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import imageminPlugin from 'vite-plugin-imagemin';

export default defineConfig({
  mode: 'production',
  base: '/zst',
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
    imageminPlugin({
      // 插件选项
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          { removeViewBox: false },
          { removeEmptyAttrs: false },
          { sortAttrs: false },
        ],
      },
    }),
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
