<template>
  <t-page-header :title="userInfo.nickName" flex @back="goback">
    <template #breadcrumb>
      <t-breadcrumb :routes="breadcrumbList" />
    </template>
    <div>这里是用户详情</div>
  </t-page-header>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const userInfo = ref<{ [name: string]: any }>({
  nickName: '张三'
});


const breadcrumbList = reactive([
  {
    path: null,
    label: '组织架构',
  },
  {
    path: '/organization/user',
    label: '用户与部门',
  },
  {
    path: '',
    label: '用户管理',
  },
  {
    path: null,
    label: '用户详情',
  },
]);

const goback = () => {
  router.go(-1);
};


</script>

<style lang="less" scoped>
</style>
