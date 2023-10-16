<template>
  <t-layout class="layout">
    <nav-bar />
    <t-layout>
      <t-layout-sider
        class="layout-sider"
        :breakpoint="'xl'"
        :collapsed="menuCollapse"
        :collapsible="true"
        :width="192"
        :collapsed-width="48"
      >
        <template #trigger>
          <div class="collapse-btn">
            <IconMenuUnfold v-if="menuCollapse" />
            <IconMenuFold v-else />
          </div>
        </template>
        <div class="menu-wrapper">
          <PageMenu />
        </div>
      </t-layout-sider>
      <t-layout class="layout-content">
        <PageMain />
      </t-layout>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NavBar from './navbar/index.vue';
import PageMenu from './menu/index.vue';
import PageMain from './main/index.vue';

const menuCollapse = ref(false);
const navbarHeight = '48px';
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
  height: calc(100vh - 48px);
  overflow-y: hidden;
  background-color: white;
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
