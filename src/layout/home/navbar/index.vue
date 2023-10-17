<template>
  <div class="navbar">
    <div class="left-side">
      <div class="left">
        <t-space :size="[0]">
          <iconpark-icon name="logo-gray" size="28px"></iconpark-icon>
          <span class="title"> 分布式工业互联网平台 </span>
        </t-space>
      </div>
      <div class="right">
        <t-space>
          <t-link href="link" class="active">平台管理</t-link>
          <t-link href="link">标识管理</t-link>
        </t-space>
      </div>
    </div>
    <div class="right-side">
      <t-dropdown trigger="click" :popup-container="'.navbar'">
        <div class="click-item">
          <icon-down style="margin-right: 8px" />
          <span>北京泰尔英福公司</span>
        </div>

        <template #content>
          <t-doption @click="userInfoDialogVisible = true">
            <t-space fill>
              <iconpark-icon name="info-user" size="12px"></iconpark-icon>
              <span> 个人身份 </span>
            </t-space>
          </t-doption>
          <t-doption @click="resetPswDialogVisible = true">
            <t-space fill>
              <iconpark-icon name="user-lock" size="12px"></iconpark-icon>
              <span> 北京泰尔英福公司 </span>
            </t-space>
          </t-doption>
        </template>
      </t-dropdown>

      <iconpark-icon name="user" size="28px"></iconpark-icon>
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
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
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

        &.active {
          background-color: #1664ff;
        }
      }
    }

    .title {
      color: #fff;
      font-weight: 500;
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
      margin-right: 8px;
      padding: 10px 24px 10px 10px;

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
  width: 198px;
  color: #fff;
  font-weight: 500;
  line-height: 12px;
  background-color: #1d2129;
  border: 1px solid #1d2129;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

:deep(.tele-dropdown-option) {
  min-height: 36px;
  padding: 0 12px;
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
