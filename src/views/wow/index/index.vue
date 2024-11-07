<template>
  <div class="home-box">
    <Container :components-list="componentList" />
    <div v-if="!userStore.configInfo?.callSnmsSwitch" class="header">
      <div
        v-for="item in allCategList"
        :key="item.icon"
        class="headerWrap"
        @click="item.action"
      >
        <t-tooltip v-if="item.disable" content="敬请期待">
          <div class="headerItem">
            <span>
              <iconpark-icon :name="item.icon" size="60px"></iconpark-icon>
            </span>
            <span class="title">{{ item.title }}</span>
            <span class="desc">{{ item.desc }}</span>
          </div>
        </t-tooltip>
        <div v-else class="headerItem">
          <span>
            <iconpark-icon :name="item.icon" size="60px"></iconpark-icon>
          </span>
          <span class="title">{{ item.title }}</span>
          <span class="desc">{{ item.desc }}</span>
        </div>
        <span class="divider"></span>
      </div>
    </div>
    <div class="platform">
      <div class="title">平台产品</div>
      <div>
        <t-tabs class="platformTab">
          <t-tab-pane
            v-for="item in platProductsList"
            :key="item.title"
            :title="item.title"
          >
            <div class="tabDesc">
              <span class="contentTitle">
                <iconpark-icon
                  :key="item.title"
                  name="digitalbase"
                  size="20px"
                ></iconpark-icon>
                <span>{{ item.title }}</span>
              </span>
              <span class="contentDesc">{{ item.desc }}</span>
            </div>
            <div class="cardList">
              <!-- :style="{
                backgroundImage: `url(
                  @/assets/images/wow/index/${card.bgImg}
                )`,
              }" -->
              <div
                v-for="(card, index) in item.cards"
                :key="index"
                class="card"
                @click="goCardDetail(card)"
              >
                <img :src="card.bgImg" alt="" />
                <div class="cardContent">
                  <span>{{ card.name }}</span>
                  <span>{{ card.desc }}</span>
                  <img class="hoverVector" :src="hoverVector" alt="" />
                </div>
              </div>
            </div>
          </t-tab-pane>
        </t-tabs>
      </div>
    </div>
    <div class="policy"></div>
    <div v-if="!userStore.configInfo?.callSnmsSwitch" class="idService">
      <div class="title">标识服务</div>
      <div class="content">
        <div class="left">
          <span class="subTitle">当前活跃企业节点</span>
          <t-table
            :columns="columns"
            :bordered="false"
            :pagination="false"
            class="table"
            scrollbar
          />
          <Vue3SeamlessScroll
            class="scroll_box"
            :list="activeNodeList"
            :open-watch="true"
            :hover="true"
            :step="0.3"
            :wait-time="1000"
          >
            <t-table
              :columns="columns"
              :show-header="false"
              :data="activeNodeList"
              :bordered="false"
              :pagination="false"
              class="table-01"
              scrollbar
            />
          </Vue3SeamlessScroll>
        </div>
        <div class="right">
          <span class="subTitle">开通企业节点，获取以下资源及服务</span>
          <div class="overview">
            <div class="item">
              <span class="label">互通企业数</span>
              <span>
                <span class="value">{{ activeOverall.interWorkingCount }}</span>
                <span>家</span>
              </span>
            </div>
            <div class="item">
              <span class="label">接入应用/服务</span>
              <span>
                <span class="value">{{ activeOverall.serverCount }}</span>
                <span>个</span>
              </span>
            </div>
            <div class="item">
              <span class="label">使用公开数据标准</span>
              <span>
                <span class="value">{{ activeOverall.openStandardCount }}</span>
                <span>套</span>
              </span>
            </div>
          </div>
          <t-button
            v-if="userInfoByCompany?.nodeStatus === NodeAuthStatus?.AUTHED"
            type="primary"
            @click="goIdService"
          >
            标识服务
          </t-button>
          <t-button v-else type="primary" @click="clickIdService">
            申请开通企业节点
          </t-button>
        </div>
      </div>
    </div>
    <WowFooter></WowFooter>

    <UserAuthentication
      v-if="state.showUserEdit"
      :visible="state.showUserEdit"
      :data="state.showData"
      :title="state.showTitle"
      @on-confirm="handleEditConfirm"
      @on-cancel="handleEditCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h, reactive, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { NodeAuthStatus } from '@/enums/common';
