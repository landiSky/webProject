<template>
  <div class="biox">
    <Orderindex> </Orderindex>
    <!-- <Dataoverview
      v-if="
        userInfoByCompany.nodeStatus !== 1 || userInfoByCompany.nodeStatus !== 1
      "
    ></Dataoverview> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import Dataoverview from '@/components/dataoverview/index.vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

import Orderindex from './orderindex.vue';

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
