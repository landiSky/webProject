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
          <span class="subitem">商务合作：23456789q0wewretrytuyiuo</span>
          <span class="subitem">商务服务：23456789q0wewretrytuyiuo</span>
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

<script lang="ts" setup></script>

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
          margin-bottom: 20px;
          color: #4e5969;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }

    .copyright {
      display: flex;
      justify-content: space-between;
      width: 1176px;
      margin: 24px auto 20px auto;
      color: #1d2129;
      font-size: 12px;
      line-height: 18px;
      border-top: 1px solid #c1c1c1;
    }
  }
}
</style>
