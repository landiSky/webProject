<template>
  <div class="bodyT">
    <!-- IDInside合作计划 -->
    <div class="idinside">
      <video
        src="@/assets/images/idinside/inside-banner.mp4"
        class="idinside-video"
        autoplay
        loop
        muted
      ></video>
      <div class="idinside-bg">
        <div class="idinside-top">
          <div class="idinside-title">IDInside合作计划</div>
          <!-- <div class="idinside-text">
            <div class="icon"></div>
            <div class="text"
              >"IDInside合作计划"，以打造百款标识产品、服务万家企业为目标。</div
            >
          </div> -->
          <div class="idinside-text">
            <div class="icon"></div>
            <div class="text"
              >IDInside合作计划”联合生态各方，打造百款产品、服务万家企业，实现产品、应用、场景和标识的预连接，助力政府、产业和企业数字化转型，加速标识贯通，最终形成百万量级节点的工业互联网标识服务网络。</div
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 为什么要加入IDInside -->
    <div ref="testref" class="why-join">
      <div class="unified unified-bottom">
        <div class="unified-left unified-icon-01"></div>
        <div class="unified-title">为什么要加入IDInside</div>
        <div class="unified-right unified-icon-02"></div>
      </div>
      <div class="advantage" :class="{ test: true, testenter: testShow }">
        <div
          v-for="(item, index) in whyJoin"
          :key="index"
          class="advantage-list"
        >
          <img :src="item.img" alt="" class="img" />
          <div class="text">
            <div class="title">
              <div class="title-icon"></div>
              <div class="title-name">{{ item.title }}</div>
            </div>
            <ul>
              <li v-for="item2 in item.introduceList" :key="item2">
                <span>{{ item2.label }}{{ item2.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 如何加入IDInside -->
    <div class="join">
      <div class="unified">
        <div class="unified-left unified-icon-03"></div>
        <div class="unified-title unified-title-white">如何加入IDInside</div>
        <div class="unified-right unified-icon-04"></div>
      </div>
      <div class="step">
        <div class="card card-01">
          <div class="icon">01</div>
          <div class="title">报名申请</div>
          <div class="text">
            点击「<span class="text-button" @click="registerNow">立即报名</span
            >」 <p>填写报名申请信息</p></div
          >
        </div>
        <div class="card card-02">
          <div class="icon">02</div>
          <div class="title">资料提交</div>
          <div class="text"
            >点击「<span class="text-button" @click="uploadNow">立即上传</span
            >」上传完整的产品集成方案。</div
          >
        </div>
        <div class="card card-03">
          <div class="icon">03</div>
          <div class="title">集成开发</div>
          <div class="text"
            >点击「<span class="text-button" @click="viewNow">立即查看</span
            >」查看集成开发文档，下载应用集成开发包及开发测试报告模版。</div
          >
        </div>
        <div class="card card-04">
          <div class="icon">04</div>
          <div class="title">测评认证</div>
          <div class="text"
            >获取IDInside认证证书，请提供测试环境信息及开发测试报告「<span
              class="text-button"
              @click="authentication"
              >立即上传</span
            >」
          </div>
        </div>
        <div class="card card-05">
          <div class="icon">05</div>
          <div class="title">运营推广</div>
          <div class="text">
            完成应用上架进行运营推广「<span
              class="text-button"
              @click="immediatelisting"
              >立即上架</span
            >」
          </div>
        </div>
      </div>
    </div>
    <!-- 优秀认证案例 -->
    <div class="case">
      <div class="unified">
        <div class="unified-left unified-icon-01"></div>
        <div class="unified-title">优秀认证案例</div>
        <div class="unified-right unified-icon-02"></div>
      </div>
      <t-carousel
        :style="{
          width: '1398px',
          height: '760px',
        }"
        :auto-play="true"
        animation-name="fade"
        indicator-position="outer"
        indicator-type="line"
        show-arrow="never"
        :current="carouselCurrent"
        @change="currentChange"
      >
        <t-carousel-item v-for="(item, index) in caseList" :key="index">
          <div class="carousel-body">
            <div
              class="instructions-left"
              @click="about('Left', carouselCurrent)"
            ></div>
            <div class="synopsis">
              <div class="synopsis-left">
                <div class="left-01">
                  <div class="tamList">{{ item.type }}</div>
                  <div class="title">{{ item.title }}</div>
                </div>
                <div class="left-02">案例介绍：</div>
                <div class="left-03">{{ item.intro }}</div>
                <div class="left-04"></div>
                <div class="left-02">取得成果：</div>
                <!-- 展示图片 -->
                <!-- <div class="left-05">
                  <div class="image"></div>
                  <div class="image"></div>
                  <div class="image"></div>
                  <div class="image"></div>
                  <div class="image"></div>
                  <div class="image"></div>
                </div> -->
                <!-- 展示文字 -->
                <div class="left-06">
                  <ul>
                    <li>{{ item.briefintroduction }}</li>
                  </ul>
                </div>
              </div>
              <div class="synopsis-right">
                <img :src="item.img" alt="" />
              </div>
            </div>
            <div
              class="instructions-right"
              @click="about('right', carouselCurrent)"
            ></div>
          </div>
          <div class="instructions">
            <div
              class="instructions-icon"
              :class="{ 'instructions-icon-blue': carouselCurrent === 1 }"
              @click="currentClick(1)"
            ></div>
            <div
              class="instructions-icon"
              :class="{ 'instructions-icon-blue': carouselCurrent === 2 }"
              @click="currentClick(2)"
            ></div>
            <div
              class="instructions-icon"
              :class="{ 'instructions-icon-blue': carouselCurrent === 3 }"
              @click="currentClick(3)"
            ></div>
            <div
              class="instructions-icon"
              :class="{ 'instructions-icon-blue': carouselCurrent === 4 }"
              @click="currentClick(4)"
            ></div>
          </div>
        </t-carousel-item>
      </t-carousel>
    </div>
    <!-- 明星产品 -->
    <div class="product">
      <div class="unified">
        <div class="unified-left unified-icon-01"></div>
        <div class="unified-title">明星产品</div>
        <div class="unified-right unified-icon-02"></div>
      </div>
      <div class="understand">
        <div class="learnmore" @click="learnmore">了解更多</div>
        <img :src="product1" alt="" class="img" />
        <!-- <img
          :src="
            previewImgList.length
              ? `/server/web/file/download?name=${previewImgList[0]}&productId=${prodDetail.id}`
              : defaultImg
          "
          class="img"
        /> -->
        <div class="introduce">
          <div class="title">{{ prodDetail.name || '-' }}</div>
          <div class="company">{{ prodDetail.companyName || '-' }}</div>
          <div class="line"></div>
          <div class="briefintroduction">
            {{ prodDetail.introduction || '-' }}
          </div>
          <t-button
            type="primary"
            class="introduce-button"
            @click="() => goMallDetail(prodDetail.id)"
            >立即了解该产品</t-button
          >
        </div>
      </div>
    </div>
    <!-- 合作伙伴类型 -->
    <div class="partners">
      <div class="unified">
        <div class="unified-left unified-icon-01"></div>
        <div class="unified-title">合作伙伴类型</div>
        <div class="unified-right unified-icon-02"></div>
      </div>
      <div class="service">
        <div class="box box-img-01">
          <div class="title">硬件服务</div>
          <div class="text">在工业领域有自主知识产权的硬件产品服务商</div>
        </div>
        <div class="box box-img-02">
          <div class="title">软件服务</div>
          <div class="text">在工业领域有自主知识产权的软件产品服务商</div>
        </div>
        <div class="box box-img-03">
          <div class="title">解决方案服务</div>
          <div class="text"
            >围绕工业各垂直行业的业务特征，打造各行业标准化集成解决方案，为工业用户提供一站式的解决方案服务</div
          >
        </div>
      </div>
    </div>
    <!-- 伙伴代表 -->
    <div class="partner">
      <div class="unified">
        <div class="unified-left unified-icon-01"></div>
        <div class="unified-title">伙伴代表</div>
        <div class="unified-right unified-icon-02"></div>
      </div>
      <div class="img-list">
        <img
          v-for="(item, index) in partnerList"
          :key="index"
          :src="item"
          alt=""
        />
      </div>
    </div>
    <WowFooter></WowFooter>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { AccountType } from '@/enums/common';
import { apiGetProductId } from '@/api/wow/index';
import { apiProductDetail } from '@/api/wow/mall';
import { apiDataPoint } from '@/api/data-point';
import { Modal } from '@tele-design/web-vue';
import advantage1 from '@/assets/images/idinside/whyjoin/advantage-01.png';
import advantage2 from '@/assets/images/idinside/whyjoin/advantage-02.png';
import advantage3 from '@/assets/images/idinside/whyjoin/advantage-03.png';
import advantage4 from '@/assets/images/idinside/whyjoin/advantage-04.png';

import case0101 from '@/assets/images/idinside/case/case-01-01.png';
import case0201 from '@/assets/images/idinside/case/case-02-01.png';
import case0301 from '@/assets/images/idinside/case/case-03-01.png';
import case0401 from '@/assets/images/idinside/case/case-04-01.png';

import product1 from '@/assets/images/idinside/product-01.png';

import partner1 from '@/assets/images/idinside/partner/partner-01.png';
import partner2 from '@/assets/images/idinside/partner/partner-02.png';
import partner3 from '@/assets/images/idinside/partner/partner-03.png';
import partner4 from '@/assets/images/idinside/partner/partner-04.png';
import partner5 from '@/assets/images/idinside/partner/partner-05.png';
import partner6 from '@/assets/images/idinside/partner/partner-06.png';
import partner7 from '@/assets/images/idinside/partner/partner-07.png';
import partner8 from '@/assets/images/idinside/partner/partner-08.png';
import partner9 from '@/assets/images/idinside/partner/partner-09.png';
import partner10 from '@/assets/images/idinside/partner/partner-10.png';
import partner11 from '@/assets/images/idinside/partner/partner-11.png';
import partner12 from '@/assets/images/idinside/partner/partner-12.png';
import partner13 from '@/assets/images/idinside/partner/partner-13.png';
import partner14 from '@/assets/images/idinside/partner/partner-14.png';
import partner15 from '@/assets/images/idinside/partner/partner-15.png';

import defaultImg from '@/assets/images/wow/mall/default_product_logo.png';
import WowFooter from '../components/wowFooter/index.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const accessProductIds = ref<Record<string, any>>({});
const prodDetail = ref<Record<string, any>>({}); // 商品详情数据
const previewImgList = ref<string[]>([]);
const partnerList = ref([
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
  partner6,
  partner7,
  partner8,
  partner9,
  partner10,
  partner11,
  partner12,
  partner13,
  partner14,
  partner15,
]);

const whyJoin = ref([
  {
    img: advantage1,
    title: '技术赋能',
    introduceList: [
      {
        label: '开放资源：',
        value: '提供详细的技术文档，包括产品手册、API文档、安装指南等',
      },
      {
        label: '服务咨询：',
        value: '提供定制化的产品规划和解决方案服务咨询，找到合适的产品应用场景',
      },
      {
        label: '研发协作：',
        value: '提供专业的技术咨询与服务，协同解决合作伙伴的技术难题',
      },
    ],
  },
  {
    img: advantage2,
    title: '业务拓展',
    introduceList: [
      {
        label: '产品推广：',
        value: '优选产品入驻智数通平台IDInside专区，推向标识解析体系的全网用户',
      },
      {
        label: '项目推广：',
        value:
          '优先获取部委或地方的数字化转型、技术改造和标识贯通等项目合作机会',
      },
      {
        label: '业务推广：',
        value: '联合工业互联网运营工作组，拓展业务',
      },
    ],
  },
  {
    img: advantage3,
    title: '品牌推广',
    introduceList: [
      {
        label: '内容推广：',
        value:
          '通过公众号（泰尔英福等）、核心央媒报道（光明网等）将品牌信息传递给大众',
      },
      {
        label: '营销活动：',
        value:
          '通过各种形式的专题活动、产品发布会进行品牌营销，如标识大赛，百城千园行，合作伙伴大会、战略发布会',
      },
    ],
  },
  {
    img: advantage4,
    title: '资源共享',
    introduceList: [
      {
        label: '信息共享：',
        value: '共享市场洞察、政策与法规等信息',
      },
      {
        label: '产品培训：',
        value: '组织开展工业互联网标识解析相关培训',
      },
      {
        label: '知识产权合作：',
        value: '联合编写专利、标准、白皮书等',
      },
      {
        label: '商机共拓：',
        value: '共享伙伴产品能力、渠道和客户资源',
      },
    ],
  },
]);

const testShow = ref(false);
const testref: Record<string, any> = ref(null);
const handleScroll = () => {
  nextTick(() => {
    const currentScroll = testref.value.getBoundingClientRect().top; // 表示当前标签距离顶部滚动的位置
    console.log(currentScroll);
    if (currentScroll < 608) {
      // 当前滚动位置到达testref的时候，显示div（100作为调整用）
      testShow.value = true;
    } else if (currentScroll > 760) {
      testShow.value = false;
    }
  });
};

const caseList = ref([
  {
    type: '双碳',
    title: '双碳大脑',
    intro:
      '双碳智慧大脑创新中心是服务于政府及企业，依托星火·链网以碳账户为基础实现横纵数据的融会贯通、可信可用，科学计算、监测碳排，辅助政府智能决策。双碳智慧大脑加入IDInside合作计划，与星火·链网和标识解析体系对接集成，通过数据统一编码，碳排放量监测等，建立一站式碳应用服务进行碳诊断、碳盘查等能力。',
    img: case0101,
    briefintroduction:
      '实现为政府提供全局分析视图，评估政策制定策略，准确反馈政策实施效果。帮助企业提升获得投融资市场认可及服务，促进多方合作共享，推动绿色项目的创新和发展。实现向政府提交第三方盘查申请，经核实后完成碳盘查。实现潜在节能机会识别，有效减少碳排，同时积累碳资产为参与碳交易做准备等。',
  },
  {
    type: '农业',
    title: '星火可信溯源',
    intro:
      '道地中药材需进行产品种植加工，销售等进行溯源，对符合溯源标准产品授予可信溯源标识二维码。通过IDInside合作计划进行标识解析体系接入，打造“来源可查，去向可追，责任可究”的服务体系，以品质、安全、透明重塑消费者信任关系，基于“星火·链网”为道地中药材、特色农产品等打造可信溯源服务，以一物一码技术贯通生产源头和消费终端。',
    img: case0201,
    briefintroduction:
      '实现中药材标准/规范产业应用方案。实现种植溯源、加工溯源、包装溯源能力。通过标识解析体系和星火·链网接入，实现种植数据、加工数据互联互通，防伪验真服务，同时实现产品生产全链路可追溯，助力行业健康可持续发展。',
  },
  {
    type: '工业',
    title: '晓数通',
    intro:
      '晓数通是一款为企业运管人员提供的运营管理工具，需将企业多源异构数据封装成各业务能力台账，实现跨部门数据在线化集成分析，降低企业数据管理成本。通过IDInside合作计划晓数通与标识解析体系结合，通过标识元数据采集原始数据，建立标准台账模板，一键生成目标报表，实现从台账到企业一套表上报的全流程管理和上报，企业中用于优化电子统计台账的管理，实现数据的规范治理和高效共享。企业可以通过晓数通平台自动生成符合需求的统计报表，并将结果呈现给用户，实现高效的数据共享与传递。',
    img: case0301,
    briefintroduction:
      '晓数通通过与标识解析体系的结合，实现了企业内部数据的整合，提高数据的透明度。平台的实施加强供应链的协同效应。通过标识解析，企业能够实时跟踪物料和产品流动，优化库存管理，降低企业数据管理成本。',
  },
  {
    type: '工业',
    title: 'CPS融通互联平台',
    intro:
      '为推进智能制造的无缝连接，企业需同步并共享设计、采购、生产、销售等各环节的系统数据，打破信息孤岛，实现全价值链关键业务流程的整合。通过IDInside合作计划，针对制造互联互通等问题，接入标识解析体系，统一标识编码，为产品和部件制定唯一标识编码规则，确保各环节信息一致性。通过标识解析，对产品从设计到售后服务的全生命周期进行管理，可消除数据孤岛，使企业管理更高效。',
    img: case0401,
    briefintroduction:
      '接入标识解析体系，统一产品及部件编码，实现智能制造互联互通，消除信息孤岛。通过标识解析能力贯穿从原材料采购、管理及最终产品销售，实现了全链条的透明化管理。让企业管理更有效，实现智能化管理。',
  },
]);
const carouselCurrent = ref(1 as number);
const currentClick = (num: number) => {
  carouselCurrent.value = num;
};
const currentChange = (index: number) => {
  carouselCurrent.value = index;
};
const { userInfo } = userStore;
const about = (name: string, num: number) => {
  if (name === 'Left') {
    carouselCurrent.value = num === 1 ? num : num - 1;
  } else if (name === 'right') {
    carouselCurrent.value = num === 4 ? num : num + 1;
  }
};

const registerNow = () => {
  window.open('https://www.wjx.cn/vm/tUBQRHV.aspx#');
};

const uploadNow = () => {
  window.open('https://www.wjx.cn/vm/hwO27TP.aspx#');
};

const viewNow = () => {
  apiDataPoint(null, null, userInfo?.id, 5, 19).then((res) => {
    console.log('前台导航栏文档中心打点', res);
  });
  router.push({
    name: 'wowDoc',
    params: {},
  });
};

const authentication = () => {
  window.open('https://www.wjx.cn/vm/wVsmqlI.aspx#');
};

const immediatelisting = () => {
  const { userInfo, userInfoByCompany } = userStore;
  if (!userInfo?.id) {
    console.log(route.fullPath, 'route.fullPath');
    sessionStorage.setItem('mallDetailPath', route.fullPath);
    userStore.jumpToLogin('wowMallDetail'); // 目的是从这里跳到登录页的，登录后再回来
    return;
  }
  if (userInfoByCompany?.primary === AccountType.UNAUTH) {
    Modal.info({
      title: '使用提醒',
      content: '需申请企业认证后使用，请先进行企业认证。',
      titleAlign: 'start',
      hideCancel: false,
      cancelText: '暂不认证',
      okText: '去认证',
      onOk: () => {
        apiDataPoint(null, null, userInfo?.id, 6, 12).then((res) => {
          console.log('用户导航栏概览页打点', res);
        });
        router.push({
          path: '/buyer/index',
        });
      },
    });
    return;
  }
  apiDataPoint(null, null, userInfo?.id, 6, 14).then((res) => {
    console.log('用户导航栏商品管理点击打点', res);
  });
  router.push({
    path: '/seller/goods',
    query: {},
  });
};

const goMallDetail = (id: string) => {
  apiDataPoint(null, null, userInfo?.id, 5, 7).then((res) => {
    console.log('前台导航栏IDInside专区点击打点', res);
  });
  router.push({
    name: 'wowMallDetail',
    params: { id },
  });
};

const learnmore = () => {
  apiDataPoint(null, null, userInfo?.id, 5, 9).then((res) => {
    console.log('前台导航栏商品搜索打点', res);
  });
  router.push({
    path: '/wow/mall',
    query: {
      idinside: 1,
    },
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);
  apiGetProductId().then((data) => {
    accessProductIds.value = data;
    apiProductDetail({ id: data?.idInside })
      .then((data) => {
        prodDetail.value = data;
        previewImgList.value = data.detailImg.split(',');
      })
      .catch(() => {});
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true);
});
</script>

<style lang="less" scoped>
.bodyT {
  background-color: #fff;
}

.idinside {
  position: relative;
  width: 100%;
  height: 700px;

  .idinside-video {
    z-index: -10;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .idinside-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 50%;
    height: 700px;
    background: linear-gradient(
      270deg,
      rgba(188, 200, 238, 0.18) 0%,
      rgba(216, 227, 255, 0.8) 42.5%,
      #e9f0ff 96%
    );

    .idinside-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin-left: -200px;

      .idinside-title {
        margin-bottom: 12px;
        margin-left: -134px;
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 36px;
        font-family: PingFang SC;
        line-height: 44px;
        text-align: left;
      }

      .idinside-text {
        display: flex;
        margin-top: 12px;

        .icon {
          width: 20px;
          height: 15px;
          margin-top: 6px;
          background: url(@/assets/images/idinside/unified/icon-01.png)
            no-repeat;
          background-size: 100% 100%;
        }

        .text {
          width: 386px;
          margin-left: 12px;
          color: rgba(71, 83, 109, 1);
          font-weight: 400;
          font-size: 20px;
          font-family: PingFang SC;
          line-height: 28px;
          text-align: left;
        }
      }
    }
  }
}

.why-join {
  display: flex;
  flex-direction: column;
  align-items: center;

  .testenter {
    .advantage-list:nth-child(1) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.2s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.3s ease;
      }
    }

    .advantage-list:nth-child(2) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.4s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.5s ease;
      }
    }

    .advantage-list:nth-child(3) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.6s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.7s ease;
      }
    }

    .advantage-list:nth-child(4) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.8s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.9s ease;
      }
    }
  }

  .test {
    .advantage-list:nth-child(1) {
      .img {
        transform: translateX(30%);
        opacity: 0;
      }

      .text {
        transform: translateX(30%);
        opacity: 0;
      }
    }

    .advantage-list:nth-child(2) {
      .img {
        transform: translateX(30%);
        opacity: 0;
      }

      .text {
        transform: translateX(30%);
        opacity: 0;
      }
    }

    .advantage-list:nth-child(3) {
      .img {
        transform: translateX(30%);
        opacity: 0;
      }

      .text {
        transform: translateX(30%);
        opacity: 0;
      }
    }

    .advantage-list:nth-child(4) {
      .img {
        transform: translateX(30%);
        opacity: 0;
      }

      .text {
        transform: translateX(30%);
        opacity: 0;
      }
    }
  }

  .advantage {
    display: flex;
    gap: 40px;
    justify-content: center;
    width: 100%;
    padding-bottom: 72px;
    // height: 406px;
    // margin-top: 74px;
    overflow-x: clip;
    background: url(@/assets/images/idinside/whyjoin/advantage-bg.png) no-repeat;
    background-size: 100% 100%;

    .advantage-list {
      // margin-top: -82px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .img {
        width: 264px;
        height: 266px;
      }

      .text {
        width: 320px;

        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;

          .title-icon {
            width: 12px;
            height: 12px;
            background: url(@/assets/images/idinside/whyjoin/icon-01.png)
              no-repeat;
            background-size: 100% 100%;
          }

          .title-name {
            margin-left: 8px;
            color: rgba(0, 0, 0, 1);
            font-weight: 500;
            font-size: 16px;
            font-family: PingFang SC;
            line-height: 24px;
            text-align: left;
          }
        }

        > ul > li {
          margin-top: 12px;
          margin-left: 20px;
          list-style-type: disc;

          span {
            color: #4e5969;
            font-weight: 400;
            font-size: 14px;
            font-family: PingFang SC;
            line-height: 22px;
            text-align: left;
          }
        }
      }
    }
  }
}

