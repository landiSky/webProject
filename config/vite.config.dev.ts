import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import eslint from 'vite-plugin-eslint';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import { viteMockServe } from 'vite-plugin-mock';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require('node:http');

const hasMockPlugin = (isMock: boolean) => {
  return isMock
    ? viteMockServe({
        mockPath: 'src/mock', // ↓解析根目录下的mock文件夹
        localEnabled: true, // 开发打包开关
        prodEnabled: false, // 生产打包开关
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true, // 监视文件更改
      })
    : null;
};
export default defineConfig(({ command, mode }) => {
  return {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      host: '0.0.0.0',
      port: 3001,
      proxy: {
        '/api': {
          target: `http://10.14.150.253:9190/server`,
          changeOrigin: true,
          agent: new https.Agent(),
          followRedirects: true,
        },
        '/web': {
          target: `http://10.14.150.253:9190/server`,
          changeOrigin: true,
          agent: new https.Agent(),
          followRedirects: true,
        },
        '/sso': {
          target: `http://10.14.150.253:8081/`,
          changeOrigin: true,
          agent: new https.Agent(),
          followRedirects: true,
        },
      },
    },
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
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
      VueSetupExtend(),
      hasMockPlugin(mode === 'mock'),
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
          replacement: 'vue/dist/vue.esm-bundler.js', // compile template
        },
      ],
      extensions: ['.ts', '.js', '.tsx'],
    },
    define: {
      'process.env': {},
    },
    publicDir: 'assets',
  };
});
