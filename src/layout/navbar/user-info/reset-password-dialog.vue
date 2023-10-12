<template>
  <t-modal
    v-model:visible="visible"
    :on-before-ok="handleOk"
    title="修改密码"
    @cancel="emit('cancel')"
  >
    <t-form ref="formRef" auto-label-width :model="form" :rules="rules">
      <t-form-item field="oldPwd" label="当前密码">
        <t-input-password
          v-model="form.oldPwd"
          placeholder="请输入当前密码"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="newPwd" label="新密码">
        <t-input-password
          v-model="form.newPwd"
          placeholder="请输入8-18个字符的密码，字母、符号、数字，区分大小写"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="duplicatePwd" label="确认密码">
        <t-input-password
          v-model="form.duplicatePwd"
          placeholder="请输入确认密码"
          allow-clear
          show-word-limit
        />
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';
import { apiChangePwd } from '@/api/user';
import { Message } from '@tele-design/web-vue';

const emit = defineEmits(['cancel', 'confirm']);
const formRef = ref();
const visible = ref(true);

const form = reactive({
  oldPwd: '',
  newPwd: '',
  duplicatePwd: '',
});

const rules = {
  oldPwd: [
    {
      required: true,
      message: '请输入当前密码',
    },
  ],
  newPwd: [
    {
      required: true,
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb(`请输入新密码`);
        if (
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][])[\da-zA-Z~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][]{8,}/.test(
            value
          )
        ) {
          return cb();
        }
        return cb('至少包含8位字符, 且包含大小写字母、数字和特殊字符');
      },
    },
    {
      minLength: 8,
      maxLength: 18,
      message: '请输入8-18个字符',
    },
  ],
  duplicatePwd: [
    {
      required: true,
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb(`请输入确认密码`);
        if (value !== form.newPwd) {
          return cb('与新密码输入不一致');
        }
        return cb();
      },
    },
  ],
};

function handleOk(done: (closed: boolean) => void) {
  formRef.value.validate().then(async (v: boolean) => {
    if (!v) {
      apiChangePwd(form)
        .then(() => {
          Message.success('修改成功，请重新登录。');
          emit('confirm');
          done(true);
        })
        .catch(() => {
          done(false);
        });
    } else {
      done(false);
    }
  });
}
</script>

<style scoped lang="less">
.text-line-cls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  //   span {
  //     flex: 1;
  //   }
}

:deep(.tele-radio-label) {
  font-size: 12px;
}

:deep(.tele-form-item) {
  margin-bottom: 16px;
}
</style>