.join {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;
  background: url(@/assets/images/idinside/join/join-bg.png) no-repeat;
  background-size: 100% 100%;

  .step {
    display: flex;
    gap: 28px;

    .card-01 {
      background-image: url(@/assets/images/idinside/join/join-01.png);
    }

    .card-02 {
      background-image: url(@/assets/images/idinside/join/join-02.png);
    }

    .card-03 {
      background-image: url(@/assets/images/idinside/join/join-03.png);
    }

    .card-04 {
      background-image: url(@/assets/images/idinside/join/join-04.png);
    }

    .card-05 {
      background-image: url(@/assets/images/idinside/join/join-05.png);
    }

    .card {
      width: 254px;
      height: 276px;
      padding: 20px;
      background-size: contain;
      // border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      // background: rgba(255, 255, 255, 0.33);
      .icon {
        display: flex;
        gap: 0;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        color: rgba(255, 255, 255, 1);
        font-weight: 500;
        font-size: 20px;
        font-family: Barlow;
        background: rgba(0, 77, 255, 1);
        border-radius: 4px;
        box-shadow: 0 0 30px 0 rgba(113, 195, 255, 1) inset;
      }

      .title {
        margin-top: 12px;
        font-weight: 500;
        font-size: 16px;
        font-family: PingFang SC;
        line-height: 24px;
        text-align: left;
      }

      .text {
        margin-top: 12px;
        color: rgba(78, 89, 105, 1);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 22px;
        text-align: left;

        .text-button {
          color: rgba(22, 100, 255, 1);
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC;
          line-height: 22px;
          text-align: left;
          cursor: pointer;
        }
      }
    }

    .card:hover {
      border-image-source: linear-gradient(
        180deg,
        #fff 0%,
        rgba(255, 255, 255, 0) 100%
      );
      box-shadow: 2px 10px 22px 0 rgba(41, 78, 207, 0.33);
    }
  }
}

