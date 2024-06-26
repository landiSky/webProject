<template>
  <div class="banner-container">
    <video ref="video" autoplay muted loop>
      <source :src="videoImg" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <span class="banner-text">文档中心</span>
  </div>
  <div class="card-box">
    <div
      v-for="item in contents"
      :key="item.title"
      class="card-item"
      :style="item.bgImg"
    >
      <span class="card-title">
        <img :src="item.icon" />
        <span class="text">{{ item.title }}</span>
      </span>
      <div class="card-desc">
        {{ item.desc }}
      </div>
      <div class="search-btn" @click="handleSearch(item.url)">查看全部 ></div>
    </div>
  </div>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import videoImg from '@/assets/images/wow/doc/doc-banner.mp4';
import bg1 from '@/assets/images/wow/doc/bg1.png';
import bg2 from '@/assets/images/wow/doc/bg2.png';
import bg3 from '@/assets/images/wow/doc/bg3.png';
import icon1 from '@/assets/images/wow/doc/icon1.png';
import icon2 from '@/assets/images/wow/doc/icon2.png';
import icon3 from '@/assets/images/wow/doc/icon3.png';
import WowFooter from '../components/wowFooter/index.vue';

const commonStyle = {
  backgroundSize: 'cover', // 背景图片覆盖整个元素
  backgroundPosition: 'center', // 背景图片居中显示
  backgroundRepeat: 'no-repeat', // 不重复背景图片
};

const contents = ref([
  {
    bgImg: {
      backgroundImage: `url(${bg1})`,
      ...commonStyle,
    },
    icon: icon1,
    title: '平台集成文档',
    desc: '平台集成文档，SaaS应用接入指南',
    url: 'http://id-pointer-sdk.pre.idx.space/docs/saas/writing-purpose',
  },
  {
    bgImg: {
      backgroundImage: `url(${bg2})`,
      ...commonStyle,
    },
    icon: icon2,
    title: '标识服务',
    desc: '工业互联网标识开放文档，为应用开发者提供完善的应用集成标准流程规范、SDK下载及使用、API接口使用说明等，帮助开发者便捷的完成企业信息系统、平台等与标识体系对接，将企业及企业数据接入标识体系，开发标识应用等操作。',
    url: '',
  },
  {
    bgImg: {
      backgroundImage: `url(${bg3})`,
      ...commonStyle,
    },
    icon: icon3,
    title: 'IDInside合作计划',
    desc: '加速标识应用贯通，从零开始，仅需五步，实现应用快速接入标识体系。',
    url: 'http://id-pointer-sdk.pre.idx.space/docs/idinside/document-overview',
  },
]);

const handleSearch = (url: string) => {
  window.open(url);
};
</script>

<style lang="less" scoped>
.banner-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px; /* 设置容器高度为视口高度 */

  video {
    width: 100%;
    height: 100%;
  }

  .banner-text {
    position: absolute;
    left: 310px;
    color: #052878;
    font-weight: 500;
    font-size: 48px;
  }
}

.card-box {
  display: flex;
  justify-content: center;
  margin-top: 60px;
  margin-bottom: 90px;

  .card-item {
    position: relative;
    width: 450px;
    height: 386px;
    margin-right: 24px;
    padding: 48px;

    &::last-child {
      margin-right: 0;
    }

    .card-title {
      img {
        width: 28px;
        height: 28px;
      }

      .text {
        margin-left: 4px;
        color: #1d2129;
        font-weight: 500;
        font-size: 20px;
        vertical-align: super;
      }
    }

    .card-desc {
      width: 224px;
      margin-top: 12px;
      color: #4e5969;
      font-size: 16px;
      line-height: 24px;
    }

    .search-btn {
      position: absolute;
      bottom: 48px;
      color: #1664ff;
      cursor: pointer;
    }
  }
}
</style>
