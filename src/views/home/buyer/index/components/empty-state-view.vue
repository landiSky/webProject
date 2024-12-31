<template>
  <div v-if="tabsApplication === '1'" class="empty-state-view">
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-01"></div>
        <div class="empty-page-desc">
          如需购买<span class="desc-blue">商城</span
          >内应用，账号需为企业主账号，同时需完成企业认证，「<span
            class="desc-blue desc-cursor"
            >去认证</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建标识轻应用
      </t-button>
    </div>
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-02"></div>
        <div class="empty-page-desc">
          如需购买<span class="desc-blue">标识轻应用</span
          >，账号需为企业主账号，同时需完成企业认证，「<span
            class="desc-blue desc-cursor"
            >去认证</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建企业数智化应用
      </t-button>
    </div>
  </div>
  <div v-if="tabsApplication === '2'" class="empty-state-view">
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-02"></div>
        <div class="empty-page-desc">
          <span class="desc-blue">创建标识轻应用</span>
          需完成标识轻应用服务开通，可前往开通「<span
            class="desc-blue desc-cursor"
            >前往</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建标识轻应用
      </t-button>
    </div>
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-03"></div>
        <div class="empty-page-desc">
          <span class="desc-blue">创建企业数智化应用</span>
          需完成标识轻应用服务开通，可前往开通「<span
            class="desc-blue desc-cursor"
            >前往</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建企业数智化应用
      </t-button>
    </div>
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-04"></div>
        <div class="empty-page-desc">
          <span class="desc-blue">创建SaaS</span>
          需完成企业认证，可前往认证「<span class="desc-blue desc-cursor"
            >前往</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建SaaS应用
      </t-button>
    </div>
    <div class="empty-page">
      <div class="empty-page-head">
        <div class="empty-page-img empty-page-img-05"></div>
        <div class="empty-page-desc">
          <span class="desc-blue">创建链接接入应用</span>
          需完成企业认证，可前往认证「<span class="desc-blue desc-cursor"
            >前往</span
          >」
        </div>
      </div>
      <t-button class="empty-page-button" type="outline">
        创建链接接入应用
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { appCreateRedirect } from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);

const emits = defineEmits(['confirm', 'cancel']);

const props = defineProps({
  tabsApplication: String,
});

onMounted(async () => {});
</script>

<style scoped lang="less">
.empty-state-view {
  display: flex;
  gap: 24px;
  justify-content: center;
  width: 100%;
  //   margin: 0 auto 24px;
  background-color: #fff;
  border-radius: 4px;

  .empty-page {
    display: flex;
    flex: 0 4 calc(25% - 12px);
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 268px;
    padding: 28px 24px 24px 24px;
    border-radius: 4px;
    box-shadow: 1px 2px 20px 0 #0f3d9914;

    .empty-page-head {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;

      .empty-page-img {
        width: 64px;
        height: 64px;
        background: red;
      }

      .empty-page-img-01 {
        background: url(@/assets/images/overview/icon-app-01.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-02 {
        background: url(@/assets/images/overview/icon-app-02.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-03 {
        background: url(@/assets/images/overview/icon-app-03.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-04 {
        background: url(@/assets/images/overview/icon-app-04.png) no-repeat;
        background-size: cover;
      }

      .empty-page-img-05 {
        background: url(@/assets/images/overview/icon-app-05.png) no-repeat;
        background-size: cover;
      }

      .empty-page-desc {
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;

        .desc-blue {
          color: #0e54d8;
        }

        .desc-cursor {
          cursor: pointer;
        }
      }
    }

    .empty-page-button {
      width: 100%;
    }
  }
}
</style>
