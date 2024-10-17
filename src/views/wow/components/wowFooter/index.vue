<template>
  <div class="footer">
    <div class="content">
      <div class="navigator">
        <div class="item">
          <span class="title">联系我们</span>
          <span class="subitem">
            <span>技术支持：</span>
            <span v-if="form.technicalSupport" class="subitem-email">
              {{ form.technicalSupport }}
            </span>
          </span>
          <span class="subitem">
            <span>商务合作：</span>
            <span v-if="form.businessCooperation" class="subitem-email">
              {{ form.businessCooperation }}
            </span>
          </span>
          <span class="subitem"
            >商务服务：
            <img
              v-if="form.businessServicesFile"
              class="qrcode"
              :src="`/server/web/file/download?name=${form.businessServicesFile}`"
            />
          </span>
        </div>
        <div class="item">
          <span class="title">买家信息</span>
          <span
            v-if="form.buyerManualUrl"
            class="subitem onCursor"
            @click="onClickOpen(form.buyerManualUrl)"
            >买家使用手册</span
          >
        </div>
        <div class="item">
          <span class="title">卖家信息</span>
          <span
            v-if="form.sellerManualUrl"
            class="subitem onCursor"
            @click="onClickOpen(form.sellerManualUrl)"
            >卖家使用手册</span
          >
        </div>
        <div class="item item-width">
          <span class="title">友情链接</span>
          <div
            v-for="item in form.linkDetail"
            :key="item"
            class="subitem width-ellipsis"
            @click="onClickOpen(item?.lintUrl)"
            >{{ item?.name }}</div
          >
        </div>
        <div class="item">
          <span class="title">移动端信息</span>
          <img
            v-if="form.appletCodeFile"
            class="MobileQRcode"
            :src="`/server/web/file/download?name=${form.appletCodeFile}`"
          />
        </div>
      </div>
      <div class="copyright">
        <span>
          {{ form.companyInfomation }}
        </span>
        <span>
          {{ form.recordNumber }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiFooterInfo } from '@/api/decoration/decoration-tools';

const form: Record<string, any> = ref({
  id: '', // id
  technicalSupport: '', // 技术支持
  businessCooperation: '', // 商务合作
  businessServicesFile: '', // 商务服务文件id
  buyerManualFile: '', // 买家使用手册文件id
  sellerManualFile: '', // 卖家使用手册文件id
  appletCodeFile: '', // 小程序码文件id
  linkDetail: [], // 友情链接
  companyInfomation: '', // 公司信息
  recordNumber: '', // 备案号
});

const FooterInfoDetails = async () => {
  await apiFooterInfo()
    .then((res: any) => {
      if (res.code !== 200) {
        return;
      }
      const linkDetail =
        (res.data.linkDetail && JSON.parse(res.data.linkDetail)) || [];

      form.value = {
        ...res.data,
        linkDetail,
      };
    })
    .catch(() => {});
};

const onClickOpen = (url: string) => {
  window.open(url);
};

onMounted(() => {
  FooterInfoDetails();
});
</script>

<style lang="less" scoped>
.footer {
  padding: 9;

  .content {
    height: 318px;
    padding: 32px 0;
    background-image: url('@/assets/images/wow/index/footer_content_bg.png');
    background-size: cover;

    .navigator {
      display: flex;
      width: 1328px;
      margin: 0 auto;

      .item {
        display: flex;
        flex-direction: column;
        margin-right: 95px;

        .title {
          margin-bottom: 8px;
          color: #fff;
          font-weight: 500;
          font-size: 16px;
          font-family: PingFang SC;
          line-height: 24px;
          text-align: left;
        }

        .subitem {
          display: flex;
          margin-bottom: 8px;
          color: #ffffffe5;
          font-weight: 400;
          font-size: 14px;
          font-family: PingFang SC;
          line-height: 22px;
          text-align: left;

          .subitem-email {
            width: 242px;
            height: 22px;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
          }

          .qrcode {
            width: 90px;
            height: 90px;
            object-fit: cover;
          }
        }

        .onCursor:hover {
          color: #4086ff;
          cursor: pointer;
        }

        .width-ellipsis {
          width: fit-content;
          max-width: 300px;
          height: 22px;
          overflow: hidden;
          white-space: normal;
          text-overflow: ellipsis;

          &:hover {
            color: #4086ff;
            cursor: pointer;
          }
        }

        .MobileQRcode {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }
      }

      .item-width {
        width: 300px;
      }

      .item:last-of-type {
        margin-right: 40px;
      }
    }

    .copyright {
      display: flex;
      justify-content: space-between;
      width: 1328px;
      margin: 60px auto 32px auto;
      padding-top: 24px;
      color: #fff;
      font-weight: 400;
      font-size: 12px;
      font-family: PingFang SC;
      line-height: 18px;
      text-align: left;
      border-top: 1px solid #c9cdd4;
    }
  }
}
</style>
