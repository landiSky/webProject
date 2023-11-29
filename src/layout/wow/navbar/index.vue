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
      <t-input-search
        v-model="searchContent"
        class="inputSearch"
        placeholder="请输入商品名称"
        @press-enter="onSearch"
        @search="onSearch"
      />
      <t-space v-if="userInfo?.userId">
        <t-link class="controller" @click="goBuyer">控制台</t-link>

        <span class="username">
          {{ selectCompany.companyName || userInfo.mobile }}
        </span>

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
        <t-link @click="goRegister()">注册</t-link>
        <t-link @click="goLogin()">登录</t-link>
      </t-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { NodeAuthStatus } from '@/enums/common';

const TabPath = {
  INDEX: '/wow/index',
  MALL: '/wow/mall',
};
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const selectTab = ref(TabPath.INDEX);
const searchContent = ref();

const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

watch(
  () => route.path,
  (newV) => {
    // 商品详情页也激活【商城】
    if (route.name === 'wowMallDetail') {
      selectTab.value = TabPath.MALL;
    } else {
      selectTab.value = newV;
    }
  }
);
const handleLogout = async () => {
  await userStore.logout();
};
const goIndex = () => {
  selectTab.value = TabPath.INDEX;
  router.push({ path: '/wow/index' });
};
const gotoMall = () => {
  selectTab.value = TabPath.MALL;
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

const goRegister = () => {
  router.push({
    path: '/register',
  });
};
const goLogin = () => {
  userStore.jumpToLogin();
  // router.push({
  //   path: '/login',
  // });
};

const onSearch = () => {
  router.push({
    name: 'wowMall',
    query: {
      goodsName: searchContent.value,
    },
  });
};

const clickIdService = () => {
  if (!userInfo.value?.userId) {
    Modal.info({
      title: '登录提醒',
      content: '暂未登录，需要登录后方可查看标识服务。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不登录',
      okText: '去登录',
      onOk: () => {
        userStore.jumpToLogin();
      },
    });
  } else {
    const { snmsUrls } = userInfo.value || {};
    const { nodeStatus } = userInfoByCompany.value || {};
    if (nodeStatus === NodeAuthStatus.AUTHED) {
      window.open(snmsUrls.idPointer, '_blank');
    } else {
      Modal.info({
        title: '使用提醒',
        content: '使用本服务需申请企业节点后使用，请先开通或绑定企业节点。',
        titleAlign: 'start',
        hideCancel: false,
        cancelText: '暂不开通',
        okText: '去开通',
        onOk: () => {
          router.push({
            path: '/buyer/index',
            query: {
              openAuthModal: 1,
            },
          });
        },
      });
    }
  }
};

onMounted(() => {
  if (route.name === 'wowMallDetail') {
    // 商品详情页也激活【商城】
    selectTab.value = TabPath.MALL;
  } else {
    selectTab.value = route.path || TabPath.INDEX;
  }
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

    .controller {
      font-size: 12px;
    }

    .username {
      display: inline-block;
      max-width: 144px;
      overflow: hidden;
      color: #4e5969;
      font-weight: 400;
      font-size: 12px;
      line-height: 12px; /* 100% */
      white-space: nowrap;
      text-overflow: ellipsis;
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
