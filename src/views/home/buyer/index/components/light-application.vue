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
      <div
        v-for="(item, index) in appDataList"
        :key="index"
        class="card"
        @click="goLightFlow(item)"
      >
        <div class="card-img">
          <t-avatar
            :size="80"
            shape="square"
            class="font-pangmen"
            :style="{ backgroundColor: '#1664FF', fontSize: '44px' }"
          >
            {{ captureOne(item?.tagName) }}
          </t-avatar>
        </div>
        <div class="card-name">
          <t-typography-paragraph
            :ellipsis="{
              rows: 1,
              showTooltip: true,
            }"
            style="margin-bottom: 0; word-break: break-all"
          >
            {{ item?.tagName }}
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
import { useRouter } from 'vue-router';
import { appCreateRedirect, appAppPackageRedirect } from '@/api/buyer/overview';
import { getProductAppList } from '@/api/goods-manage';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const { userInfo, userInfoByCompany, selectCompany }: Record<string, any> =
  storeToRefs(userStore);
const router = useRouter();
const appDataList: Record<string, any> = ref([]);
const getPackageList = () => {
  const params = {
    companyId: selectCompany.value?.companyId,
  };
  getProductAppList(params).then((res: any) => {
    appDataList.value = res;
  });
};
const captureOne = (name: string) => {
  return name.substring(0, 1);
};
// 跳转频道页 标识轻应用
const goLightApplication = () => {
  router.push({ path: '/wow/lightApplicationMall' });
};
// 跳转轻流平台
const goNewApplication = () => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
  };
  appCreateRedirect(params).then((res: any) => {
    window.open(res);
  });
};

// 跳转到轻流 对应的应用包
const goLightFlow = (item: any) => {
  const params = {
    userId: userInfo.value?.id,
    companyId: selectCompany.value?.companyId,
    tagId: item?.tagId,
  };
  appAppPackageRedirect(params).then((res: any) => {
    window.open(res);
  });
};

onMounted(() => {
  getPackageList();
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
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 144px;
    height: 170px;
    padding: 24px 9px;
    background: #fff;
    border: 1px solid #e5e8ef;
    border-radius: 4px;

    .card-img {
      width: 80px;
      height: 80px;
      border-radius: 2px;
    }

    .card-name {
      width: 100%;
      color: #223354;
      font-weight: 500;
      font-size: 16px;
      font-family: PingFang SC;
      line-height: 24px;
      text-align: center;
    }
  }
}
</style>
