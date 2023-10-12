<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';

onMounted(() => {
  // 统一添加网络异常提示
  window.addEventListener('offline', () => {
    Message.error('网络有异常，请检查网络后再试。');
  });

  window.addEventListener(
    'error',
    (event) => {
      try {
        const typeList = ['SCRIPT', 'LINK']; // , 'IMG', 'AUDIO', 'VIDEO' 防止页面加载图片失败报错
        const errorTarget: {
          [name: string]: any;
        } = event.target as HTMLElement;
        if (
          errorTarget !== window &&
          errorTarget?.nodeName &&
          typeList.includes(errorTarget?.nodeName.toUpperCase())
        ) {
          Message.error('资源加载失败，请尝试刷新浏览器。');
        }
      } catch (e) {
        console.log("window addEventListener('error')");
      }
    },
    true
  );
});
</script>
