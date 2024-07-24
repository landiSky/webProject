<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :on-before-ok="onConfirm"
    :ok-button-props="{
      status: 'danger',
    }"
    :esc-to-close="false"
    :has-back-btn="false"
    simple
    title-align="start"
    ok-text="确认拒绝"
    @cancel="emit('cancel')"
  >
    <template #title>
      <t-space>
        <iconpark-icon name="alert" size="16px" />
        拒绝此License申请
      </t-space>
    </template>
    <t-form ref="formRef" :model="formModel" :rules="formRules">
      <t-form-item field="reason" label="拒绝理由">
        <t-textarea
          v-model.trim="formModel.reason"
          placeholder="请输入拒绝理由"
          :max-length="50"
          :auto-size="{
            minRows: 4,
            maxRows: 4,
          }"
          show-word-limit
          @input="changed"
        />
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue';
import { manageApproveDetail } from '@/api/identifying/license';

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
  reason: [
    { required: true, message: '请输入拒绝理由' },
    { maxLength: 50, message: '最多可输入50个字符' },
  ],
};

const visible = ref(true);
// 表单数据集合
const formModel = ref({
  reason: '',
});
// 表单确认拒绝函数
const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      manageApproveDetail({
        id: props.id ?? '',
        type: 1,
        rejectRemark: formModel.value.reason,
      })
        .then((res) => {
          emit('confirm');
          Message.success('申请已拒绝');
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

<style scoped lang="less"></style>
