<template>
  <div class="menu_box">
    <t-menu
      v-model:collapsed="collapsed"
      :auto-open="true"
      :auto-open-selected="true"
      :open-keys="openedKey"
      :selected-keys="selectedKey"
      :accordion="true"
      dot
      @menu-item-click="clickMenuItem"
      @sub-menu-click="clickMenuSub"
    >
      <template v-for="sub in menuStore.leftMenu">
        <t-sub-menu
          v-if="sub.children && sub.children.length > 0"
          :key="sub.path"
        >
          <template #title>{{ sub.name }}</template>
          <template v-if="sub.children && sub.children.length > 0">
            <t-menu-item
              v-for="item in sub.children"
              :key="item.path"
              :class="{ 'is-active': isOpen(item.path) }"
            >
              {{ item.name }}
            </t-menu-item>
          </template>
        </t-sub-menu>
        <t-menu-item
          v-if="!sub.children || sub.children.length == 0"
          :key="sub.path"
          :class="{ 'is-active': isOpen(sub.path) }"
        >
          {{ sub.name }}
        </t-menu-item>
      </template>
    </t-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '@/store/modules/menu';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);

const menuStore = useMenuStore();

const selectedKey = ref<string[]>([]);
const openedKey = ref<string[]>([]);

watch(
  route,
  (newVal) => {
    if (newVal.matched.length) {
      const pathList: Array<string> = [];
      newVal.matched.forEach((item: { [name: string]: any }) => {
        pathList.push(item.path);

        if (item.meta?.parentPath) {
          pathList.push(item.meta?.parentPath);
        }
      });
      pathList.forEach((pathItem) => {
        // 如果当前路由对应的菜单已经展开，则不需要再展开，如果没有展开，需要展开
        if (!openedKey.value.includes(pathItem)) {
          openedKey.value.push(pathItem);
        }
      });
      selectedKey.value = pathList;
    }
  },
  {
    immediate: true,
  }
);

/**
 * 路由跳转至该路径
 * @param key 被点击的三级菜单的key
 */
const clickMenuItem = (key: string) => {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    router.push({ path: key });
  }
};
/**
 * 如果已展开的二级菜单被点击则收起该菜单，
 * 如点击别的二级菜单则展开多个菜单
 * @param key 被点击二级菜单的key
 */
const clickMenuSub = (key: string) => {
  if (openedKey.value.includes(key)) {
    openedKey.value.splice(openedKey.value.indexOf(key), 1);
  } else {
    openedKey.value.push(key);
  }
};
const isOpen = (path: string) => {
  return path === selectedKey.value[0];
};
</script>

<style lang="less" scoped>
.menu_box {
  height: 100%;

  :deep(.tele-menu) {
    height: 100%;
  }
}
</style>
