<template>
  <div class="wrap">
    <div class="productIntro">
      <div class="baseInfo">
        <div class="left">
          <div class="bigImg">
            <img
              src="https://img13.360buyimg.com/n1/s450x450_jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif"
            />
          </div>

          <ul class="imgList">
            <li
              ><img
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/115168/22/40004/81804/6536985aFad2f6759/146058ce4b8221d6.jpg.avif"
                width="54"
                height="54"
            /></li>
            <li
              ><img
                alt="OPPO 一加 Ace 2 Pro 16GB+512GB 钛空灰 高通第二代骁龙 8 旗舰芯片 长寿版 150W 超级闪充 5G游戏性能手机"
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/163744/5/40242/82186/64db82a5Ffa15c5cc/2befcc69725a22dd.jpg.avif"
                data-url="jfs/t1/163744/5/40242/82186/64db82a5Ffa15c5cc/2befcc69725a22dd.jpg.avif"
                data-img="1"
                width="54"
                height="54"
            /></li>
            <li class="img-hover"
              ><img
                alt="OPPO 一加 Ace 2 Pro 16GB+512GB 钛空灰 高通第二代骁龙 8 旗舰芯片 长寿版 150W 超级闪充 5G游戏性能手机"
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif"
                data-url="jfs/t1/112503/16/27726/52988/64dc9a7cF0e258422/18c750bd3af78ff1.jpg.avif"
                data-img="1"
                width="54"
                height="54"
            /></li>
            <li class=""
              ><img
                alt="OPPO 一加 Ace 2 Pro 16GB+512GB 钛空灰 高通第二代骁龙 8 旗舰芯片 长寿版 150W 超级闪充 5G游戏性能手机"
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/102528/34/36773/44185/64db377cF64ce8f22/8e0604d47fafa774.jpg.avif"
                data-url="jfs/t1/102528/34/36773/44185/64db377cF64ce8f22/8e0604d47fafa774.jpg.avif"
                data-img="1"
                width="54"
                height="54"
            /></li>
            <li class=""
              ><img
                alt="OPPO 一加 Ace 2 Pro 16GB+512GB 钛空灰 高通第二代骁龙 8 旗舰芯片 长寿版 150W 超级闪充 5G游戏性能手机"
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/128950/17/38984/28802/64db376fF8047295f/2ff219061faf6d35.jpg.avif"
                data-url="jfs/t1/128950/17/38984/28802/64db376fF8047295f/2ff219061faf6d35.jpg.avif"
                data-img="1"
                width="54"
                height="54"
            /></li>

            <li
              ><img
                src="//img13.360buyimg.com/n5/s54x54_jfs/t1/84805/5/37021/24570/64db376fF79637b28/f5edd3e107e27915.jpg.avif"
                width="54"
                height="54"
            /></li>
          </ul>
        </div>
        <div class="right">
          <div class="header">
            <span class="productName">名称</span>
            <!-- <span class="tag">标签一</span> -->
          </div>
          <div class="description">描述</div>
          <div class="price">
            <span>产品价格:</span>
            <span>￥2222</span>
          </div>
          <div class="custom">
            <span class="label">版本:</span>
            <span>
              <t-radio-group type="button">
                <t-radio value="Beijing">标准版</t-radio>
                <t-radio value="Shanghai">企业版</t-radio>
              </t-radio-group>
            </span>
          </div>
          <div class="custom">
            <span class="label">账号数:</span>
            <span>
              <t-radio-group type="button">
                <t-radio value="Beijing">1个账号</t-radio>
                <t-radio value="Shanghai">20个账号</t-radio>
                <t-radio value="Shanghai">50个账号</t-radio>
              </t-radio-group>
            </span>
          </div>
          <div class="custom">
            <span class="label">选择时长:</span>
            <span>
              <t-radio-group type="button">
                <t-radio value="Beijing">6个月</t-radio>
                <t-radio value="Shanghai">12个月</t-radio>
                <t-radio value="Shanghai">不限</t-radio>
              </t-radio-group>
            </span>
          </div>
          <t-button type="primary" size="large" style="width: 296px"
            >立即购买</t-button
          >
        </div>
      </div>
      <div class="intro"></div>
    </div>
  </div>
  <WowFooter></WowFooter>
</template>

<script lang="ts" setup>
import WowFooter from '@/views/wow/components/wowFooter/index.vue';
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;

  .productIntro {
    width: 1176px;
    margin-top: 32px;

    .baseInfo {
      display: flex;
      align-items: start;
      width: 100%;
      margin-bottom: 16px;
      padding: 24px;
      background-color: #fff;
      border-radius: 4px;

      .left {
        margin-right: 32px;

        .bigImg {
          width: 450px;
          height: 450px;
        }

        .imgList {
          display: flex;
          margin-top: 14px;

          img {
            width: 68px;
            height: 68px;
            margin-right: 8px;
            border-radius: 4px;

            &:hover {
              box-shadow: 0 0 0 2px #1664ff;
            }
          }
        }
      }

      .right {
        flex: 1;

        .header {
          margin-bottom: 16px;
          color: #1d2129;
          font-weight: 500;
          font-size: 24px;
          line-height: 32px;
        }

        .description {
          margin-bottom: 42px;
          color: #1d2129;
          line-height: 22px; /* 157.143% */
        }

        .price {
          margin-bottom: 20px;
          padding: 12px;
          line-height: 22px;
          background: #ffece8;
          border-radius: 4px;

          span:first-child {
            margin-right: 24px;
            color: #4e5969;
          }

          span:last-child {
            color: #e63f3f;
            font-weight: 700;
            font-size: 20px;
          }
        }

        .custom {
          margin-bottom: 12px;
          padding: 4px 12px;

          &:last-of-type {
            margin-bottom: 42px;
          }

          .label {
            display: inline-block;
            width: 60px;
            margin-right: 16px;
          }
        }
      }
    }
  }
}
</style>
