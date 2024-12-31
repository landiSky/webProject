<template>
  <div class="boxModal">
    <t-modal
      :visible="visible"
      :width="642"
      :height="400"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> 服务授权 </template>
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
          :disabled="item.memberId === userInfoByCompany?.memberId && checkUser"
          >{{ item.username }}
        </t-option>
      </t-select>
    </t-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { apiMemberList } from '@/api/common';
import {
  getServicePackageMember,
  apiEditServicePackageMember,
} from '@/api/buyer/order';

const store = useUserStore();
const { selectCompany, userInfoByCompany } = storeToRefs(store);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const memberList = ref<{ username: string; memberId: string }[] | []>([]); // 不在当前应用下的成员列表
const selectMemList = ref<string[]>([]);
const memberIdList = ref<string[]>([]);

// eslint-disable-next-line consistent-return
const onConfirm = (done: (closed: boolean) => void) => {
  if (!selectMemList.value.length) {
    done(false);
    return Message.warning(' 请选择要邀请的成员');
  }

  apiEditServicePackageMember({
    companyId: selectCompany.value?.companyId,
    memberIdList: memberIdList.value,
    newMemberIdList: selectMemList.value,
  })
    .then(() => {
      Message.success('邀请成功!');
      emit('confirm');
      done(false);
    })
    .catch(() => {
      done(false);
    });
};

// 是否存在这个用户
const checkUser = computed(() => {
  const data = selectMemList.value.some(
    (ele) => ele === userInfoByCompany.value?.memberId
  );
  return data;
});

onMounted(() => {
  apiMemberList({
    productId: props.data.productId,
    companyId: selectCompany.value?.companyId,
  })
    .then((data: any) => {
      memberList.value = data || [];
    })
    .catch(() => {});
  getServicePackageMember({
    companyId: selectCompany.value?.companyId,
  })
    .then((data: any) => {
      memberIdList.value = (data || []).map(
        (item: { username: string; memberId: string }) => item.memberId
      );
      selectMemList.value = (data || []).map(
        (item: { username: string; memberId: string }) => item.memberId
      );
    })
    .catch(() => {});
});
</script>

<style scoped lang="less"></style>
