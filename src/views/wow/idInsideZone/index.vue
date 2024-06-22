<template>
  <div>
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
              >IDInside合作计划”联合生态各方，打造百款产品、服务万家企业，实现产品、应用、场景和标识的预连接，助力政府、产业和企业数字化转型，加速标识贯通，最终形成百万量级节点的工业互联网标识服务网络</div
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 为什么要加入IDInside -->
    <div ref="testref" class="why-join">
      <div class="unified">
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
          <div class="text"
            >点击「<span class="text-button">立即报名</span>」
            <p>填写报名申请信息</p></div
          >
        </div>
        <div class="card card-02">
          <div class="icon">02</div>
          <div class="title">资料提交</div>
          <div class="text"
            >点击「<span class="text-button">立即上传</span>」
            上传完整的产品集成方案。</div
          >
        </div>
        <div class="card card-03">
          <div class="icon">03</div>
          <div class="title">集成开发</div>
          <div class="text"
            >点击「<span class="text-button">立即查看</span>」
            查看集成开发文档，下载应用集成开发包及开发测试报告模版。</div
          >
        </div>
        <div class="card card-04">
          <div class="icon">04</div>
          <div class="title">测评认证</div>
          <div class="text"
            >获取IDInside认证证书，请提供测试环境信息及开发测试报告「<span
              class="text-button"
              >立即上传</span
            >」
          </div>
        </div>
        <div class="card card-05">
          <div class="icon">05</div>
          <div class="title">运营推广</div>
          <div class="text">
            完成应用上架进行运营推广「<span class="text-button">立即上架</span
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
          height: '660px',
        }"
        :auto-play="true"
        animation-name="fade"
        show-arrow="never"
        indicator-position="outer"
        :current="carouselCurrent"
      >
        <t-carousel-item v-for="(item, index) in caseList" :key="index">
          <div class="synopsis">
            <div class="synopsis-left">
              <div class="left-01">
                <div class="tamList">能源行业</div>
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="left-02">案例介绍：</div>
              <div class="left-03">{{ item.intro }}</div>
              <div class="left-04"></div>
              <div class="left-02">取得成果：</div>
              <!-- 展示图片 -->
              <div class="left-05">
                <div class="image"></div>
                <div class="image"></div>
                <div class="image"></div>
                <div class="image"></div>
                <div class="image"></div>
                <div class="image"></div>
              </div>
              <!-- 展示文字 -->
              <!-- <div class="left-06">
                <ul>
                  <li>倾力打造的云计算品牌</li>
                  <li>面向全世界各个国家和地区的政府机构</li>
                  <li>倾力打造的云计算品牌</li>
                  <li>面向全世界各个国家和地区的政府机构</li>
                  <li>倾力打造的云计算品牌</li>
                  <li>面向全世界各个国家和地区的政府机构</li>
                </ul>
              </div> -->
            </div>
            <div class="synopsis-right">
              <img :src="item.img" alt="" />
              <div class="instructions">
                <div
                  class="instructions-left"
                  @click="about('Left', carouselCurrent)"
                ></div>
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
                <div
                  class="instructions-right"
                  @click="about('right', carouselCurrent)"
                ></div>
              </div>
            </div>
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
        <img :src="product1" alt="" class="img" />
        <div class="introduce">
          <div class="title">物易管智能系统</div>
          <div class="company"
            >深圳万里牛科技有限公司深圳万里牛科技有限公司...</div
          >
          <div class="line"></div>
          <div class="briefintroduction">
            通过物易管基于工业大数据、AI和工业机理融合算法技术打造的旋转设备预测性维护一体化产品，构筑基于工业互联网平台的“低成本、高效率、高质量”的设备精准运维数字化服务平台。主要面向发电机、涡轮机、泵、电动机、发动机、压缩机等设备的预测维护，覆盖钢铁冶炼、石油化工、水泥、火电、啤酒饮料、煤炭、水务等行业领域，赋能企业实现最经济的按需维护。
          </div>
          <t-button type="primary" class="introduce-button"
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

