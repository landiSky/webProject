<template>
  <div class="navbar">
    <div class="left-side">
      <div class="left">
        <t-link class="link" @click="goWow">
          <t-image
            v-if="logo"
            :src="`/server/web/file/download?name=${logo}`"
            :preview="false"
          />
          <iconpark-icon v-else name="logo-gray" size="28px"></iconpark-icon>
          <span class="title"> {{ platformName || 'IDSphere' }} </span>
        </t-link>
      </div>
      <div class="right">
        <t-space>
          <t-link
            v-for="item in menuList"
            :key="item.key"
            :class="{
              'active': item.key === menuStore.menuIndex,
              'is-hide': item.hide,
            }"
            @click="setDot(item.key)"
          >
            <template
              v-if="String(item.id) === '8' && !configInfo.qingFlowSwitch"
            >
              {{ item.name }}
            </template>
          </t-link>
        </t-space>
      </div>
    </div>
    <div class="right-side">
      <div
        v-if="!userInfo?.value?.isAdmin"
        style="width: 232px; margin-right: 58px; background-color: red"
      >
        <t-input-search
          v-model="searchContent"
          class="inputSearch"
          placeholder="请输入商品名称"
          @press-enter="onSearch"
          @search="onSearch"
        />
      </div>
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
          <icon-down class="icon-down" />
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
        <div class="click-item2">
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
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { Message, Modal } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { useMenuStore } from '@/store/modules/menu';
import { apiDataPoint } from '@/api/data-point';
import { snmsClientLogin } from '@/api/login';
import { sm2 } from '@/utils/encrypt';
import { useDecorationStore } from '@/store/modules/decoration';
import eventBus from '@/utils/bus';

const userStore = useUserStore();
const decoration = useDecorationStore();
const router = useRouter();
const searchContent = ref();
const { userInfo, userInfoByCompany, selectCompany } = storeToRefs(userStore);
const { platFormLogo, platFormName } = storeToRefs(decoration);
const logo = ref(platFormLogo);
const platformName = ref(platFormName);
const menuStore = useMenuStore();
const menuList = ref<Record<string, any>>([]);
const configInfo = JSON.parse(localStorage.getItem('configInfo') || '');

const userMenu = [
  {
    name: '平台管理',
    hide: false,
    key: 1,
  },
  {
    name: '标识管理',
    hide: userStore.configInfo?.callSnmsSwitch,
    key: 2,
  },
];

const manageMenu = [
  {
    name: '平台管理',
    hide: false,
    key: 1,
  },
  {
    name: '标识管理',
    hide: userStore.configInfo?.callSnmsSwitch,
    key: 3,
  },
];
const menuChange = () => {
  let dataList = [];
  if (userInfo.value?.isAdmin) {
    dataList = manageMenu;
  } else {
    dataList = userMenu;
  }
  return dataList;
};
menuList.value = [...menuChange()];

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
  // TODO w:用户标识服务打点
  apiDataPoint(null, null, userInfo?.value?.id, 6, 11).then((res) => {
    console.log('用户主导航点击标识服务打点');
  });
  const { primary, companyId } = userInfoByCompany.value || {};
  if (Number(primary) !== 2 || userInfo.value?.isAdmin) {
    const { snmsUrls } = userInfo.value || {};
    const params = {
      companyId: userInfo.value?.isAdmin
        ? userInfo.value?.companyId
        : companyId,
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
        companyId: userInfo.value?.isAdmin
          ? userInfo.value?.companyId
          : companyId,
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
const goWow = () => {
  router.push({
    path: '/wow',
  });
  useMenuStore().setMenuIndex(1, userInfo.value);
};

const onChangeCompany = async (companyId: string) => {
  const resultList = userInfo.value?.companyList?.filter(
    (company: Record<string, any>) => company.companyId === companyId
  );
  const resultIndex = userInfo.value?.companyList?.findIndex(
    (company: Record<string, any>) => company.companyId === companyId
  );
  localStorage.setItem('companyIndex', resultIndex);
  const selectItem =
    Array.isArray(resultList) && resultList.length ? resultList[0] : {};
  await userStore.changeSelectCompany(selectItem);
  const { primary } = userInfoByCompany.value || {};
  if (Number(primary) === 2) {
    useMenuStore().setMenuIndex(1, userInfo.value);
    router.push({
      path: '/buyer/index',
    });
  }

  // 要在 app.vue 中监听 userstore.的变化
};

const setDot = (index: number) => {
  // TODO w:用户主导航平台管理打点,这个打点位置存疑？
  console.log('用户主导航平台管理打点');
  // apiDataPoint(null, null, 6, 10);
  if (index === 3) {
    // 点击标识管理，跳转到二级企业管理系统
    clickIdService();
    return;
  }
  const { primary } = userInfoByCompany.value || {};
  if (index === 2 && Number(primary) === 2) {
    // 点击标识管理，跳转到二级企业管理系统
    Modal.warning({
      title: '仅企业管理员可操作',
      content: '',
      titleAlign: 'start',
      okText: '好的',
    });
    return;
  }
  try {
    useMenuStore().setMenuIndex(index, userInfo.value);
    router.push({ path: menuStore.firstRoutePath });
  } catch (error: any) {
    console.log(error);
  }
};

const onSearch = () => {
  // TODO w: 商城搜索打点
  apiDataPoint(null, searchContent.value, userInfo?.value?.id, 6, 2).then(
    (res) => {
      console.log('用户主导航栏商品搜索打点', searchContent.value);
    }
  );
  router.push({
    name: 'wowMall',
    query: {
      goodsName: searchContent.value,
    },
  });
};

onMounted(() => {
  userStore.getConfigInfo(); // 这里需要重新调用一次，因为navbar优先于app加载
  eventBus.emit('updateNavData');
});

watch(
  () => router,
  () => {
    const currentPath = router.currentRoute.value.path;

    // 在标识管理-license管理页面刷新路由，需要手动更新左侧菜单和选中一级菜单
    if (currentPath === '/license/index' || currentPath === '/overview/index') {
      useMenuStore().setMenuIndex(2, userInfo.value);
    } else {
      useMenuStore().setMenuIndex(1, userInfo.value);
    }
  },
  {
    immediate: true,
  }
);

// 监听store变化，将数据二次赋值
watch(
  () => userStore.configInfo,
  (newVal: Record<string, any>) => {
    menuList.value.forEach((item: any) => {
      if (item.name === '标识管理') {
        item.hide = newVal.callSnmsSwitch;
      }
    });
  },
  { immediate: true, deep: true }
);
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

  .is-hide {
    display: none;
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

        ::v-deep(.tele-image) {
          .tele-image-img {
            width: 28px !important;
            height: 28px !important;
            object-fit: cover !important;
          }
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
      margin-left: 4px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      &:first-child {
        display: flex;
        margin-right: 24px;
      }
      // background-color: red;
      // margin-right: 8px;
      // padding: 10px 24px 10px 10px;
      &:hover {
        background-color: #272e3b;
        cursor: pointer;
      }

      .icon-down {
        margin-bottom: 2px;
        margin-left: 10px;
        color: white;
        opacity: 0.6;
      }

      .companyName {
        display: inline-block;
        max-width: 144px;
        margin-right: 24px;
        margin-left: 8px;
        overflow: hidden;
        color: white;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        opacity: 0.6;
      }
    }

    .click-item2 {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;

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
