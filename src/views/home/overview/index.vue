<template>
  <div class="biox">
    <Setindex v-if="userInfoByCompany.primary !== AccountType.UNAUTH">
    </Setindex>
    <Dataoverview
      v-if="userInfoByCompany.primary === AccountType.UNAUTH"
      :title="'概览'"
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
  overflow-y: auto;
}
</style>
