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
import { Message, Modal } from '@tele-design/web-vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '@/store/modules/menu';
import { apiDataPoint } from '@/api/data-point';
import { useUserStore } from '@/store/modules/user';
import { snmsClientLogin } from '@/api/login';
import { sm2 } from '@/utils/encrypt';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);

const userStore = useUserStore();
const { userInfo, userInfoByCompany } = userStore;

const menuStore = useMenuStore();

const selectedKey = ref<string[]>([]);
const openedKey = ref<string[]>([]);

const pathMap = {
  12: '/buyer/index',
  13: '/buyer/order',
  14: '/seller/goods',
  15: '/seller/order',
  16: '/devCenter/manage',
  17: '/system/users',
  18: '/system/roles',
};

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

const findKeyByValue = (obj: { [key: string]: any }, value: string) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

const clickIdService = () => {
  // TODO w:用户标识服务打点
  apiDataPoint(null, null, userInfo?.id, 6, 11).then((res) => {
    console.log('用户主导航点击标识服务打点');
  });
  const { primary, companyId } = userInfoByCompany || {};
  if (Number(primary) !== 2 || userInfo?.isAdmin) {
    const { snmsUrls } = userInfo || {};
    const params = {
      companyId: userInfo?.isAdmin ? userInfo?.companyId : companyId,
      snmsLoginId: snmsUrls?.snmsLoginId,
    };
    snmsClientLogin(params).then((res: any) => {
      if (res?.data?.code === 102006) {
        Message.error(res?.data?.message);
      }
      if (!res?.data?.data) {
        return;
      }
      const data = {
        type: 'snms',
        companyId: userInfo?.isAdmin ? userInfo?.companyId : companyId,
      };
      const sm2data = sm2(
        JSON.stringify(data),
        userStore.configInfo?.publicKey
      );
      window.open(`${res?.data?.data}&data=${sm2data}`);
    });
  } else {
    Modal.warning({
      title: '仅企业管理员可操作',
      content: '',
      titleAlign: 'start',
      okText: '好的',
    });
  }
};

/**
 * 路由跳转至该路径
 * @param key 被点击的三级菜单的key
 */
const clickMenuItem = (key: string) => {
  if (/http(s)?:/.test(key)) {
    window.open(key);
  } else {
    // if (key === '/overview') {
    //   // 二级节点业务管理系统
    //   clickIdService();
    //   return;
    // }
    router.push({ path: key });
    // TODO w: 各个菜单的打点统计
    const num = findKeyByValue(pathMap, key);
    if (num) {
      apiDataPoint(null, null, userInfo?.id, 6, parseInt(num, 10)).then(
        (res) => {
          console.log('左侧菜单打点', key, num, res);
        }
      );
    }
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