import carouse2 from '@/assets/images/wow/index/carouse2.png';
import carouse3 from '@/assets/images/wow/index/carouse3.png';
import carouse4 from '@/assets/images/wow/index/carouse4.png';
import tab11 from '@/assets/images/wow/index/tab1-1.png';
import tab12 from '@/assets/images/wow/index/tab1-2.png';
import tab13 from '@/assets/images/wow/index/tab1-3.png';
import tab21 from '@/assets/images/wow/index/tab2-1.png';
import tab22 from '@/assets/images/wow/index/tab2-2.png';
import tab23 from '@/assets/images/wow/index/tab2-3.png';
import tab31 from '@/assets/images/wow/index/tab3-1.png';
import tab32 from '@/assets/images/wow/index/tab3-2.png';
import tab33 from '@/assets/images/wow/index/tab3-3.png';
import tab41 from '@/assets/images/wow/index/tab4-1.png';
import tab42 from '@/assets/images/wow/index/tab4-2.png';
import tab43 from '@/assets/images/wow/index/tab4-3.png';
import hoverVector from '@/assets/images/wow/index/hover-vector.png';

import {
  apiActiveNode,
  apiNodeOverall,
  apiGetProductId,
} from '@/api/wow/index';
import { snmsClientLogin } from '@/api/login';
import { apiDataPoint } from '@/api/data-point';
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
import { sm2 } from '@/utils/encrypt';
import { setToken } from '@/utils/auth';
import Container from '@/views/decoration/decorationTools/pageContainer.vue';
import { apiGetNavData } from '@/api/decoration/decoration-tools';
import { ChannelType } from '@/enums/decoration';
import UserAuthentication from './components/third-party-user-authentication.vue';
import WowFooter from '../components/wowFooter/index.vue';

