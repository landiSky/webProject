<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="400"
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

    <template #footer>
      <t-button @click="emit('cancel')">取消</t-button>
      <t-button type="outline" @click="emit('confirm')">跳过</t-button>
      <t-button type="primary" @click="onConfirm">确定</t-button>
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { apiMemberList, apiAuthMember } from '@/api/common';

const store = useUserStore();
const { userInfo } = storeToRefs(store);

const props = defineProps({
  productId: String,
});
const emit = defineEmits(['confirm', 'cancel']);
const visible = ref(false);
const memberList = ref<{ username: string; memberId: string }[] | []>([]); // 不在当前应用下的成员列表
const selectMemList = ref<string[]>([]);

// eslint-disable-next-line consistent-return
const onConfirm = () => {
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
    })
    .catch(() => {});
};

onMounted(() => {
  apiMemberList({
    companyId: userInfo.value?.companyId,
  })
    .then((data: any) => {
      memberList.value = data || [];
      if (memberList.value.length) {
        visible.value = true;
      } else {
        emit('cancel');
      }
    })
    .catch(() => {});
});
</script>

<style scoped lang="less"></style>
