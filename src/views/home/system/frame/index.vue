<template>
  <div class="biox">
    <Frameindex v-if="userInfoByCompany.primary !== AccountType.UNAUTH">
    </Frameindex>
    <Dataoverview
      v-if="userInfoByCompany.primary === AccountType.UNAUTH"
      :title="'企业架构管理'"
    ></Dataoverview>
  </div>
</template>

<script lang="ts" setup>
import Dataoverview from '@/components/dataoverview/index.vue';
import { useUserStore } from '@/store/modules/user';
import { AccountType } from '@/enums/common';
import { storeToRefs } from 'pinia';

import Frameindex from './frameindex.vue';

const userStore = useUserStore();
const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
