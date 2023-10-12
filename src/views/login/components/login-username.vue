<template>
  <t-form
    ref="formRef"
    :model="form"
    layout="vertical"
    @submit-success="verifySuccess"
  >
    <t-form-item
      ref="nameref"
      label="系统账号"
      :rules="usernameRules"
      field="username"
      :validate-trigger="['change', 'input']"
      :label-col-style="{ paddingBottom: '8px' }"
    >
      <t-input
        v-model="form.username"
        placeholder="请输入账号"
        size="large"
      ></t-input>
    </t-form-item>
    <t-form-item
      label="密码"
      field="password"
      :validate-trigger="['change', 'input']"
      :label-col-style="{ paddingBottom: '8px' }"
    >
      <t-input-password
        v-model.trim="form.password"
        placeholder="请输入密码"
        size="large"
      >
      </t-input-password>
    </t-form-item>
    <t-form-item :label-col-style="{ paddingBottom: '0' }">
      <t-button
        type="primary"
        html-type="submit"
        :loading="loading"
        size="large"
        long
        >登录</t-button
      >
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { reactive, defineEmits, ref } from 'vue';
import { Message } from '@tele-design/web-vue';
import { setToken } from '@/utils/auth';
import { apiLoginName } from '@/api/login';

const loading = ref(false);

const formRef = ref();
const nameref = ref();
const form = reactive({
  username: '',
  password: '',
});

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const usernameRules: any = reactive([
  {
    required: true,
    message: '请输入账号',
  },
]);

async function verifySuccess() {
  const params = {
    username: form.username.trim(),
    password: form.password.trim(),
  };
  loading.value = true;

  apiLoginName(params)
    .then((response) => {
      const { token } = response;
      // 将token存入localstorage
      setToken(token);
      Message.success('登录成功');
      // 登录成功，进入首页
      emit('success');
    })
    .catch((error) => {
      formRef.value.setFields({
        password: {
          status: 'error',
          message: error.message,
        },
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style lang="less" scoped></style>
