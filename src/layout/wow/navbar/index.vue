<template>
  <div class="navbar">
    <div class="left-side">
      <div class="left">
        <t-space :size="[4]">
          <iconpark-icon name="logo" size="36px"></iconpark-icon>
          <span class="title"> IDSphere </span>
        </t-space>
      </div>
      <div class="right">
        <t-space size="[0]">
          <t-link
            :class="{ active: selectTab === TabPath.INDEX }"
            @click="goIndex"
            >首页</t-link
          >
          <t-tooltip content="敬请期待">
            <t-link>限免应用</t-link>
          </t-tooltip>

          <t-link @click="clickIdService">标识服务</t-link>
          <t-tooltip content="敬请期待">
            <t-link>平台产品</t-link>
          </t-tooltip>
          <t-tooltip content="敬请期待">
            <t-link>平台服务</t-link>
          </t-tooltip>
          <t-link
            :class="{ active: selectTab === TabPath.MALL }"
            @click="gotoMall"
            >商城</t-link
          >

          <t-tooltip content="敬请期待">
            <t-link>前沿政策</t-link>
          </t-tooltip>
        </t-space>
      </div>
    </div>

    <div class="right-side">
      <t-space v-if="userInfo.userId">
        <t-link @click="goBuyer">控制台</t-link>
        <span class="username">泰尔英福</span>
        <t-dropdown trigger="click" :popup-container="'.navbar'">
          <div class="click-item">
            <iconpark-icon name="avatar" size="34px"></iconpark-icon>
          </div>

          <template #content>
            <t-doption @click="clickLogout">
              <t-space fill>
                <span> 退出登录 </span>
              </t-space>
            </t-doption>
          </template>
        </t-dropdown>
      </t-space>

      <t-space v-else :size="[0]">
        <template #split>
          <t-divider direction="vertical" />
        </template>
        <t-input-search
          class="inputSearch"
          placeholder="请输入商品名称"
          @search="onSearch"
        />
        <t-link @click="goLogin('register')">注册</t-link>
        <t-link @click="goLogin('login')">登录</t-link>
      </t-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';

const TabPath = {
  INDEX: '/wow/index',
  MALL: '/wow/mall',
};
const store = useUserStore();
const router = useRouter();
const route = useRoute();
const selectTab = ref(TabPath.INDEX);

const { userInfo }: Record<string, any> = storeToRefs(store);

const handleLogout = async () => {
  await store.logout();

  router.push({
    path: '/wow',
  });
};
const goIndex = () => {
  router.push({ path: '/wow/index' });
};
const gotoMall = () => {
  router.push({ path: '/wow/mall' });
};

const goBuyer = () => {
  router.push({ path: '/buyer/index' });
};

const clickLogout = () => {
  Modal.warning({
    title: '确定退出登录当前账号吗？',
    titleAlign: 'start',
    content: '',
    hideCancel: false,
    onOk: () => {
      handleLogout();
    },
  });
};

const goLogin = (type: 'register' | 'login') => {
  router.push({
    path: '/login',
    params: {
      type,
    },
  });
};

const onSearch = (value: string) => {
  router.push({
    name: 'wowMall',
    params: {
      goodsName: value,
    },
  });
};

const clickIdService = () => {
  console.log('index.vue:139===打开二级=====', userInfo.value.userId);
  if (!userInfo.value.userId) {
    router.push({
      path: '/login',
    });
  } else {
    console.log('index.vue:139===打开二级');
    window.open('http://id-pointer.test.idx.space/snms/ui/index', '_blank');
  }
};

onMounted(() => {
  selectTab.value = route.path;
});
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding-right: 0;
  padding-left: 12px;
  background-color: #fff;
  box-shadow: 0 -1px 0 0 #e5e6e8 inset;

  // :deep(.tele-trigger-popup) {
  //   top: 48px !important;
  // }
  .left-side {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    // padding-left: 24px;
    .left {
      margin-right: 32px;
    }

    .right {
      height: 100%;
      line-height: 64px;

      :deep(.tele-link) {
        height: 100%;
        margin: 0 16px;
        color: #4e5969;
        font-size: 14px;
        line-height: 64px;

        &.active {
          color: #1664ff;
          border-bottom: 4px solid #165dff;
        }
      }

      :deep(.tele-space) {
        height: 100%;

        .tele-space-item {
          height: 100%;
          margin-right: 0;
        }
      }
    }

    .title {
      color: #0b3673;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
    }
  }

  .right-side {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;

    .inputSearch {
      width: 232px;
      height: 34px;
      margin-right: 28px;
    }

    :deep(.tele-link) {
      margin: 0 16px;
      color: #4e5969;
      font-size: 14px;
      line-height: 22px;
    }

    .click-item {
      margin-right: 12px;
      padding: 15px;

      &:hover {
        background-color: #f2f3f8;
        cursor: pointer;
      }
    }

    .username {
      display: inline-block;
      margin-left: 8px;
      color: #fff;
      font-size: 12px;
      line-height: 20px;
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: start;

    .item-info {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      margin-left: 12px;

      .item {
        display: inline-block;
        height: 20px;
        line-height: 20px;

        &:last-child {
          color: #86909c;
        }

        a {
          margin-left: 4px;
          color: #4086ff;
          cursor: pointer;

          &.ellipsis {
            display: inline-block;
            max-width: 165px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}

:deep(.tele-dropdown) {
  width: 90px;
  // color: #fff;
  background-color: #fff;
  // border-color: #101319;
  border: none;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.tele-dropdown-option) {
  min-height: 36px;
  padding: 16px 12px;
  color: #4e5969;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px; /* 100% */

  &:not(.tele-dropdown-option-disabled):hover {
    background-color: #f2f3f8;
  }
}

:deep(.tele-dropdown-option-content) {
  width: 100%;
}

:deep(.tele-dropdown-list-wrapper) {
  max-height: 250px;
}

:deep(.tele-badge-dot) {
  width: 4px;
  height: 4px;
  background-color: #e63f3f;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--color-bg-2);
}

.right-side-avatar {
  :deep(.tele-avatar-text) {
    transform: scale(1) translateX(-50%) !important;
  }
}
</style>
