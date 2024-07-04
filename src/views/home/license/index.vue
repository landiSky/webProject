<template>
  <div class="biox">
    <Setindex v-if="userInfoByCompany.primary !== AccountType.UNAUTH">
    </Setindex>
    <Dataoverview
      v-if="userInfoByCompany.primary === AccountType.UNAUTH"
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
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