import advantage1 from '@/assets/images/idinside/whyjoin/advantage-01.png';
import advantage2 from '@/assets/images/idinside/whyjoin/advantage-02.png';
import advantage3 from '@/assets/images/idinside/whyjoin/advantage-03.png';
import advantage4 from '@/assets/images/idinside/whyjoin/advantage-04.png';

import case0101 from '@/assets/images/idinside/case/case-01-01.png';

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

import WowFooter from '../components/wowFooter/index.vue';

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
          '通过公众号（泰尔英福等）、核心央媒报道（光明网等） 将品牌信息传递给大众',
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
    if (currentScroll < 400) {
      // 当前滚动位置到达testref的时候，显示div（100作为调整用）
      testShow.value = true;
    } else {
      testShow.value = false;
    }
  });
};

const caseList = ref([
  {
    title: '双碳大脑',
    intro:
      '双碳智慧大脑创新中心是服务于政府及企业，依托星火·链网以碳账户为基础实现横纵数据的融会贯通、可信可用，科学计算、监测碳排，辅助政府智能决策。',
    img: case0101,
  },
  {
    title: '星火可信溯源',
    intro:
      '道地中药材需进行产品种植加工，销售等进行溯源，对符合溯源标准产品授予可信溯源标识二维码。',
    img: case0101,
  },
  {
    title: '晓数通',
    intro:
      '晓数通是一款为企业运管人员提供的运营管理工具，需将企业多源异构数据封装成各业务能力台账，实现跨部门数据在线化集成分析，降低企业数据管理成本',
    img: case0101,
  },
  {
    title: 'CPS融通互联平台',
    intro:
      '为推进智能制造的无缝连接，企业需同步并共享设计、采购、生产、销售等各环节的系统数据，打破信息孤岛，实现全价值链关键业务流程的整合。',
    img: case0101,
  },
]);
const carouselCurrent: Record<string, any> = ref(1);
const currentClick = (num: number) => {
  carouselCurrent.value = num;
};

const about = (name: string, num: number) => {
  if (name === 'Left') {
    carouselCurrent.value = num === 1 ? num : num - 1;
  } else if (name === 'right') {
    carouselCurrent.value = num === 4 ? num : num + 1;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="less" scoped>
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
        transition: all 0.1s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.15s ease;
      }
    }

    .advantage-list:nth-child(2) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.2s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.25s ease;
      }
    }

    .advantage-list:nth-child(3) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.3s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.35s ease;
      }
    }

    .advantage-list:nth-child(4) {
      .img {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.4s ease;
      }

      .text {
        transform: translateY(0%) !important; //滚动后的位置
        opacity: 1 !important; //滚动后显现
        transition: all 0.45s ease;
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
    height: 406px;
    margin-top: 74px;
    overflow-x: clip;
    background: url(@/assets/images/idinside/whyjoin/advantage-bg.png) no-repeat;
    background-size: 100% 100%;

    .advantage-list {
      margin-top: -82px;

      .img {
        width: 264px;
        height: 266px;
      }

      .text {
        width: 320px;

        .title {
          display: flex;
          align-items: center;
          margin-top: 20px;
          margin-bottom: 12px;

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
      border: 1px solid;
      border-radius: 4px;
      border-image-source: linear-gradient(
        180deg,
        #fff 0%,
        rgba(255, 255, 255, 0) 100%
      );
      box-shadow: 2px 10px 22px 0 rgba(41, 78, 207, 0.33);
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
  }
}

.case {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 100px;

  .synopsis {
    display: flex;
    width: 1398px;
    height: 660px;

    .synopsis-left {
      width: 500px;
      padding: 57px 52px 0;
      background: rgba(255, 255, 255, 0.66);

      .left-01 {
        display: flex;
        gap: 12px;

        .tamList {
          width: 64px;
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
        padding-left: 66px;

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
      position: relative;
      width: 890px;

      img {
        width: 100%;
        height: 100%;
      }

      .instructions {
        position: absolute;
        bottom: 93px;
        left: 144px;
        display: flex;
        gap: 12px;
        align-items: center;

        .instructions-left {
          width: 5px;
          height: 10px;
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
          width: 5px;
          height: 10px;
          background: url(@/assets/images/idinside/case/icon-02.png) no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
    }
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
    display: flex;
    width: 1398px;

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
