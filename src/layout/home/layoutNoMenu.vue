<template>
  <t-layout class="layout">
    <nav-bar />
    <t-layout>
      <t-layout class="layout-content">
        <PageMain />
      </t-layout>
    </t-layout>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NavBar from './navbar/index.vue';
import PageMain from './main/index.vue';

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

.layout-content {
  height: calc(100vh - 48px);
  overflow-y: hidden;
  background-color: white;
}
</style>
