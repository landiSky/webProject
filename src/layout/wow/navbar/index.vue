<template>
  <div class="navbar">
    <div class="left-side">
      <div class="left">
        <t-space :size="[4]">
          <t-image
            v-if="navLogo"
            :src="`/server/web/file/download?name=${navLogo}`"
            :preview="false"
          />
          <iconpark-icon v-else name="logo" size="36px"></iconpark-icon>
          <span class="title"> {{ platformName || 'IDSphere' }} </span>
        </t-space>
      </div>
      <div class="right">
        <t-space size="[0]">
          <t-link
            v-for="(item, idx) in channelNameCollect"
            :key="idx"
            :class="{ active: setActive(item.type) }"
            @click="goPlatProducts(item)"
          >
            {{ item.name || '平台产品' }}
          </t-link>
        </t-space>
      </div>
    </div>

    <div class="right-side">
      <!-- <t-input-search
        v-model="searchContent"
        class="inputSearch"
        placeholder="请输入商品名称"
        @press-enter="onSearch"
        @search="onSearch"
      /> -->
      <t-space v-if="userInfo?.id">
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
import { apiDataPoint } from '@/api/data-point';
import {
  apiGetNavData,
  apiNavLogoList,
} from '@/api/decoration/decoration-tools';
import { ChannelType } from '@/enums/decoration';

const TabPath = {
  INDEX: '/wow/index',
  IDINSIDEZONE: '/wow/idInsideZone',
  MALL: '/wow/mall',
  DOC: '/wow/doc',
  // PROD: '/wow/platProducts',
  // SERV: '/wow/platServices',
};

// 频道页动态生成对应的tab值
const ChannelTabPath = ref<Record<string, any>>({});
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const selectTab = ref(TabPath.INDEX);
const searchContent = ref();

const store = storeToRefs(userStore);

const navLogo = ref('');
const platformName = ref('');
// 频道页集合
const channelNameCollect = ref<Record<string, any>>([]);

const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

watch(
  () => route.path,
  (newV) => {
    console.log('watch', newV);
    // 商品详情页也激活【商城】
    if (route.name === 'wowMallDetail') {
      selectTab.value = TabPath.MALL;
    } else {
      selectTab.value = newV;
    }
  }
);
const setActive = (key: number) => {
  return ChannelTabPath.value[key] === selectTab.value;
};
const handleLogout = async () => {
  await userStore.logout();
};
const goIndex = () => {
  apiDataPoint(null, null, userInfo?.value?.id, 5, 6).then((res) => {
    console.log('前台导航栏首页点击打点', res);
  });
  selectTab.value = TabPath.INDEX;
  router.push({ path: '/wow/index' });
};
const gotoMall = () => {
  apiDataPoint(null, null, userInfo?.value?.id, 5, 7).then((res) => {
    console.log('前台导航栏商城点击打点', res);
  });
  selectTab.value = TabPath.MALL;
  router.push({ path: '/wow/mall' });
};

const goBuyer = () => {
  // 运营后台跳转到运营后台首页
  if (userInfo.value?.isAdmin) {
    router.push({ path: '/goods/manage' });
  } else {
    apiDataPoint(null, null, userInfo?.value?.id, 5, 10).then((res) => {
      console.log('前台导航栏点击用户平台管理打点', res);
    });
    router.push({ path: '/buyer/index' });
  }
};

const goDocCenter = () => {
  apiDataPoint(null, null, userInfo?.value?.id, 5, 19).then((res) => {
    console.log('前台文档中心打点', res);
  });
  // 判断是不是英福平台做引流
  if (!store.configInfo.value?.isTeleInfo) {
    if (process.env.NODE_ENV !== 'production') {
      window.open('http://zhishutong.dev.idx.space/#/wow/doc');
    } else {
      window.open('https://snms.teleinfo.cn/zst/#/wow/doc');
    }
    return;
  }
  router.push({ path: '/wow/doc' });
};

