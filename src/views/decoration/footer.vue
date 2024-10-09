<!-- Footer信息配置 -->
<template>
  <div class="topInformation">
    <div class="title">Footer信息</div>
    <t-button type="primary" @click="handleSubmit2">配置Footer</t-button>
  </div>
  <div class="channel-box">
    <t-space direction="vertical" size="small" fill>
      <t-form
        ref="formRef"
        :model="form"
        label-align="right"
        :label-col-props="{
          flex: '100px',
          align: 'right',
        }"
      >
        <!-- 联系我们 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">联系我们</div>
          </t-space>
          <t-form-item field="businessCooperation" label="商务合作">
            {{ form.businessCooperation || '-' }}
          </t-form-item>
          <t-form-item field="businessServicesFile" label="商务服务">
            <t-image
              :src="`/server/web/file/download?name=${form.businessServicesFile}`"
              :preview="false"
              class="image-cls"
              width="100"
              height="100"
            ></t-image>
          </t-form-item>
        </div>
        <!-- 买家信息 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">买家信息</div>
          </t-space>
          <t-form-item field="buyerManualUrl" label="买家使用手册">
            <t-link
              v-if="form.buyerManualUrl"
              :hoverable="false"
              class="link-ellipsis"
              @click="openLink(form.buyerManualUrl)"
            >
              {{ form.buyerManualUrl }}
            </t-link>
            <div v-else>-</div>
          </t-form-item>
        </div>
        <!-- 卖家信息 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">卖家信息</div>
          </t-space>
          <t-form-item field="sellerManualUrl" label="卖家使用手册">
            <t-link
              v-if="form.sellerManualUrl"
              :hoverable="false"
              class="link-ellipsis"
              @click="openLink(form.sellerManualUrl)"
            >
              {{ form.sellerManualUrl }}
            </t-link>
            <div v-else>-</div>
          </t-form-item>
        </div>
        <!-- 移动端信息 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">移动端信息</div>
          </t-space>
          <t-form-item field="appletCodeFile" label="小程序或公众号二维码">
            <t-image
              :src="`/server/web/file/download?name=${form.appletCodeFile}`"
              :preview="false"
              class="image-cls"
              width="100"
              height="100"
            ></t-image>
          </t-form-item>
        </div>
        <!-- 友情链接 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">友情链接</div>
          </t-space>
          <t-row
            v-for="(item, index) of form.linkDetail"
            :key="index"
            :gutter="12"
          >
            <t-form-item
              class="form-item-08"
              field="buyerManualFile"
              label="名称"
            >
              {{ item.name || '-' }}
            </t-form-item>
            <t-form-item
              class="form-item-24"
              field="buyerManualFile"
              label="链接"
            >
              <t-link
                v-if="item.lintUrl"
                :hoverable="false"
                class="link-ellipsis"
                @click="openLink(item.lintUrl)"
              >
                {{ item.lintUrl }}
              </t-link>
              <div v-else>-</div>
            </t-form-item>
          </t-row>
        </div>
        <!-- 备案信息 -->
        <div class="form-box">
          <t-space class="space-bottom">
            <div class="vertical-line"></div>
            <div class="title-text">备案信息</div>
          </t-space>
          <t-form-item field="companyInfomation" label="公司信息">
            {{ form.companyInfomation || '-' }}
          </t-form-item>
          <t-form-item field="recordNumber" label="备案号">
            {{ form.recordNumber || '-' }}
          </t-form-item>
        </div>
      </t-form>
    </t-space>
  </div>
  <FooterEdit
    v-if="state.showFooterEdit"
    :visible="state.showFooterEdit"
    title="配置Footer"
    @on-cancel="handleEditCancel"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { apiFooterInfo } from '@/api/decoration/decoration-tools';
import FooterEdit from './decorationTools/footerEdit.vue';

const formRef = ref();

const form: Record<string, any> = ref({
  id: '', // id
  businessCooperation: '', // 商务合作
  businessServicesFile: '', // 商务服务文件id
  buyerManualFile: '', // 买家使用手册文件id
  sellerManualFile: '', // 卖家使用手册文件id
  appletCodeFile: '', // 小程序码文件id
  linkDetail: [
    {
      name: '',
      lintUrl: '',
    },
  ], // 友情链接
  companyInfomation: '', // 公司信息
  recordNumber: '', // 备案号
});

const state = reactive<{
  showFooterEdit: boolean;
}>({
  showFooterEdit: false,
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

const openLink = (url: string) => {
  if (!url) {
    return;
  }
  window.open(url);
};

const handleSubmit2 = () => {
  state.showFooterEdit = true;
};

const handleEditCancel = () => {
  state.showFooterEdit = false;
  FooterInfoDetails();
};

onMounted(() => {
  FooterInfoDetails();
});
</script>

<style scoped lang="less">
.topInformation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 24px;
  box-shadow: 0 1px 2px 0 #0000001a;

  .title {
    color: #1d2129;
    font-weight: 500;
    font-size: 16px;
    font-family: PingFang SC;
    line-height: 24px;
  }
}

.channel-box {
  width: 100%;
  height: 100%;
  padding: 24px;

  .form-box {
    // width: 685px;
    .space-bottom {
      margin-bottom: 12px;
    }

    .vertical-line {
      width: 4px;
      height: 14px;
      background: #1664ff;
      border-radius: 1px;
    }

    .title-text {
      font-weight: 500;
      font-size: 16px;
      font-style: normal;
      line-height: 24px;
    }

    .columns {
      display: flex;
      flex-direction: column;

      .tips {
        margin-top: 8px;
        color: #86909c;
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
      }
    }

    :deep(.tele-upload-list-item-content) {
      width: 25%;
    }

    :deep(.tele-upload-list-picture) {
      width: 100px;
      height: 100px;
    }
  }

  .link-ellipsis {
    max-width: 600px; /* 限制容器宽度 */
    overflow: hidden; /* 隐藏超出范围的内容 */
    white-space: nowrap; /* 禁止文本换行 */
    text-overflow: ellipsis; /* 使用省略号 */
  }
}

.form-item-08 {
  margin-bottom: 8px;
}

.form-item-24 {
  margin-bottom: 24px;
}
</style>
