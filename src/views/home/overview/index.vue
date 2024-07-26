<template>
  <div class="overview">
    <!-- 个人信息展示 -->
    <div class="information">
      <img class="img" :src="avatar" alt="" />
      <div class="text">
        <div class="user">张伟</div>
        <div class="list">
          <div class="title">北京泰尔英福有限公司</div>
          <div class="line"></div>
          <div class="title">主帐号</div>
          <div class="buttom-blue">自建（2）</div>
          <div class="title">88.111.3223123、88.111.3223...</div>
          <div class="prefix">前缀管理>></div>
          <div class="line"></div>
          <div class="buttom-blue buttom-yellow">托管（2）</div>
          <div class="title">88.111.3223123、88.111.3223...</div>
          <div class="prefix">前缀管理>></div>
        </div>
      </div>
    </div>
    <!-- 标识服务开通 -->
    <div class="identifying">
      <div class="service">标识服务开通</div>
      <div class="idhub idhub-bg-01">
        <div class="idhub-title">IDHub自建流程引导</div>
        <div class="synopsis"
          >企业依托自有资源建设企业节点，自建企业节点所涉及带宽、存储以及计算等资源应满足未来一定时期业务发展需求，并支持弹性扩展。</div
        >
        <div class="idhub-steps">
          <div v-for="(item, index) in stepsList" :key="index" class="step">
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce" :class="item.introduce">{{
                  item.text
                }}</div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link :hoverable="false" @click="registerJump">
                    立即注册
                  </t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link :hoverable="false" @click="buyNow">立即购买</t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link :hoverable="false" @click="applyNow">立即申请</t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="idhub idhub-bg-02">
        <div class="idhub-title">IDHub托管流程引导</div>
        <div class="synopsis"
          >企业节点可以将标识解析相关数据和服务托管到二级节点，且受托部署单位会加强企业节点数据管理，保障企业合法权益。不论采用何种模式，企业节点数据原则上均归属于企业。</div
        >
        <div class="idhub-steps">
          <div
            v-for="(item, index) in trusteeshipList"
            :key="index"
            class="step"
          >
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce" :class="item.introduce">{{
                  item.text
                }}</div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link :hoverable="false">立即注册</t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link :hoverable="false">立即托管</t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link :hoverable="false"></t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 调试工具 -->
    <div class="tool">
      <div class="idhub idhub-width idhub-bg-03">
        <div class="idhub-title">调试工具IDTest</div>
        <div class="synopsis synopsis-width"
          >IDTest为标识应用开发者提供独立测试环境，支持开发者在此环境下进行功能测试、性能测试以及破坏性测试。IDTest具备以下特点及优势：一键申请沙盒企业前缀、多前缀同时服务、多标识用户绑定、服务调用问题快速定位、调用情况统计。</div
        >
        <div class="idhub-steps">
          <div v-for="(item, index) in toolList" :key="index" class="step">
            <div class="item-left">
              <div
                v-if="index !== 0"
                class="left-line"
                :class="item.classLeft"
              ></div>
              <img class="left-icon" :src="item.img" alt="" />
            </div>
            <div class="item-content">
              <div class="enterprise-prefix">{{ item.name }}</div>
              <div class="item-position">
                <div class="introduce introduce-width" :class="item.introduce">
                  {{ item.text }}
                </div>
                <div v-if="index === 0" class="buttom-body">
                  <t-link :hoverable="false">0元购买</t-link>
                </div>
                <div v-if="index === 1" class="buttom-body">
                  <t-link :hoverable="false">立即使用</t-link>
                </div>
                <div v-if="index === 2" class="buttom-body">
                  <t-link :hoverable="false"></t-link>
                </div>
                <div v-if="index === 3" class="buttom-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="manual">
        <div class="manual-top">
          <div class="title">帮助手册&开发参考</div>
          <t-link :hoverable="false" @click="moreJump">更多</t-link>
        </div>
        <div class="manual-ul">
          <ul>
            <li v-for="(item, index) in manualList" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <img
          class="manual-img"
          src="@/assets/images/overview/overview-04.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import avatar from '@/assets/images/overview/avatar.png';

