<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="400"
    @cancel="emit('cancel')"
  >
    <template #title> 标识轻应用服务设置 </template>
    <p style="margin-bottom: 20px">授权使用用户</p>
    <t-select
      v-model="selectMemList"
      placeholder="请选择"
      :style="{ width: '400px' }"
      allow-search
      allow-clear
      multiple
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

    <p style="margin: 20px 0">标识轻应用数据存储企业前缀</p>
    <t-select
      v-model="prefixId"
      placeholder="请选择"
      :style="{ width: '400px' }"
      :disabled="enterprisePrefixList.length === 1"
      size="large"
    >
      <t-option
        v-for="item in enterprisePrefixList"
        :key="item.id"
        :value="item.id"
        >{{ item.entPrefix }}
      </t-option>
    </t-select>

    <template #footer>
      <t-button @click="emit('cancel')">取消</t-button>
      <t-button type="outline" @click="onSkip">跳过</t-button>
      <t-button type="primary" @click="onConfirm">确定</t-button>
    </template>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { apiMemberList, getPrefixList, changePrefixBind } from '@/api/common';

const store = useUserStore();
const { selectCompany } = storeToRefs(store);

const props = defineProps({
  productId: String,
});
const emit = defineEmits(['confirm', 'cancel']);
const visible = ref(false);
const enterprisePrefixList = ref<any[]>([]);
const memberList = ref<{ username: string; memberId: string }[] | []>([]); // 不在当前应用下的成员列表
const selectMemList = ref<string[]>([]);
const prefixId = ref();

const onConfirm = () => {
  console.log(prefixId.value);
  if (!selectMemList.value.length) {
    return Message.warning(' 请选择要授权的成员');
  }
  if (!prefixId.value) {
    return Message.warning(' 请选择企业前缀');
  }
  const params = {
    prefixId: prefixId.value,
    companyId: selectCompany.value?.companyId,
  };
  changePrefixBind(params).then(() => {
    return emit('confirm', selectMemList.value);
  });
  return true;
};

const onSkip = () => {
  if (!prefixId.value) {
    return Message.warning(' 请选择企业前缀');
  }
  const params = {
    prefixId: prefixId.value,
    companyId: selectCompany.value?.companyId,
  };
  changePrefixBind(params).then(() => {
    return emit('confirm', []);
  });
  return true;
};

onMounted(() => {
  apiMemberList({
    productId: props.productId,
    companyId: selectCompany.value?.companyId,
  })
    .then((data: any) => {
      memberList.value = data || [];
      if (memberList.value.length) {
        visible.value = true;
      } else {
        emit('confirm', []);
        // emit('cancel');
      }
    })
    .catch(() => {
      emit('confirm', []);
    });

  getPrefixList({
    companyId: selectCompany.value?.companyId,
  })
    .then((data: any) => {
      enterprisePrefixList.value = data;
      if (data.length === 1) {
        prefixId.value = data[0].id;
      }
    })
    .catch(() => {});
});
</script>

<style scoped lang="less"></style>
