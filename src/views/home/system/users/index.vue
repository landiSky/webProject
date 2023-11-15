<template>
  <div class="biox">
    <Userindex v-if="userInfoByCompany.primary !== AccountType.UNAUTH">
    </Userindex>
    <Dataoverview
      v-if="userInfoByCompany.primary === AccountType.UNAUTH"
      :title="'企业成员管理'"
    ></Dataoverview>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import Dataoverview from '@/components/dataoverview/index.vue';
import { useUserStore } from '@/store/modules/user';
import { AccountType } from '@/enums/common';
import { storeToRefs } from 'pinia';

import Userindex from './userindex.vue';

const userStore = useUserStore();
const { userInfo, selectCompany, userInfoByCompany }: Record<string, any> =
  storeToRefs(userStore);

const orderstatus = ref(0);
</script>

<style lang="less" scoped>
.biox {
  width: 100%;
  height: 100%;
}
</style>
