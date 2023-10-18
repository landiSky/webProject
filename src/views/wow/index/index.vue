<template>
  <div class="carousel">
    <t-carousel
      :style="{
        width: '100%',
        height: '450px',
      }"
    >
      <t-carousel-item v-for="item in carouselList" :key="item.path">
        <img
          :src="item.path"
          :style="{
            height: '100%',
            width: '100%',
          }"
          alt="加载异常..."
          @click="clickCarousel(item.link)"
        />
      </t-carousel-item>
    </t-carousel>
  </div>
  <div class="header">
    <div
      v-for="item in allCategList"
      :key="item.icon"
      class="headerWrap"
      @click="item.action"
    >
      <div class="headerItem">
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
      <t-tabs>
        <t-tab-pane
          v-for="item in platProductsList"
          :key="item.title"
          :title="item.title"
        >
          <div class="tabDesc">
            <span>
              <iconpark-icon name="logo" size="20px"></iconpark-icon>
              <span>{{ item.title }}</span>
            </span>
            <span>{{ item.desc }}</span>
          </div>
          <div class="cardList">
            <div
              v-for="(card, index) in item.cards"
              :key="index"
              class="card"
              :style="{
                backgroundImage: `url(
                  src/assets/images/wow/index/${card.bgImg}
                )`,
              }"
            >
              <span>{{ card.name }}</span>
              <span>{{ card.desc }}</span>
            </div>
          </div>
        </t-tab-pane>
        <t-tab-pane key="2" title="工业互联网技术服务">
          Content of Tab Panel 2
        </t-tab-pane>
        <t-tab-pane key="3" title="区块链技术服务"> </t-tab-pane>
        <t-tab-pane key="3" title="创新服务"> </t-tab-pane>
      </t-tabs>
    </div>
  </div>
  <div class="policy"></div>
  <div class="idService"></div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图图片枚举
const carouselList = [
  // TODO 1 需要产品提供图片和跳转地址，当前是从一期拿了一部分
  // {
  //   path: '/public/indexCarouselImage/c1.png',
  //   link: 'https://mp.weixin.qq.com/s/uuGw-xi-FGDi08IxMBjJjQ',
  // },
  {
    path: '/public/indexCarouselImage/c2.png',
    link: 'https://www.teleinfo.cn/product_1/1574672998269988864.html',
  },
  {
    path: '/public/indexCarouselImage/c3.png',
    link: 'https://www.teleinfo.cn/Solution/176652.html',
  },
  {
    path: '/public/indexCarouselImage/c4.png',
    link: 'https://www.teleinfo.cn/Solution/176651.html',
  },
];
const clickCarousel = (link: string) => {
  window.open(link);
};

// 轮播图下面模块汇总
const allCategList = [
  {
    icon: 'freeTry',
    title: '免费试用',
    desc: '尝试限免应用，开启企业数字化时代',
    action: () => {},
  },
  {
    icon: 'idService',
    title: '标识服务',
    desc: '快速开通标识服务，享受跨区域服务',
    action: () => {
      window.open('www.baidu.com'); // TODO 2 这里替换为该平台对应的二级服务地址
    },
  },
  {
    icon: 'policyNotice',
    title: '前沿政策',
    desc: '了解区域政策，政府助力企业信息化转型',
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
    desc:
      '推动工业互联网标识解析体系和“星火· 链网”国家级区块链基础设施在产业、区域和企业落地应用，赋能数字经济高质量发展。',
    cards: [
      {
        name: 'TNaas',
        desc: '星火·链网”骨干节点',
        bgImg: 'tab1-1.png',
      },
      {
        name: 'IDPoint',
        desc: '标识解析二级节点',
        bgImg: 'tab1-2.png',
      },
      {
        name: 'IDHub',
        desc: '标识解析二级节点',
        bgImg: 'tab1-3.png',
      },
    ],
  },
  {
    title: '工业互联网技术服务',
    desc:
      '以标识解析体系为底座，将数字标识与智能硬件融合；为企业打造综合的企业数字化和工业互联网服务体系。',
    cards: [
      {
        name: 'IDMonitor',
        desc: '大数据监测平台',
        bgImg: 'tab2-1.png',
      },
      {
        name: 'IDMeta',
        desc: '元数据管理平台',
        bgImg: 'tab2-2.png',
      },
      {
        name: 'IDGuard',
        desc: '标识安全卫士',
        bgImg: 'tab2-3.png',
      },
    ],
  },
  {
    title: '区块链技术服务',
    desc:
      '工业互联网融合区块链技术，通过底层许可公有链、Baas、跨链技术等，提供立足产业的区块链技术服务和价值交换平台。',
    cards: [
      {
        name: 'TChain',
        desc: '许可公有链',
        bgImg: 'tab3-1.png',
      },
      {
        name: 'TBaas',
        desc: '区块链服务平台',
        bgImg: 'tab3-2.png',
      },
      {
        name: 'TPaas',
        desc: '有象账户',
        bgImg: 'tab3-3.png',
      },
    ],
  },
  {
    title: '创新服务',
    desc:
      '推动工业互联网标识解析体系和“星火· 链网”国家级区块链基础设施在产业、区域和企业落地应用，赋能数字经济高质量发展。',
    cards: [
      {
        name: 'TNaas',
        desc: '“星火·链网”骨干节点',
        bgImg: 'tab1-1.png',
      },
      {
        name: 'IDPoint',
        desc: '标识解析二级节点',
        bgImg: 'tab1-2.png',
      },
      {
        name: 'IDHub',
        desc: '标识解析二级节点',
        bgImg: 'tab1-3.png',
      },
    ],
  },
];
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  text-align: center;
  background-color: #fff;

  .headerWrap {
    display: flex;

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

  :deep(.tele-tabs-nav) {
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
        color: #4e5969;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px; /* 157.143% */

        &.tele-tabs-tab-active {
          margin: 7px 52px 12px 16px;
          padding: 0;
        }
      }
    }
  }

  :deep(.tele-tabs-pane) {
    display: flex;
  }

  .tabDesc {
    width: 368px;
  }

  .cardlist {
    display: flex;
    flex: 1;

    .card {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
