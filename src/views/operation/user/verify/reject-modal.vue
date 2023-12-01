<template>
  <t-modal
    v-model:visible="visible"
    :width="520"
    :height="360"
    :on-before-ok="onConfirm"
    :ok-button-props="{
      status: 'danger',
    }"
    ok-text="驳回"
    @cancel="emit('cancel')"
  >
    <template #title> 审核驳回 </template>
    <t-form ref="formRef" :model="formModel" :rules="formRules">
      <t-form-item field="reason" hide-label="true">
        <t-textarea
          v-model.trim="formModel.reason"
          placeholder="请输入驳回原因"
          :style="'height: 200px'"
          :max-length="{
            length: 100,
            errorOnly: true,
          }"
          :auto-size="{
            minRows: 10,
            maxRows: 10,
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
import { verify } from '@/api/operation/user';
import { Message } from '@tele-design/web-vue';

const props = defineProps({
  id: {
    type: String,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();

const formRules = {
  reason: [
    { required: true, message: '请输入驳回原因' },
    { maxLength: 100, message: '最多可输入100个字符' },
  ],
};

const visible = ref(true);
const formModel = ref({
  reason: '',
});

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      verify({
        companyId: props.id ?? '',
        certStatus: 2,
        remark: formModel.value.reason,
      })
        .then((res) => {
          if (res.code === 200) {
            emit('confirm');
            Message.success('申请已驳回');
            done(true);
          } else {
            Message.error(res.message);
            done(false);
          }
        })
        .catch(() => {
          Message.error('驳回失败');
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
