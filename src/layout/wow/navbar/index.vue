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
          <template
            v-for="(item, idx) in computeChannel(channelNameCollect)"
            :key="idx"
          >
            <t-link
              :class="{
                active: setActive(item),
              }"
              @click="goPlatProducts(item, '')"
            >
              <span>{{ item.name || '平台产品' }}</span>
            </t-link>
          </template>
          <div v-if="moreMenuData.length" class="select-more-box">
            <t-link
              class="more"
              :class="{
                active: setMoreActive(),
              }"
              @mouseenter="handleMoreEnter"
            >
              更多
            </t-link>
            <ul
              v-show="moreStatus"
              class="select-menu"
              @mouseleave="handleMoreLeave"
            >
              <li
                v-for="item in moreMenuData"
                :key="item.id"
                :class="{
                  active: item.channelType && !item.linkUrl && setActive(item),
                }"
                class="select-menu-item"
                @click="goPlatProducts(item, 'more')"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </t-space>
      </div>
    </div>

    <div class="right-side">
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
import { useDecorationStore } from '@/store/modules/decoration';
import { apiDataPoint } from '@/api/data-point';
import { apiGetNavData } from '@/api/decoration/decoration-tools';
import { ChannelType } from '@/enums/decoration';
import eventBus from '@/utils/bus';

const TabPath = {
  INDEX: '/wow/index',
  IDINSIDEZONE: '/wow/idInsideZone',
  MALL: '/wow/mall',
  DOC: '/wow/doc',
  LIGHTAPPLICATIONMALL: '/wow/lightApplicationMall',
  // PROD: '/wow/platProducts',
  // SERV: '/wow/platServices',
};

// 频道页动态生成对应的tab值
const ChannelTabPath = ref<Record<string, any>>({});
const userStore = useUserStore();
const decoration = useDecorationStore();
const router = useRouter();
const route = useRoute();
const selectTab = ref(TabPath.INDEX);

const store = storeToRefs(userStore);
const { platFormLogo, platFormName } = storeToRefs(decoration);
const navLogo = ref(platFormLogo);
const platformName = ref(platFormName);
// 频道页集合
const channelNameCollect = ref<Record<string, any>>([]);

const moreMenuData = ref<Record<string, any>>([]);

const moreStatus = ref(false);

const { userInfo, selectCompany, configInfo }: Record<string, any> =
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
    // 轻应用商品详情页也激活【轻应用商城】
    if (route.name === 'wowLightApplicationMallDetail') {
      selectTab.value = TabPath.LIGHTAPPLICATIONMALL;
    } else {
      selectTab.value = newV;
    }
  }
);

const computeChannel = (channelData: any) => {
  // 过滤标识轻应用
  const data = channelData.filter((item: any) => {
    if (String(item.id) === '8') {
      return configInfo.value.qingFlowSwitch;
    }
    return true;
  });
  if (data.length > 9) {
    moreMenuData.value = data.slice(9);
    return data.slice(0, 9);
  }
  moreMenuData.value = [];
  return data;
};

const handleMoreEnter = () => {
  moreStatus.value = true;
};

const handleMoreLeave = () => {
  moreStatus.value = false;
};

const setMoreActive = () => {
  if (moreMenuData.value.length) {
    return moreMenuData.value.some(
      // 过滤出外链
      (item: any) =>
        !!item.channelType &&
        !item.linkUrl &&
        ChannelTabPath.value[item.id] === selectTab.value
    );
  }
  return false;
};

const setActive = (data: any) => {
  return ChannelTabPath.value[data.id] === selectTab.value;
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

const goLightAppMall = () => {
  apiDataPoint(null, null, userInfo?.value?.id, 5, 7).then((res) => {
    console.log('前台导航栏商城点击打点', res);
  });
  selectTab.value = TabPath.LIGHTAPPLICATIONMALL;
  router.push({ path: '/wow/lightApplicationMall' });
};

const goPlatProducts = (data: Record<string, any>, type: string) => {
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
  // 轻应用商城
  if (String(data.type) === '8') {
    goLightAppMall();
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
    moreStatus.value = false;
    // 更多如果外链跳出不设置active
    if (type !== 'more') selectTab.value = `/wow/platProducts/${data.type}`;
    window.open(data.linkUrl, '_blank');
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

onMounted(() => {
  // 获取导航logo
  eventBus.emit('updateNavData');
  // TODO 和项目名称以及导航名称接口获取
  apiGetNavData({}).then((res) => {
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
          if (!['1', '2', '3', '4', '5', '8'].includes(item.type)) {
            pathKey = `/wow/platProducts/${item.type}`;
          } else {
            const fixedNav: any = {
              1: '/wow/index',
              2: '/wow/idInsideZone',
              3: '/wow/mall',
              4: '/wow/doc',
              5: '/public/idhub-open',
              8: '/wow/lightApplicationMall',
            };
            pathKey = fixedNav[item.type];
          }
          ChannelTabPath.value[item.type] = pathKey;
          channelNameCollect.value.push({ ...item });
        }
      });
    }
  });
  if (route.name === 'wowMallDetail') {
    // 商品详情页也激活【商城】
    selectTab.value = TabPath.MALL;
  } else {
    selectTab.value = route.path || TabPath.INDEX;
  }
  if (route.name === 'wowLightApplicationMallDetail') {
    // 轻应用商品详情页也激活【轻应用商城】
    selectTab.value = TabPath.LIGHTAPPLICATIONMALL;
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

        &.more {
          border-bottom: none;
        }
      }

      .more:hover {
        color: #1664ff;
      }

      :deep(.tele-space) {
        height: 100%;

        .tele-space-item {
          height: 100%;
          margin-right: 0;
        }
      }

      .select-more-box {
        position: relative;

        .select-menu {
          position: absolute;
          z-index: 100;
          width: 190px;
          max-height: 220px;
          padding: 12px 16px;
          overflow-y: scroll;
          background: #fff;
          border-radius: 2px;

          .select-menu-item {
            line-height: 44px;

            &.active {
              color: #1664ff;
            }

            &:hover {
              color: #1664ff;
              cursor: pointer;
            }
          }
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