import icon1 from '@/assets/images/overview/icon-01.png';
import icon2 from '@/assets/images/overview/icon-02.png';
import icon3 from '@/assets/images/overview/icon-03.png';
import icon4 from '@/assets/images/overview/icon-04.png';
import { Message } from '@tele-design/web-vue';

const stepsList = ref([
  {
    img: icon1,
    name: '注册企业前缀',
    text: '建设模式选择自建类型',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '开通企业节点服务',
    text: '购买标识解析企业节点应用',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
  {
    img: icon3,
    name: '申请License',
    text: '自建企业前缀可申请License 用于企业节点的部署配置',
    type: '',
    state: '',
    classLeft: 'left-line-02',
    introduce: 'introduce-03',
  },
  {
    img: icon4,
    name: '部署应用',
    text: '获取IDHub安装包，根据流程引导完成部署',
    type: '',
    state: '',
    classLeft: 'left-line-03',
    introduce: 'introduce-04',
  },
]);

const trusteeshipList = ref([
  {
    img: icon1,
    name: '注册企业前缀',
    text: '建设模式选择自建类型',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '申请托管',
    text: '将企业前缀进行托管申请',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
]);

const toolList = ref([
  {
    img: icon1,
    name: '开通沙盒服务',
    text: '0元购买标识解析沙盒应用',
    type: '',
    state: '',
    classLeft: '',
    introduce: 'introduce-01',
  },
  {
    img: icon2,
    name: '开发调试',
    text: '开发者可在此环境下进行功能测试、性能测试以及破坏性测试',
    type: '',
    state: '',
    classLeft: 'left-line-01',
    introduce: 'introduce-02',
  },
]);

const manualList = ref([
  {
    name: '二级节点OpenAPI',
    url: '',
  },
  {
    name: '企业节点OpenAPI',
    url: '',
  },
  {
    name: '标识解析SDK',
    url: '',
  },
  {
    name: '应用集成SOP',
    url: '',
  },
]);

// 立即注册
const registerJump = () => {};

// 立即购买
const buyNow = (obj: any) => {
  if (obj?.status === 1) {
    return true;
  }
  Message.warning('商品已下架，无法继续购买');
  return false;
};

// 立即申请
const applyNow = () => {};

// 立即托管
const instantHosting = () => {};

// 0元购买
const zeroPurchase = () => {};

// 立即使用
const immediateUse = () => {};

// 帮助手册/开发参考  更多
const moreJump = () => {};

// 前缀管理（前缀申请页面/托管申请页面）
const prefixJump = () => {};

// 查看订单
const viewOrder = () => {};

// 查看License
const viewLicense = () => {};

// 查看详情
const viewDetail = () => {};
</script>

<style lang="less" scoped>
.overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  background: url(@/assets/images/overview/overview-bg.png) no-repeat scroll top
    center #f2f3f8;
  background-size: 100% auto;
}

.information {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 1200px;
  min-height: 79px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(232, 233, 234, 1);

  .img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  .text {
    .user {
      color: rgba(34, 51, 84, 1);
      font-weight: 600;
      font-size: 15px;
      font-family: PingFang SC;
      line-height: 34px;
      text-align: left;
    }

    .list {
      display: flex;
      gap: 12px;
      align-items: center;

      .title {
        color: rgba(134, 144, 156, 1);
        font-weight: 400;
        font-size: 12px;
        //styleName: CN/正文/12-Regular-小;
        font-family: PingFang SC;
        line-height: 20px;
        text-align: left;
      }

      .line {
        width: 1;
        height: 12px;
        border: 1px solid rgba(140, 149, 167, 1);
      }

      .buttom-blue {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 22px;
        padding: 3px 8px;
        color: rgba(22, 100, 255, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        background: rgba(232, 244, 255, 1);
        border-radius: 2px;
      }

      .buttom-yellow {
        color: rgba(207, 117, 0, 1);
        background: rgba(255, 250, 232, 1);
      }

      .prefix {
        color: rgba(22, 100, 255, 1);
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
        text-align: left;
      }
    }
  }
}

.identifying {
  gap: 24px;
  width: 1200px;
  height: 752px;
  margin-top: 10px;
  padding: 0 0 30px 0;
  background: rgba(255, 255, 255, 0.8);
}

.service {
  gap: 10px;
  width: 1200px;
  height: 74px;
  padding: 20px 10px 20px 24px;
  color: rgba(29, 33, 41, 1);
  font-weight: 500;
  font-size: 24px;
  font-family: PingFang SC;
  line-height: 32px;
  text-align: left;
  background: linear-gradient(
    255.14deg,
    rgba(217, 223, 238, 0.48) 6.99%,
    #fff 57.76%
  );
  border: 1px 0 0 0;
  border: 1px solid rgba(232, 233, 234, 1);
}

.idhub {
  width: 1152px;
  height: 300px;
  margin: 24px auto 0;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(229, 232, 239, 1);
  border-radius: 4px;

  .idhub-title {
    color: rgba(29, 33, 41, 1);
    font-weight: 500;
    font-size: 24px;
    font-family: PingFang SC;
    line-height: 32px;
    text-align: left;
  }

  .synopsis {
    width: 904px;
    margin: 24px 0;
    color: rgba(78, 89, 105, 1);
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: left;
  }

  .idhub-steps {
    display: flex;

    .step {
      display: flex;
      gap: 8px;

      .item-left {
        display: flex;
        align-items: center;
        height: 24px;

        .left-line {
          gap: 0;
          width: 80px;
          height: 1px;
          margin-left: 16px;
          background: rgba(78, 89, 105, 1);
        }

        .left-line-01 {
          margin-left: 16px;
        }

        .left-line-02 {
          margin-left: 7px;
        }

        .left-line-03 {
          margin-left: 21px;
        }

        .left-icon {
          gap: 0;
          width: 28px;
          height: 28px;
        }
      }

      .item-content {
        position: relative;
        width: 100%;

        .item-position {
          position: absolute;
          top: 30px;
        }

        .enterprise-prefix {
          color: rgba(29, 33, 41, 1);
          font-weight: 500;
          font-size: 16px;
          //styleName: CN/标题/16-Medium-小;
          font-family: PingFang SC;
          line-height: 24px;
          text-align: left;
        }

        .introduce {
          width: 188px;
          margin-top: 10px;
          color: rgba(134, 144, 156, 1);
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC;
          line-height: 20px;
          text-align: left;
        }

        .introduce-01 {
          width: 140px;
        }

        .introduce-02 {
          width: 168px;
        }

        .introduce-03 {
          width: 126px;
        }

        .introduce-04 {
          width: 152px;
        }

        .buttom-body {
          margin-top: 10px;
        }
      }
    }
  }
}

.idhub-bg-01 {
  background-image: url(@/assets/images/overview/overview-01.png);
  background-size: 100% 100%;
}

.idhub-bg-02 {
  background-image: url(@/assets/images/overview/overview-02.png);
  background-size: 100% 100%;
}

.idhub-bg-03 {
  background-image: url(@/assets/images/overview/overview-03.png);
  background-size: 100% 100%;
}

.idhub-width {
  width: 850px;
  margin: 0;

  .synopsis-width {
    width: 806px;
  }
}

.introduce-width {
  width: 224px !important;
}

.tool {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin-top: 26px;
}

.manual {
  position: relative;
  gap: 10px;
  width: 320px;
  height: 300px;
  padding: 16px 24px;
  background: linear-gradient(127.99deg, #fff 34.51%, #e2eeff 100%);
  border: 1px solid rgba(229, 232, 239, 1);
  border-radius: 4px;

  .manual-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: rgba(78, 89, 105, 1);
      font-weight: 600;
      font-size: 20px;
      font-family: PingFang SC;
      line-height: 28px;
      text-align: left;
    }
  }

  .manual-ul {
    > ul > li {
      margin-top: 16px;
      margin-left: 20px;
      color: rgba(34, 51, 84, 1);
      font-weight: 400;
      font-size: 14px;
      font-family: PingFang SC;
      line-height: 20px;
      text-align: left;
      list-style-type: disc;
      cursor: pointer;
    }

    > ul > li::marker {
      color: rgba(217, 217, 217, 1);
    }
  }

  .manual-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 166px;
    height: 235px;
  }
}
</style>
