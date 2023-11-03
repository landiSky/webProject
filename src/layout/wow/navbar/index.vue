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
          <t-link href="link" class="active">首页</t-link>
          <t-link href="link">限免应用</t-link>
          <t-link href="link">标识服务</t-link>
          <t-link href="link">平台产品</t-link>
          <t-link href="link">平台服务</t-link>
          <t-link @click="gotoMall">商城</t-link>
          <t-link href="link">前沿政策</t-link>
        </t-space>
      </div>
    </div>

    <div class="right-side">
      <t-space>
        <t-input-search
          :style="{ width: '232px' }"
          placeholder="请输入商品名称"
          @search="onSearch"
        />
      </t-space>
      <t-space :size="[0]">
        <template #split>
          <t-divider direction="vertical" />
        </template>
        <t-input-search class="inputSearch" placeholder="请输入商品名称" />
        <t-link @click="goLogin('register')">注册</t-link>
        <t-link @click="goLogin('login')">登录</t-link>
      </t-space>

      <!-- <t-dropdown trigger="click" :popup-container="'.navbar'">
        <div class="click-item">
          <t-avatar :size="16" class="right-side-avatar">
            <iconpark-icon name="icon-account" size="16px"></iconpark-icon>
          </t-avatar>

          <span class="username">{{ userInfo?.username || '未知用户' }}</span>
        </div>

        <template #content>
          <t-doption class="doption-user-info" disabled>
            <t-space>
              <div class="dropdown-item">
                <iconpark-icon name="icon-account" size="24px"></iconpark-icon>
                <div class="item-info">
                  <span class="item">
                    {{ userInfo?.username || '未知用户' }}
                  </span>
                  <span v-if="userInfo?.binded === 0" class="item">
                    <span>未绑定标识身份</span>
                    <a
                      class="hover-text-decoration-underline"
                      @click="clickBind"
                      >立即绑定</a
                    >
                  </span>
                  <span v-if="userInfo?.binded === 1">
                    <span v-if="userInfo?.handleInfo" class="item">
                      <a
                        class="ellipsis hover-text-decoration-underline"
                        @click="hdlDetailVisible = true"
                        >{{ userInfo?.handleInfo?.handleAdmin }}</a
                      >
                    </span>
                    <span v-else class="item">
                      <span>未使用标识身份登录</span>
                      <a @click="clickHdlLogin">立即登录</a>
                    </span>
                  </span>
                </div>
              </div>
            </t-space>
          </t-doption>
          <t-doption @click="userInfoDialogVisible = true">
            <t-space fill>
              <iconpark-icon name="info-user" size="12px"></iconpark-icon>
              <span> 个人信息 </span>
            </t-space>
          </t-doption>
          <t-doption @click="resetPswDialogVisible = true">
            <t-space fill>
              <iconpark-icon name="user-lock" size="12px"></iconpark-icon>
              <span> 修改密码 </span>
            </t-space>
          </t-doption>
          <t-doption @click="clickLogout">
            <t-space fill>
              <iconpark-icon name="info-logout" size="12px"></iconpark-icon>
              <span> 退出登录 </span>
            </t-space>
          </t-doption>
        </template>
      </t-dropdown> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';

const store = useUserStore();
const router = useRouter();

const { userInfo } = storeToRefs(store);

const userInfoDialogVisible = ref(false);
const resetPswDialogVisible = ref(false);
const hdlDetailVisible = ref(false);

// 打开绑定弹窗
const clickBind = () => {
  Message.success('点击了立即绑定');
};

const handleLogout = async (type?: number) => {
  await store.logout();
  const params: { path: string; query?: { type: number } } = {
    path: '/login',
  };
  if (type && [1, 2].includes(type)) {
    // 如果要替换标识身份登录，退出到登录页默认选中 标识身份登录tab
    params.query = { type };
  }
  router.push(params);
};

const gotoMall = () => {
  router.push({ path: '/wow/mall' });
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

// 要使用标识身份登录
const clickHdlLogin = () => {
  handleLogout(2);
};

// 重置密码后，要退出重新登陆
const onResetPwdConfirm = () => {
  handleLogout();
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
      padding: 12px 24px;

      &:hover {
        background-color: #272e3b;
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
  color: #fff;
  background-color: #101319;
  border-color: #101319;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.tele-dropdown-option) {
  width: 240px;
  min-height: 44px;
  padding: 0 16px;
  color: #fff;
  font-size: 12px;

  &:not(.tele-dropdown-option-disabled):hover {
    color: #fff;
    background-color: #272e3b;

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
