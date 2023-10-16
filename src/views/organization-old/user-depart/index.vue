<template>
  <t-page-header flex title="用户与部门" :show-back="false" class="user-depart">
    <template #breadcrumb>
      <t-breadcrumb class="container-breadcrumb">
        <t-breadcrumb-item
          v-for="item in ['组织架构', '用户与部门']"
          :key="item"
          size="large"
        >
          {{ item }}
        </t-breadcrumb-item>
      </t-breadcrumb>
    </template>

    <span>
      这里是用户页面
      <t-link @click="() => gotoDetail()"> 跳转到详情 </t-link>
    </span>
  </t-page-header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const gotoDetail = () => {
  router.push({
    name: 'user-detail',
    params: { id: 2 },
  });
};
</script>

<style lang="less" scoped>
.user-depart {
  min-height: 0;
  padding-bottom: 0; // 为了左侧树右边框可以到底
}
</style>
