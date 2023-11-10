<template>
  <div class="boxModal">
    <t-modal
      v-model:visible="visible"
      :width="642"
      :height="400"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> 应用授权 </template>
      <p style="margin-bottom: 20px">邀请企业成员使用</p>
      <t-select
        v-model="selectMemList"
        placeholder="请选择授权成员"
        allow-search
        allow-clear
        multiple
        style="width: 400px"
        size="large"
      >
        <template #empty>
          <span style="display: block; padding: 10px 20px">暂未找到该成员</span>
        </template>
        <t-option
          v-for="item in memberList"
          :key="item.memberId"
          :value="item.memberId"
          >{{ item.username }}
        </t-option>
      </t-select>
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import {
  apiMemberList,
  apiAuthMember,
  apiMemListByProduct,
} from '@/api/common';

const store = useUserStore();
const { userInfo, selectCompany } = storeToRefs(store);

const props = defineProps({
  productId: String,
});
const emit = defineEmits(['confirm', 'cancel']);
const visible = ref(true);
const memberList = ref<{ username: string; memberId: string }[] | []>([]); // 不在当前应用下的成员列表
const selectMemList = ref<string[]>([]);

// eslint-disable-next-line consistent-return
const onConfirm = (done: (closed: boolean) => void) => {
  if (!selectMemList.value.length) {
    return Message.warning(' 请选择要邀请的成员');
  }
  apiAuthMember({
    productId: props.productId,
    memberIds: selectMemList.value,
  })
    .then(() => {
      Message.success('邀请成功!');
      emit('confirm');
      done(true);
    })
    .catch(() => {
      done(false);
    });
};
onMounted(() => {
  apiMemberList({
    companyId: selectCompany.value?.companyId,
    productId: props.productId,
  })
    .then((data: any) => {
      memberList.value = data || [];
    })
    .catch(() => {});

  apiMemListByProduct({ productId: props.productId })
    .then((data: any) => {
      selectMemList.value = (data || []).map(
        (item: { username: string; memberId: string }) => item.memberId
      );
    })
    .catch(() => {});
});
</script>

<style scoped lang="less"></style>
