<template>
  <div class="footer">
    <div class="header">
      <div class="headerWraper">
        <span>IDSphere</span>
        <t-divider direction="vertical"></t-divider>
        <span>应用运营平台</span>
      </div>
    </div>
    <div class="content">
      <div class="navigator">
        <div class="item">
          <span class="title">联系我们</span>
          <span class="subitem">商务合作：marketing@teleinfo.cn</span>
          <span class="subitem"
            >商务服务：
            <picture>
              <!-- 可能是一些对兼容性有要求的，但是性能表现更好的现代图片格式-->
              <source
                class="qrcode"
                :srcset="getImgPath('avif')"
                type="image/avif"
              />

              <!-- 最终的兜底方案-->
              <img class="qrcode" :src="getImgPath('jpg')" />
            </picture>
          </span>
        </div>
        <div class="item">
          <span class="title">新手上路</span>
          <span class="subitem">新手指南</span>
        </div>
        <div class="item">
          <span class="title">我是买家</span>
          <span class="subitem">使用服务</span>
        </div>
        <div class="item">
          <span class="title">我是商家</span>
          <span class="subitem">入驻指南</span>
          <span class="subitem">管理指南</span>
        </div>
      </div>
      <div class="copyright">
        <span>Copyright © 2016-2020 北京泰尔英福科技有限公司</span>
        <span>京ICP备12003601号-6</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import qrcodeJpg from '@/assets/images/wow/index/teleinfo-qrcode.jpg';
import qrcodeAvif from '@/assets/images/wow/index/teleinfo-qrcode.avif';

const getImgPath = (type: string) => {
  const imgObj: Record<string, any> = {
    jpg: qrcodeJpg,
    avif: qrcodeAvif,
  };
  return imgObj[type];
};
</script>

<style lang="less" scoped>
.footer {
  .header {
    height: 92px;
    background-image: url('@/assets/images/wow/index/footer_header_bg.png');
    background-position: center center;
    background-size: cover;

    .headerWraper {
      display: flex;
      align-items: center;
      width: 1176px;
      height: 92px;
      margin: 0 auto;
      color: #fff;
      font-weight: 500;
      font-size: 30px;
      line-height: 38px; /* 126.667% */

      :deep(.tele-divider-vertical) {
        margin: 0 28px;
      }
    }
  }

  .content {
    padding: 57px 133px 0 133px;
    background-image: url('@/assets/images/wow/index/footer_content_bg.svg');
    background-size: cover;

    .navigator {
      display: flex;
      width: 1176px;
      margin: 0 auto 80px auto;

      .item {
        display: flex;
        flex-direction: column;
        margin-right: 130px;

        .title {
          margin-bottom: 24px;
          color: #1d2129;
          font-weight: 500;
          font-size: 20px;
          line-height: 28px;
        }

        .subitem {
          display: flex;
          margin-bottom: 20px;
          color: #4e5969;
          font-size: 14px;
          line-height: 22px;

          .qrcode {
            width: 64px;
            height: 64px;
          }
        }
      }
    }

    .copyright {
      display: flex;
      justify-content: space-between;
      width: 1176px;
      margin: 24px auto 20px auto;
      padding-top: 22px;
      color: #1d2129;
      font-size: 12px;
      line-height: 18px;
      border-top: 1px solid #c1c1c1;
    }
  }
}
</style>
