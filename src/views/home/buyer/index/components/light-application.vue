<template>
  <div class="light-application">
    <div class="head">
      <div class="title">标识轻应用</div>
      <t-space :size="15">
        <t-button type="outline" @click="goLightApplication">安装应用</t-button>
        <t-button type="primary" @click="goNewApplication">新建应用</t-button>
      </t-space>
    </div>
    <div class="app-body">
      <div v-for="(item, index) in appDataList" :key="index" class="card">
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
          当前无可用的标识轻应用
          <t-link
            :hoverable="false"
            style="margin-top: -2px"
            @click="goNewApplication"
          >
            去新建
          </t-link>
        </t-space>
      </t-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getServicePackage } from '@/api/buyer/overview';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);
const appDataList: Record<string, any> = ref([]);
const getPackageList = () => {
  const params = {
    companyId: selectCompany.value?.companyId,
  };
  getServicePackage(params).then((res: any) => {
    appDataList.value = res;
    console.log(res);
  });
};
// 跳转频道页 标识轻应用
const goLightApplication = () => {};
// 跳转轻流平台
const goNewApplication = () => {};

onMounted(async () => {
  //   getPackageList();
});
</script>

<style lang="less" scoped>
.light-application {
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
    gap: 24px;
    align-items: center;
    width: 270px;
    height: 82px;
    padding: 12px;
    background: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .card-img {
      width: 58px;
      height: 58px;
      border-radius: 2px;
    }

    .card-name {
      color: #223354;
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
      line-height: 24px;
    }
  }
}
</style>
