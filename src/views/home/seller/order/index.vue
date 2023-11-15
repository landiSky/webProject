<template>
  <div class="biox">
    <Orderindex v-if="userInfoByCompany.primary !== AccountType.UNAUTH">
    </Orderindex>
    <Dataoverview
      v-if="userInfoByCompany.primary === AccountType.UNAUTH"
      :title="orderstatus"
    ></Dataoverview>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Dataoverview from '@/components/dataoverview/index.vue';

import { AccountType } from '@/enums/common';

import { useUserStore } from '@/store/modules/user';

import Orderindex from './orderindex.vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);
const orderstatus = ref('订单管理');
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
