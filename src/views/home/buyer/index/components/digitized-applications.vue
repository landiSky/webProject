<template>
  <div class="digitized-applications">
    <div class="head">
      <div class="title">企业数智化应用</div>
      <t-space :size="15">
        <t-button type="primary" @click="showAddDrawer">
          添加企业数智化应用
        </t-button>
      </t-space>
    </div>
    <div class="app-body">
      <div
        v-for="(item, index) in appDataList"
        :key="index"
        class="card"
        @click="goLightFlow(item)"
      >
        <div class="card-img">
          <img :src="`/server/web/file/download?name=${item.logo}`" alt="" />
        </div>
        <div class="card-name">
          <t-typography-paragraph
            :ellipsis="{
              rows: 1,
              showTooltip: true,
            }"
            style="margin-bottom: 0"
          >
            {{ item?.name }}
          </t-typography-paragraph>
        </div>
      </div>
      <t-empty
        v-if="!appDataList?.length"
        :style="{ paddingTop: '20px', paddingBottom: '20px' }"
      >
        <template #image>
          <icon-no-data :size="120" />
        </template>
        <t-space>
          当前无可用的企业数智化应用
          <t-link
            :hoverable="false"
            style="margin-top: -2px"
            @click="showAddDrawer"
          >
            去添加
          </t-link>
        </t-space>
      </t-empty>
    </div>
  </div>

  <AddForm
    v-if="state.showDrawer"
    :visible="state.showDrawer"
    title="添加企业数智化应用"
    @on-confirm="handleDrawerConfirm"
    @on-cancel="handleDrawerCancel"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import {
  apiLoginQingFlow,
  getCompanyNumeberIntelligence,
} from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import AddForm from './addForm.vue';

const userStore = useUserStore();
const { userInfo, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
const appDataList: Record<string, any> = ref([]);
const state = reactive<{
  showDrawer: boolean;
}>({
  showDrawer: false,
});

const getDigitizedApplicationsList = () => {
  const params = {
    companyId: userInfoByCompany.value?.companyId,
  };
  getCompanyNumeberIntelligence(params).then((res: any) => {
    appDataList.value = res;
    console.log(res);
  });
};
// 跳转到轻流 对应的应用包
const goLightFlow = (item: any) => {
  console.log(item);
  const params = {
    userId: userInfo.value?.id,
    wsId: item?.qingFlowPortalId,
  };
  apiLoginQingFlow(params).then((res: any) => {
    console.log('轻流登录接口返回', res);
  });
};
const showAddDrawer = () => {
  state.showDrawer = true;
};

const handleDrawerCancel = () => {
  state.showDrawer = false;
};

const handleDrawerConfirm = () => {
  handleDrawerCancel();
  getDigitizedApplicationsList();
};

onMounted(async () => {
  getDigitizedApplicationsList();
});
</script>

<style lang="less" scoped>
.digitized-applications {
  width: 1200px;
  margin: 0 auto 24px;
  padding: 16px 24px 24px;
  background: #fff;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

  .title {
    color: #223354;
    font-weight: 500;
    font-size: 20px;
    font-family: PingFang SC;
    line-height: 28px;
  }
}

.app-body {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;

  .card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 144px;
    height: 176px;
    padding: 25px 9px;
    background: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .card-img {
      width: 84px;
      height: 84px;
      border-radius: 2px;
    }

    .card-name {
      width: 100%;
      color: #223354;
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
      line-height: 24px;
    }
  }
}
</style>
