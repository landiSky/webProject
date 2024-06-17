<template>
  <div>
    <!-- IDInside合作计划 -->
    <div></div>
    <!-- 为什么要加入IDInside -->
    <div></div>
    <!-- 如何加入IDInside -->
    <div></div>
    <!-- 优秀认证案例 -->
    <div>
      <div class="unified">
        <div class="unified-left"></div>
        <div class="unified-title">优秀认证案例</div>
        <div class="unified-right"></div>
      </div>
    </div>
    <!-- 优秀认证产品 -->
    <div class="product">
      <div class="unified">
        <div class="unified-left"></div>
        <div class="unified-title">优秀认证产品</div>
        <div class="unified-right"></div>
      </div>
      <div class="understand">
        <div class="img">图片</div>
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
        <div class="unified-left"></div>
        <div class="unified-title">合作伙伴类型</div>
        <div class="unified-right"></div>
      </div>
      <div class="service">
        <div class="box">
          <div class="title">硬件服务</div>
          <div class="text">在工业领域有自主知识产权的硬件产品服务商</div>
        </div>
        <div class="box">
          <div class="title">软件服务</div>
          <div class="text">在工业领域有自主知识产权的软件产品服务商</div>
        </div>
        <div class="box">
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
        <div class="unified-left"></div>
        <div class="unified-title">伙伴代表</div>
        <div class="unified-right"></div>
      </div>
      <div class="img-list">
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
        <div>122</div>
      </div>
    </div>
    <WowFooter></WowFooter>
  </div>
</template>

<script lang="ts" setup>
import WowFooter from '../components/wowFooter/index.vue';
</script>

<style lang="less" scoped>
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(150, 233, 16);

  .understand {
    display: flex;
    width: 1398px;

    .img {
      gap: 0;
      width: 964px;
      height: 596px;
      background: rgb(0, 60, 255);
      opacity: 0;
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
      opacity: 0;

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
        opacity: 0;
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
  background: rgb(205, 255, 216);

  .service {
    display: flex;
    gap: 30px;

    .box {
      width: 446px;
      height: 328px;
      padding: 48px;
      background: linear-gradient(
        298.41deg,
        rgba(237, 245, 253, 0) 0%,
        #edf5fd 71.65%
      );
      border-radius: 4px;
      opacity: 0;

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

  .unified-left {
    width: 20px;
    height: 15px;
    background: rebeccapurple;
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

  .unified-right {
    width: 20px;
    height: 15px;
    background: blue;
  }
}

.partner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 130px;
  background: blanchedalmond;

  .img-list {
    display: flex;
    flex-wrap: wrap;
    gap: 32px 32px;
    width: 1398px;

    div {
      gap: 0;
      width: 254px;
      height: 254px;
      background: rgb(58, 212, 166);
      border-radius: 12px;
      box-shadow: 0 4px 80px 0 rgba(0, 75, 220, 0.12);
      opacity: 0;
    }
  }
}
</style>
