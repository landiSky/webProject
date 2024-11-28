<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    :ok-button-props="{
      status: 'primary',
    }"
    :esc-to-close="false"
    :has-back-btn="false"
    simple
    title-align="start"
    ok-text="通过"
    @cancel="emit('cancel')"
  >
    <template #title>
      <t-space>
        <!-- <iconpark-icon name="success" size="16px" /> -->
        <img :src="process" alt="" class="icon-process" />
        通过此License申请
      </t-space>
    </template>
    <t-form ref="formRef" :model="formModel" :rules="formRules">
      <t-form-item field="reason" label="授权周期">
        <t-select
          v-model.trim="formModel.reason"
          :style="{ width: '320px' }"
          placeholder="请选择授权周期"
        >
          <t-option
            v-for="(item, index) in cycleList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</t-option
          >
        </t-select>
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { manageApproveDetail } from '@/api/identifying/license';

import process from '@/assets/images/license/icon-process.png';

import { Message } from '@tele-design/web-vue';

// 父组件数据集合
const props = defineProps({
  id: {
    type: String,
  },
});
// 父组件函数集合
const emit = defineEmits(['confirm', 'cancel']);
// 表单ref
const formRef = ref();
// 表单正则校验
const formRules = {
  reason: [{ required: true, message: '请选择授权周期' }],
};

const visible = ref(true);
// 授权周期 集合
const cycleList = ref([
  {
    label: '6个月',
    value: '0',
  },
  {
    label: '1年',
    value: '1',
  },
  {
    label: '2年',
    value: '2',
  },
  {
    label: '3年',
    value: '3',
  },
]);
// 表单数据集合
const formModel = ref({
  reason: null,
});
// 表单通过函数
const onConfirm = (done: (closed: boolean) => void) => {
  console.log(2111111);
  formRef.value.validate((errors: any) => {
    if (!errors) {
      manageApproveDetail({
        id: props.id ?? '',
        type: 0,
        authCycle: formModel.value.reason,
      })
        .then((res) => {
          emit('confirm');
          Message.success('申请通过');
          done(true);
        })
        .catch(() => {
          Message.error('申请失败');
          done(false);
        });
    } else {
      done(false);
    }
  });
};

const changed = () => {
  formRef.value.clearValidate();
};
</script>

<style scoped lang="less">
.icon-process {
  width: 16px;
  height: 16px;
}
</style>
