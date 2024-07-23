<template>
  <t-layout class="layout">
    <div class="layout-navbar">
      <nav-bar />
    </div>
    <t-layout>
      <t-layout-sider
        class="layout-sider"
        :breakpoint="'xl'"
        :width="110"
        :collapsed="disable"
        :collapsible="true"
        collapsed-width="0"
        hide-trigger
      >
        <div class="menu-wrapper">
          <DecorationTools />
        </div>
      </t-layout-sider>
      <t-layout class="layout-content">
        <PageMain />
      </t-layout>

      <t-layout-sider
        class="layout-sider"
        :breakpoint="'xl'"
        :collapsed="disable"
        :collapsible="true"
        collapsed-width="0"
        :width="442"
        hide-trigger
      >
        <div class="menu-wrapper">
          <ConfigContent :data="data" />
        </div>
      </t-layout-sider>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import NavBar from '@/layout/home/navbar/index.vue';
import DecorationTools from '@/views/decoration/decorationTools/editor-tool-bar-wrap.vue';
import ConfigContent from '@/views/decoration/decorationTools/config-content-wrap.vue';
import PageMain from '@/layout/home/main/index.vue';
import eventBus from '@/utils/bus';

const navbarHeight = '48px';
const contentRef = ref<HTMLDivElement>();

const scrollY = ref(0);
const disable = ref(false);

const data = ref({ name: 'SigleImg' });

const handleMyEvent = (payload: any) => {
  console.log('Event received:', payload);
  disable.value = payload;
};
const handleScroll = (e: any) => {
  scrollY.value = e.target.scrollTop;
};
watch(
  () => scrollY.value,
  (n, o) => {
    console.log('Scrollmain:', n, o);
    if (Math.abs(n - o) > 200) {
      // 此时说明是突变的，取旧值
      setTimeout(() => {
        if (contentRef.value) {
          console.log('保持旧的', n, o);
          contentRef.value?.scrollTo(0, o);
        }
      }, 10);
    }
  }
);

onMounted(() => {
  console.log('preview-event 开始监听--');
  eventBus.on('preview-event', handleMyEvent);
});
</script>

<style scoped lang="less">
.layout {
  min-width: 1440px;
  min-height: 0;
}

.tele-layout {
  min-height: 0;
}

.layout-navbar {
  width: 100%;
  height: v-bind('navbarHeight');
}

.layout-sider {
  > :deep(.tele-layout-sider-children) {
    overflow-y: hidden;
  }
}

.menu-wrapper {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}

.layout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 48px);
  overflow-y: auto;
  background-color: #f6f7f9;
}

.collapse-btn {
  padding: 5px;
  background-color: #f2f3f8;
  border-radius: 2px;

  .tele-icon {
    color: rgb(134, 144, 156);
  }
}

:deep(.tele-layout-sider) {
  .tele-layout-sider-trigger {
    justify-content: end;
    padding-right: 12px;
    border-radius: 2px;
  }

  &.tele-layout-sider-collapsed {
    .tele-layout-sider-trigger {
      position: absolute;
      top: 45%;
      justify-content: center;
      width: 40px !important;
      height: 40px;
      padding-right: 0;
      box-shadow: 0 2px 8px #0000001a;
    }
  }
}
</style>
