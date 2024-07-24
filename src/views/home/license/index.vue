<template>
  <div class="biox">
    <!-- 增加判断 是想两个权限用一个列表页面 如果想拆分也可以 userInfo.isAdmin true 管理员 false普通用户 -->
    <Setindex
      v-if="
        userInfoByCompany.primary !== AccountType.UNAUTH ||
        userInfo.isAdmin === true
      "
    >
    </Setindex>
    <Dataoverview
      v-if="
        userInfoByCompany.primary === AccountType.UNAUTH &&
        userInfo.isAdmin === false
      "
      :title="'License管理'"
    ></Dataoverview>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import { AccountType } from '@/enums/common';
import { storeToRefs } from 'pinia';

import Dataoverview from '@/components/dataoverview/index.vue';
import Setindex from './setindex.vue';

const userStore = useUserStore();
// userInfo 用户信息 userInfoByCompany 机构信息
const { userInfo, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
