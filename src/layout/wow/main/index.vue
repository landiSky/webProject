<template>
  <div id="scrollMain" class="main">
    <router-view v-slot="{ Component, route }">
      <transition>
        <keep-alive v-if="showKeepAlive" :max="1">
          <component
            :is="Component"
            v-if="route.meta.keepAlive"
            :key="route.path"
          />
        </keep-alive>
      </transition>
      <component
        :is="Component"
        v-if="!route.meta.keepAlive"
        :key="route.path"
      />
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showKeepAlive = ref(true);

// 父子页面间跳转要缓存，非父子页面跳转取消缓存
router.afterEach((to, from) => {
  if (
    to.meta.keepAlive ||
    (from.meta.keepAlive && to.fullPath.startsWith(from.fullPath))
  ) {
    showKeepAlive.value = true;
  } else {
    showKeepAlive.value = false;
  }
});
</script>

<style scoped lang="less">
.main {
  display: flex;
  // width: 100%;
  flex: 1;
  flex-direction: column;
  height: 100%; // 页面滚动
  overflow-x: hidden;
  overflow-y: auto; //滚动不要在这里加

  :deep(.tele-tabs-content) {
    padding-top: 0;
  }
}
</style>
