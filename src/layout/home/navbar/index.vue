<template>
  <div class="navbar">
    <div class="left-side">
      <div class="left">
        <!-- <t-space :size="[0]"> -->
        <t-link class="link" @click="goWow">
          <iconpark-icon name="logo-gray" size="28px"></iconpark-icon>
          <span class="title"> IDSphere </span>
        </t-link>
        <!-- </t-space> -->
      </div>
      <div class="right">
        <t-space>
          <t-link class="active">平台管理</t-link>
          <t-link @click="clickIdService">标识管理</t-link>
        </t-space>
      </div>
    </div>
    <div class="right-side">
      <span v-if="!userInfo?.companyList?.length" style="margin-right: 32px">{{
        userInfo?.mobile
      }}</span>
      <t-dropdown
        v-else
        trigger="click"
        :popup-container="'.navbar'"
        class="companyDropdown"
        @select="onChangeCompany"
      >
        <div class="click-item">
          <icon-down style="margin-right: 8px" />
          <span class="companyName">{{
            selectCompany?.companyName || '-'
          }}</span>
        </div>

        <template #content>
          <t-doption
            v-for="company in userInfo?.companyList"
            :key="company.companyId"
            :value="company.companyId"
            :class="{ active: selectCompany?.companyId === company.companyId }"
          >
            <t-space fill>
              <span class="doptionCompanyName">
                {{ company.companyName }}
              </span>
            </t-space>
          </t-doption>
        </template>
      </t-dropdown>

      <t-dropdown trigger="click" :popup-container="'.navbar'" class="logout">
        <div class="click-item">
          <iconpark-icon name="user" size="28px"></iconpark-icon>
        </div>

        <template #content>
          <t-doption @click="clickLogout">
            <t-space fill>
              <span> 退出登录 </span>
            </t-space>
          </t-doption>
        </template>
      </t-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { NodeAuthStatus } from '@/enums/common';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const { userInfo, userInfoByCompany, selectCompany } = storeToRefs(userStore);

const handleLogout = async () => {
  try {
    await userStore.logout();
  } catch (e) {
    console.log('登出异常:', e);
  }

  // router.push({ path: '/wow' });
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

const clickIdService = () => {
  const { nodeStatus } = userInfoByCompany.value || {};
  if (userInfo.value?.isAdmin || nodeStatus === NodeAuthStatus.AUTHED) {
    const { snmsUrls } = userInfo.value || {};
    window.open(snmsUrls.idPointer, '_blank'); // 跳转到二级首页
  } else {
    Modal.info({
      title: '使用提醒',
      content: '使用本服务需申请企业节点后使用，请先开通或绑定企业节点。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不开通',
      okText: '去开通',
      onOk: () => {
        // 变更不同的值，再卖家首页才可以多次点击
        const curAuthValue = route.query.openAuthModal;
        router.push({
          path: '/buyer/index',
          query: {
            openAuthModal: curAuthValue ? Number(curAuthValue) + 1 : 1,
          },
        });
      },
    });
  }
};

const goWow = () => {
  router.push({
    path: '/wow',
  });
};

const onChangeCompany = async (companyId: string) => {
  const resultList = userInfo.value?.companyList?.filter(
    (company: Record<string, any>) => company.companyId === companyId
  );

  const selectItem =
    Array.isArray(resultList) && resultList.length ? resultList[0] : {};
  await userStore.changeSelectCompany(selectItem);

  router.push({
    path: '/buyer/index',
  });

  // 要在 app.vue 中监听 userstore.的变化
};
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding-right: 24px;
  background-color: #1d2129;

  :deep(.tele-trigger-popup) {
    top: 48px !important;
  }

  .left-side {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    padding-left: 24px;

    .left {
      margin-right: 110px;

      .link {
        display: flex;
        align-items: center;

        &:hover {
          background: none;
        }
      }
    }

    .right {
      height: 100%;

      :deep(.tele-space) {
        height: 100%;

        .tele-space-item {
          height: 100%;
        }
      }

      :deep(.tele-link) {
        padding: 0 16px;
        color: #fff;
        font-size: 14px;
        line-height: 64px;

        &:hover {
          background-color: inherit;
        }

        &.active {
          background-color: #1664ff;
        }
      }
    }

    .title {
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
    }
  }

  .right-side {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
    font-size: 12px;
    line-height: 12px;

    .resolve-link {
      margin-right: 12px;
      color: white;

      &:hover {
        background-color: transparent;
      }
    }

    .click-item {
      &:first-child {
        display: flex;
        margin-right: 24px;
      }
      // margin-right: 8px;
      // padding: 10px 24px 10px 10px;
      &:hover {
        background-color: #272e3b;
        cursor: pointer;
      }

      .companyName {
        display: inline-block;
        max-width: 144px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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

&:deep(.tele-dropdown) {
  color: #fff;
  font-weight: 500;
  line-height: 12px;
  background-color: #1d2129;
  border: none;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.companyDropdown) {
  width: 198px;

  .active {
    background-color: #4086ff;
  }

  .doptionCompanyName {
    display: inline-block;
    max-width: 186px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.logout {
  width: 90px;
}

:deep(.tele-dropdown-option) {
  min-height: 36px;
  padding: 0 12px;
  color: #fff;
  font-size: 12px;

  &:not(.tele-dropdown-option-disabled):hover {
    color: #fff;
    background-color: #4086ff;

    &.doption-user-info {
      background-color: transparent; // 个人信息没有hover效果
    }
  }

  &.tele-dropdown-option-disabled {
    cursor: default;
  }

  &:last-child {
    border-top: 1px solid #4e5969;
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