const clickIdService = () => {
  apiDataPoint(null, null, userInfo?.value?.id, 5, 20).then((res) => {
    console.log('前台导航栏IDInside专区点击打点', res);
  });
  selectTab.value = TabPath.IDINSIDEZONE;
  if (!store.configInfo.value?.isTeleInfo) {
    if (process.env.NODE_ENV !== 'production') {
      window.open('http://zhishutong.dev.idx.space/#/wow/idInsideZone');
    } else {
      window.open('https://snms.teleinfo.cn/zst/#/wow/idInsideZone');
    }
    return;
  }
  router.push({ path: '/wow/idInsideZone' });
};

const goPlatProducts = (data: Record<string, any>) => {
  // 首页
  if (String(data.type) === '1') {
    goIndex();
    return;
  }
  // inside
  if (String(data.type) === '2') {
    clickIdService();
    return;
  }
  // 商城
  if (String(data.type) === '3') {
    gotoMall();
    return;
  }
  // 文档中心
  if (String(data.type) === '4') {
    goDocCenter();
    return;
  }
  apiDataPoint(null, null, userInfo?.value?.id, 5, 11).then((res) => {
    console.log('前台导航栏点击平台产品打点', res);
  });
  if (String(data.type) === '5') {
    // 单独处理开放社区
    localStorage.setItem('publicIdhubOpenType', JSON.stringify(data.type));
    router.push({
      name: 'publicIdhubOpen',
    });
    return;
  }
  // 判断动态频道是否是外链形式
  if (data.channelType === 0 && data.linkUrl && data.supportDelete) {
    // 判断是不是英福平台做引流
    selectTab.value = `/wow/platProducts/${data.type}`;
    if (!store.configInfo.value?.isTeleInfo) {
      if (process.env.NODE_ENV !== 'production') {
        window.open('http://zhishutong.dev.idx.space/#/wow/doc');
      } else {
        window.open('https://snms.teleinfo.cn/zst/#/wow/doc');
      }
    } else {
      window.open(data.linkUrl, '_blank');
    }
    return;
  }
  router.push({
    name: 'wowPlatProducts',
    params: { type: data.type },
  });
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
};

const onSearch = () => {
  // TODO w: 商城搜索打点
  apiDataPoint(null, searchContent.value, userInfo?.value?.id, 5, 9).then(
    () => {
      console.log('主导航栏商品搜索打点', searchContent.value);
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
  // 获取导航logo
  apiNavLogoList().then((res) => {
    const { name, logo } = res.data[0];
    console.log('apiNavLogoList', name, logo);
    navLogo.value = logo;
    platformName.value = name;
    const link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logo
      ? `/server/web/file/download?name=${logo}`
      : '/src/assets/images/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = name || '';
  });
  // TODO 和项目名称以及导航名称接口获取
  apiGetNavData({}).then((res) => {
    console.log('首页logo和项目名称接口获取', res);
    if (res.data) {
      // 因为type字段换成了id，改的地方比较多，所以在这里统一做同步处理
      res.data = res.data.map((i: any) => ({
        ...i,
        type: i.id,
      }));
      res.data.forEach((item: any) => {
        // 过滤出频道页, 这里统一改造成频道页动态配置
        let pathKey = '';
        if (item.type !== String(ChannelType.PLATFORM_PRODUCT_DETAIL)) {
          // 区分固定路由和动态频道路由
          if (!['1', '2', '3', '4', '5'].includes(item.type)) {
            pathKey = `/wow/platProducts/${item.type}`;
          } else {
            const fixedNav: any = {
              1: '/wow/index',
              2: '/wow/idInsideZone',
              3: '/wow/mall',
              4: '/wow/doc',
              5: '/public/idhub-open',
            };
            pathKey = fixedNav[item.type];
          }
          ChannelTabPath.value[item.type] = pathKey;
          channelNameCollect.value.push({ ...item });
        }
      });
      console.log('channelNameCollect', channelNameCollect);
    }
  });
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

  .left-side {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;

    .left {
      margin-right: 32px;

      ::v-deep(.tele-image) {
        .tele-image-img {
          width: 36px !important;
          height: 36px !important;
          object-fit: cover !important;
        }
      }
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

        &:hover {
          background-color: transparent;
        }

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