.case {
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding-bottom: 80px;
  .carousel-body {
    display: flex;
    align-items: center;
  }

  .synopsis {
    position: relative;
    display: flex;
    // width: 1398px;
    width: 1198px;
    height: 660px;
    margin: 0 auto;

    .synopsis-left {
      position: absolute;
      top: 0;
      left: 0;
      width: 500px;
      height: 660px;
      padding: 57px 52px 0;
      background: rgba(255, 255, 255, 0.66);

      .left-01 {
        display: flex;
        gap: 12px;

        .tamList {
          // width: 64px;
          height: 28px;
          padding: 4px 8px 4px 8px;
          color: rgba(0, 147, 42, 1);
          font-weight: 400;
          font-size: 12px;
          font-family: PingFang SC;
          line-height: 20px;
          text-align: left;
          background: rgba(232, 255, 234, 1);
          border-radius: 2px 0 0 0;
        }

        .title {
          color: rgba(29, 33, 41, 1);
          font-weight: 500;
          font-size: 20px;
          font-family: PingFang SC;
          line-height: 28px;
          text-align: left;
        }
      }

      .left-02 {
        margin: 16px 0 12px 0;
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 16px;
        font-family: PingFang SC;
        line-height: 24px;
        text-align: left;
      }

      .left-03 {
        color: rgba(78, 89, 105, 1);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 22px;
        text-align: left;
      }

      .left-04 {
        gap: 0;
        width: 100%;
        height: 1px;
        margin-top: 16px;
        background: rgba(201, 205, 212, 1);
      }

      .left-05 {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .image {
          gap: 0;
          width: 124px;
          height: 118px;
          background: rgba(255, 255, 255, 1);
        }
      }

      .left-06 {
        // padding-left: 66px;
        > ul > li {
          margin-top: 12px;
          color: #4e5969;
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC;
          line-height: 22px;
          text-align: left;
        }
      }
    }

    .synopsis-right {
      // width: 890px;
      width: 1398px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .instructions {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    height: 16px;
    margin-top: 16px;
  }

  .instructions-left {
    width: 20px;
    height: 40px;
    background: url(@/assets/images/idinside/case/icon-01.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .instructions-icon {
    width: 8px;
    height: 8px;
    background: rgba(148, 194, 255, 1);
    transform: rotate(45deg);
    cursor: pointer;
  }

  .instructions-icon-blue {
    width: 16px;
    height: 16px;
    background: rgba(22, 100, 255, 1);
    transform: rotate(45deg);
  }

  .instructions-right {
    width: 20px;
    height: 40px;
    background: url(@/assets/images/idinside/case/icon-02.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
}

:deep(.tele-carousel-indicator-wrapper) {
  display: none;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 84px;
  background: url(@/assets/images/idinside/product-bg.png) no-repeat;
  background-size: 100% 100%;

  .understand {
    position: relative;
    display: flex;
    width: 1398px;

    .learnmore {
      position: absolute;
      top: -76px;
      right: 0;
      color: rgba(22, 100, 255, 1);
      font-weight: 400;
      font-size: 20px;
      font-family: PingFang SC;
      line-height: 28px;
      text-align: left;
      cursor: pointer;
    }

    .img {
      gap: 0;
      width: 964px;
      height: 596px;
    }

    .introduce {
      gap: 0;
      width: 430px;
      height: 596px;
      padding: 40px 32px;
      background: rgba(255, 255, 255, 0.33);
      border: 1px 0 0 0;
      border: 1px solid;
      border-image-source: linear-gradient(
        179.1deg,
        #fff 0.72%,
        rgba(255, 255, 255, 0) 99.23%
      );

      .title {
        margin-bottom: 12px;
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 20px;
        //styleName: CN/标题/20-Medium-中;
        font-family: PingFang SC;
        line-height: 28px;
        text-align: left;
      }

      .company {
        color: rgba(134, 144, 156, 1);
        font-weight: 500;
        font-size: 16px;
        //styleName: CN/标题/16-Medium-小;
        font-family: PingFang SC;
        line-height: 24px;
        text-align: left;
      }

      .line {
        gap: 0;
        width: 366px;
        height: 1px;
        margin: 12px 0;
        background: rgba(201, 205, 212, 1);
      }

      .briefintroduction {
        color: rgba(78, 89, 105, 1);
        font-weight: 400;
        font-size: 14px;
        //styleName: CN/正文/14-Regular-大;
        font-family: PingFang SC;
        line-height: 22px;
        text-align: left;
      }

      .introduce-button {
        margin-top: 20px;
      }
    }
  }
}

.partners {
  display: flex;
  flex-direction: column;
  align-items: center;

  .service {
    display: flex;
    gap: 30px;

    .box-img-01 {
      background: url(@/assets/images/idinside/partners/partners-01.png)
        no-repeat;
      background-size: 100% 100%;
    }

    .box-img-02 {
      background: url(@/assets/images/idinside/partners/partners-02.png)
        no-repeat;
      background-size: 100% 100%;
    }

    .box-img-03 {
      background: url(@/assets/images/idinside/partners/partners-03.png)
        no-repeat;
      background-size: 100% 100%;
    }

    .box {
      width: 446px;
      height: 328px;
      padding: 48px;
      // background: linear-gradient(
      //   298.41deg,
      //   rgba(237, 245, 253, 0) 0%,
      //   #edf5fd 71.65%
      // );
      border-radius: 4px;

      .title {
        color: rgba(29, 33, 41, 1);
        font-weight: 500;
        font-size: 20px;
        //styleName: CN/标题/20-Medium-中;
        font-family: PingFang SC;
        line-height: 28px;
        text-align: left;
      }

      .text {
        width: 223px;
        margin-top: 12px;
        color: rgba(78, 89, 105, 1);
        font-weight: 400;
        font-size: 16px;
        font-family: PingFang SC;
        line-height: 24px;
        text-align: left;
      }
    }
  }
}

.unified {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 52px 0 40px 0;

  .unified-icon-01 {
    background: url(@/assets/images/idinside/unified/icon-01.png) no-repeat;
  }

  .unified-icon-02 {
    background: url(@/assets/images/idinside/unified/icon-02.png) no-repeat;
  }

  .unified-icon-03 {
    background: url(@/assets/images/idinside/unified/icon-03.png) no-repeat;
  }

  .unified-icon-04 {
    background: url(@/assets/images/idinside/unified/icon-04.png) no-repeat;
  }

  .unified-left {
    width: 20px;
    height: 15px;
    background-size: 100% 100%;
  }

  .unified-title {
    margin: 0 24px;
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
    font-size: 30px;
    font-family: PingFang SC;
    line-height: 38px;
    text-align: center;
  }

  .unified-title-white {
    color: rgba(255, 255, 255, 1);
  }

  .unified-right {
    width: 20px;
    height: 15px;
    background-size: 100% 100%;
  }
}

.unified-bottom {
  margin: 52px 0 0 0;
}

.partner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 130px;

  .img-list {
    display: flex;
    flex-wrap: wrap;
    gap: 32px 32px;
    width: 1398px;

    img {
      gap: 0;
      width: 254px;
      height: 254px;
      border-radius: 12px;
      box-shadow: 0 4px 80px 0 rgba(0, 75, 220, 0.12);
    }
  }
}
</style>