const userStore = useUserStore();
const router = useRouter();
const componentList = ref([]);
const { userInfo, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

const props = defineProps({
  type: String,
});
const activeNodeList = ref<Record<string, any>[]>([]); // 活跃节点数
const activeOverall = ref<Record<string, any>>({}); // 企业节点概览

const accessProductIds = ref<Record<string, any>>({});

const state = reactive<{
  showUserEdit: boolean;
  showData: object;
  showTitle: string;
}>({
  showUserEdit: false,
  showData: {},
  showTitle: '设置用户信息，完成企业认证',
});

// 轮播图图片枚举
const carouselList = [
  {
    path: carouse2, // /indexCarouselImage/c2.png
    link: 'https://www.teleinfo.cn/product_1/1574672998269988864.html',
  },
  {
    path: carouse3,
    link: 'https://www.teleinfo.cn/Solution/176652.html',
  },
  {
    path: carouse4,
    link: 'https://www.teleinfo.cn/Solution/176651.html',
  },
];
const clickCarousel = (link: string) => {
  window.open(link);
};

const clickIdService = () => {
  if (!userInfo.value?.id) {
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
  }
};

const goIdService = () => {
  // const { snmsUrls } = userInfo.value || {};
  // window.open(snmsUrls.idPointer, '_blank');
  if (!userInfo.value?.id) {
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
  }
};

// 轮播图下面模块汇总
const allCategList = [
  {
    icon: 'freeTry',
    title: '免费试用',
    desc: '尝试限免应用，开启企业数字化时代',
    action: () => {
      router.push({
        path: '/wow/mall',
        query: {
          free: 12,
        },
      });
    },
  },
  {
    icon: 'idService',
    title: '标识服务',
    desc: '快速开通标识服务，享受跨区域服务',
    action: () => {
      clickIdService();
    },
  },
  {
    icon: 'policyNotice',
    title: '前沿政策',
    desc: '了解区域政策，政府助力企业信息化转型',
    disable: true,
    action: () => {},
  },
  {
    icon: 'hotProducts',
    title: '热门商品',
    desc: '寻找海量工业产品、服务、供应商',
    action: () => {
      router.push({
        path: '/wow/mall',
      });
    },
  },
];

// 平台产品枚举
const platProductsList = [
  {
    title: '数字基建',
    desc: '推动工业互联网标识解析体系和“星火· 链网”国家级区块链基础设施在产业、区域和企业落地应用，赋能数字经济高质量发展。',
    cards: [
      {
        name: 'TNaaS',
        desc: '星火·链网”骨干节点',
        bgImg: tab11,
        idKey: 'tnaas',
      },
      {
        name: 'IDPointer',
        desc: '标识解析二级节点',
        bgImg: tab12,
        idKey: 'idpoint',
      },

      {
        name: 'IDHub',
        desc: '标识解析企业节点',
        bgImg: tab13,
        idKey: 'idhub',
      },
    ],
  },
  {
    title: '工业互联网技术服务',
    desc: '以标识解析体系为底座，将数字标识与智能硬件融合；为企业打造综合的企业数字化和工业互联网服务体系。',
    cards: [
      {
        name: 'IDMonitor',
        desc: '大数据监测平台',
        bgImg: tab21,
        idKey: 'idmonitor',
      },
      {
        name: 'IDMeta',
        desc: '元数据管理平台',
        bgImg: tab22,
        idKey: 'idmeta',
      },
      {
        name: 'IDGuard',
        desc: '标识安全卫士',
        bgImg: tab23,
        idKey: 'idguard',
      },
    ],
  },
  {
    title: '区块链技术服务',
    desc: '工业互联网融合区块链技术，通过底层许可公有链、Baas、跨链技术等，提供立足产业的区块链技术服务和价值交换平台。',
    cards: [
      {
        name: 'TChain',
        desc: '许可公有链',
        bgImg: tab31,
        idKey: 'tchain',
      },

      {
        name: 'TBaaS',
        desc: '区块链服务平台',
        bgImg: tab32,
        idKey: 'tbaas',
      },
      {
        name: 'TPaaS',
        desc: '有象账户',
        bgImg: tab33,
        idKey: 'tpasss',
      },
    ],
  },
  {
    title: '创新服务',
    desc: '构建数字化产业集群，打造创新的数字底座、智能硬件、绿色业务平台。',
    cards: [
      {
        name: '',
        desc: 'Teleinfo碳管家',
        bgImg: tab42,
        idKey: 'industrialPark',
      },
      {
        name: '',
        desc: '碳电分析管理平台',
        bgImg: tab42,
        idKey: 'intelHardware',
      },
      {
        name: '',
        desc: '区块链模组',
        bgImg: tab43,
        idKey: 'twoCarbon',
      },
    ],
  },
];

const columns = [
  {
    title: ' 企业前缀',
    dataIndex: 'companyPrefix',
    width: 88,
    ellipsis: true,
    tooltip: { position: 'top' },
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    ellipsis: true,
    tooltip: { position: 'top' },
    // width: 148,
  },
  {
    title: '注册量',
    width: 146,
    render: ({ record }: Record<string, any>) => {
      const { registerCount } = record;
      return String(registerCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  {
    title: '解析量',
    width: 136,
    render: ({ record }: Record<string, any>) => {
      const { parseCount } = record;
      return String(parseCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
];

const goCardDetail = (item: Record<string, any>) => {
  const productId = accessProductIds.value[item.idKey];
  if (!productId) return;
  router.push({
    name: 'wowMallDetail',
    params: {
      id: productId,
    },
  });
};

const handleSubmit = () => {
  state.showUserEdit = true;
};

const handleEditCancel = () => {
  state.showUserEdit = false;
};

const handleEditConfirm = (tokenValue: any) => {
  console.log(tokenValue, 'tokenValue');
  userStore.clearUserInfo();
  setToken(tokenValue);
  state.showUserEdit = false;
  router.push({ path: '/buyer/index' });
};

const handleEditConfirm2 = (tokenValue: any) => {
  console.log(tokenValue, 'tokenValue');
  userStore.clearUserInfo();
  setToken(tokenValue);
  state.showUserEdit = false;
  window.location.reload();
};

const enterpriseCertification = (params: any) => {
  Modal.warning({
    title: '企业已认证',
    content: () => {
      return h('div', { class: 'info-modal-content' }, [
        h('div', '该企业已完成「企业认证」'),
        h(
          'div',
          { style: 'margin: 12px 0;padding: 16px;background: #F2F3F8;' },
          [
            h('div', { style: 'font-weight: 500;' }, '企业信息'),
            h('div', { style: 'display: flex;margin-top: 12px;' }, [
              h(
                'div',
                { style: 'width: 60px;margin-right: 8px;color: #4E5969;' },
                '管理员'
              ),
              h('div', { style: '' }, params.name),
            ]),
            h('div', { style: 'display: flex;margin-top: 12px;' }, [
              h(
                'div',
                { style: 'width: 60px;margin-right: 8px;color: #4E5969;' },
                '联系方式'
              ),
              h('div', { style: '' }, params.phone),
            ]),
          ]
        ),
        h('div', '是否加入该企业成为子账号？'),
      ]);
    },
    titleAlign: 'start',
    hideCancel: false,
    cancelText: '取消',
    okText: '加入',
    onOk: () => {
      // 点击加入后弹出用户信息认证;
      handleSubmit();
    },
  });
};

const singleSignOn = () => {
  console.log(userStore.getUserAuthData, '最后的数据');
  const data = userStore.getUserAuthData;
  if (!props.type && !data.tokenValue) return;
  if (Number(data.checkStatus) === 1) {
    if (!data?.tokenValue) return;
    // 手机号和认证信息都存在时直接单点登录进本系统  token
    handleEditConfirm2(data?.tokenValue);
  } else if (Number(data.checkStatus) === 2) {
    state.showData = data;
    state.showTitle = '设置用户信息，完成企业认证';
    // 手机号在本系统不存，并且企业不存在
    handleSubmit();
  } else if (Number(data.checkStatus) === 3) {
    state.showData = data;
    state.showTitle = '设置用户信息，完成注册';
    // 手机号在本系统不存，并且企业存在
    const params = {
      name: data?.companyName,
      phone: data?.companyContactPhone,
    };
    enterpriseCertification(params);
  } else if (Number(data.checkStatus) === 4) {
    // 同手机号在平台上已经注册，引导用户登录
    Modal.warning({
      title: '本手机号已在平台完成注册，请使用手机号登录',
      content: '',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '取消',
      okText: '去登录',
      onOk: () => {
        userStore.jumpToLogin();
      },
    });
  }
};

onMounted(() => {
  apiGetNavData({ id: ChannelType.PLATFORM_HOME }).then((res: any) => {
    if (res.data.length > 0) {
      const { detail } = res.data[0];
      if (!detail) return;
      componentList.value = JSON.parse(res.data[0].detail);
    }
  });
  apiDataPoint(null, null, userInfo?.value?.id, 1, 1).then((res) => {
    console.log('首页全页面打点');
  });
  apiActiveNode().then((data: any) => {
    if (data.length >= 51) {
      activeNodeList.value = data.slice(1, 51);
    } else {
      activeNodeList.value = data;
    }
  });
  apiNodeOverall().then((data) => {
    activeOverall.value = data;
  });

  apiGetProductId().then((data) => {
    accessProductIds.value = data;
  });
  // 控制视频播放速度
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = 0.65; // 视频将以正常速度的0.65倍播放
  }

  singleSignOn();
});
</script>

<style lang="less" scoped>
.home-box {
  .top-box {
    position: relative;
    width: 100%;
    height: auto;

    .top-left-box {
      position: absolute;
      top: 10%;
      left: 32%;
      width: 240px;
      height: 240px;
      // background-color: red;
    }

    .top-right-box {
      position: absolute;
      top: 1%;
      left: 68%;
      width: 240px;
      height: 240px;
    }

    .bottom-right-box {
      position: absolute;
      top: 50%;
      left: 69%;
      width: 240px;
      height: 240px;
    }

    .bottom-left-box {
      position: absolute;
      top: 54%;
      left: 32%;
      width: 240px;
      height: 240px;
    }

    .trigger-box {
      position: relative;
      top: 0;
      left: 0;
      z-index: 2000;
      width: 240px;
      height: 240px;
      background-color: transparent;
    }
  }

  .header {
    display: flex;
    justify-content: center;
    padding: 24px 0;
    text-align: center;
    background-color: #fff;

    .headerWrap {
      display: flex;
      cursor: pointer;

      .headerItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 293px;
        height: 170px;
        padding: 16px 17px;

        span {
          display: inline-block;

          &.title {
            margin-top: 14px;
            margin-bottom: 14px;
            color: #000;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
          }

          &.desc {
            color: #4e5969;
            font-size: 14px;
            line-height: 22px; /* 157.143% */
          }
        }

        &:hover {
          background: #fff;
          border-radius: 4px;

          /* 阴影/常规阴影-卡片 */
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        }
      }

      .divider {
        display: inline-block;
        width: 1px;
        height: 170px;
        background-color: #e5e8ef;
      }

      &:last-child .divider {
        display: none;
      }
    }
  }

  .platform {
    padding-bottom: 55px;
    text-align: center;
    background-image: url('@/assets/images/wow/index/platform_bg.svg');

    .title {
      padding-top: 40px;
      padding-bottom: 20px;
      color: #1d2129;
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      background: rgba(255, 255, 255, 0.5);
    }

    .platformTab {
      :deep(.tele-tabs-nav) {
        background: rgba(255, 255, 255, 0.5);

        &::before {
          display: none;
        }

        .tele-tabs-nav-tab {
          justify-content: center;

          .tele-tabs-nav-ink {
            height: 3px;
            background-color: #1664ff;
          }

          .tele-tabs-tab {
            margin: 0 36px;
            padding: 12px 0;
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px; /* 157.143% */

            // &.tele-tabs-tab-active {
            //   margin: 7px 52px 12px 16px;
            //   padding: 0;
            // }
          }
        }
      }

      :deep(.tele-tabs-content) {
        padding-top: 87px;
      }

      :deep(.tele-tabs-pane) {
        display: flex;
        align-items: start;
        justify-content: center;
      }

      :deep(.tele-tabs-content-item-active) {
        overflow: visible;
      }
    }

    .tabDesc {
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 368px;
      margin-top: 61px;
      margin-right: 86px;
      margin-left: 100px;

      .contentTitle {
        display: flex;
        color: #1d2129;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;

        span {
          margin-left: 12px;
        }
      }

      .contentDesc {
        margin-top: 12px;
        padding-top: 12px;
        color: #4e5969;
        font-size: 14px;
        line-height: 22px;
        text-align: left;
        border-top: 1px solid #c9cdd4;
      }
    }

    .cardList {
      display: flex;
      // flex: 1;
      .card {
        display: flex;
        flex-direction: column;
        width: 210px;
        height: 284px;
        margin-right: 46px;
        color: #435c97;
        cursor: pointer;
        transition-duration: 0.5s;
        transition-property: color, transform;

        .hoverVector {
          width: 40px;
          margin-top: 12px;
          opacity: 0;
          transition: all 1s ease;
        }

        &:hover {
          color: #1664ff;
          transform: translate(0, -20px);

          .hoverVector {
            opacity: 1;
          }
        }

        .cardContent {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -76px;

          span {
            display: inline-block;
            font-weight: 300;
            font-size: 20px;
            line-height: 28px; /* 140% */

            &:first-child {
              margin-bottom: 4px;
            }

            &:last-child {
              font-size: 14px;
              line-height: 22px;
            }
          }

          .desc {
            font-weight: 300;
            font-size: 14px;
            font-family: PingFang SC;
            font-style: normal;
            line-height: 22px; /* 157.143% */
            text-align: center;
          }
        }
      }
    }
  }

  .idService {
    padding-bottom: 42px;
    background-color: #f2f3f8;

    .title {
      padding-top: 40px;
      padding-bottom: 20px;
      color: #1d2129;
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
      // background: rgba(255, 255, 255, 0.5);
    }

    .content {
      display: flex;
      justify-content: center;

      .left,
      .right {
        width: 580px;
        height: 414px;
        padding: 24px;
        background: #fff;
        border: 1px solid #ebecf0;
        border-radius: 4px;
      }

      .left {
        margin-right: 16px;

        :deep(.tele-table-header) {
          background-color: transparent;
        }

        :deep(.tele-table-th) {
          color: #1d2129;
          font-weight: 500;
          font-size: 14px;
          line-height: 22px; /* 157.143% */
          background-color: transparent;
        }

        :deep(.tele-table-td) {
          color: #86909c;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px; /* 157.143% */
          border-bottom: none;
        }

        :deep(.tele-table-cell) {
          padding: 16px 28px 0 0;
        }

        .table {
          margin-top: -12px;
          // margin-left: -16px;
          :deep(.tele-empty) {
            padding: 50px 0 !important;
          }

          :deep(.tele-table-td-content) {
            display: none;
          }
        }

        .table-01 {
          margin-top: -12px;

          :deep(.tele-empty) {
            padding: 50px 0 !important;
          }
        }

        .scroll_box {
          height: 288px;
          overflow: hidden;
        }
      }

      .right {
        .overview {
          display: flex;
          justify-content: space-between;
          width: 530px;
          height: 164px;
          margin-top: 32px;
          margin-bottom: 48px;
          padding: 40px 14px;
          background-image: url('@/assets/images/wow/index/idservice_right_bg.svg');

          .item {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .label {
              margin-bottom: 24px;
              color: #000;
              font-weight: 500;
              font-size: 14px;
              line-height: 22px;
            }

            .value {
              color: #1664ff;
              font-weight: 600;
              font-size: 32px;
              line-height: 38px;
            }
          }
        }
      }

      .subTitle {
        display: block;
        margin-bottom: 16px;
        color: #1d2129;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
      }
    }
  }
}

@media screen and (max-width: 1440px) {
  .home-box {
    .top-box {
      .trigger-box {
        position: relative;
        top: 0;
        left: 0;
        z-index: 2000;
        width: 180px;
        height: 180px;
        background-color: transparent;
      }
    }
  }
}
@media screen and (min-width: 2560px) {
  .home-box {
    .top-box {
      .trigger-box {
        position: relative;
        top: 0;
        left: 0;
        z-index: 2000;
        width: 400px;
        height: 400px;
        background-color: transparent;
      }
    }
  }
}

::v-deep(.tele-trigger-popup) {
  .tele-trigger-popup-wrapper {
    .tele-popover-popup-content {
      width: 322px !important;
      height: 160px !important;
      padding: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: transparent;

      .tele-popover-title {
        width: 100%;

        .content-header {
          position: relative;
          display: flex !important;
          align-items: flex-start;
          justify-content: space-between !important;
          height: 54px;
          background-color: transparent !important;

          span {
            margin-left: 30px;
            font-weight: 500;
            font-size: 24px;
            line-height: 54px;
          }
        }
      }

      .tele-popover-content {
        width: 100%;
        height: 104px;

        .hover-content {
          position: relative;
          display: flex !important;
          flex-direction: column;
          align-items: flex-start !important;
          justify-content: space-evenly !important;
          height: 100%;
          padding: 6px 10px 0 20px;
          color: #4e5969;
          font: PingFang SC;
          font-size: 14px;
          background-color: #bcf6ff80;

          .hover-desc {
            display: -webkit-box;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .hover-more {
            margin-top: 6px;
            color: #1664ff;
            cursor: pointer;
          }
          // .img_top-left {
          //   position: absolute;
          //   bottom: 4px;
          //   left: 0;
          // }
          // .img_top-right {
          //   position: absolute;
          //   bottom: 4px;
          //   right: 0;
          // }
        }
      }
    }

    .tele-trigger-arrow {
      visibility: hidden;
    }
  }
}
</style>
