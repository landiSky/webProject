<template>
  <div class="loginWrapper">
    <div v-if="currentStep === 1" class="stepOne">
      <span class="title">欢迎登录工业互联网</span>
      <t-tabs default-active-key="1">
        <t-tab-pane key="1" title="密码登录">
          <t-form
            ref="formRef"
            :model="form"
            :rules="formRules"
            layout="vertical"
          >
            <t-form-item
              field="username"
              :validate-trigger="['change', 'input']"
            >
              <t-input
                v-model.trim="form.username"
                placeholder="请输入手机号或用户名"
                size="large"
                ><template #prefix>
                  <iconpark-icon name="mobile"></iconpark-icon>
                </template>
              </t-input>
            </t-form-item>
            <t-form-item
              field="password"
              :validate-trigger="['change', 'input']"
            >
              <t-input-password
                v-model.trim="form.password"
                placeholder="请输入密码"
                size="large"
              >
                <template #prefix>
                  <iconpark-icon name="lock"></iconpark-icon>
                </template>
              </t-input-password>
            </t-form-item>
            <t-form-item>
              <t-button
                class="btn"
                type="primary"
                html-type="submit"
                :loading="loading"
                size="large"
                long
                :disabled="btnDisabled"
                @click="clickLoginBtn"
                >登录</t-button
              >
            </t-form-item>
          </t-form>
          <t-link class="bottomOpt" @click="goRegister">注册账号</t-link>
        </t-tab-pane>
      </t-tabs>
    </div>
    <div v-if="currentStep === 2" class="stepTwo">
      <span class="title">请绑定手机号/安全验证</span>
      <t-form :model="safeForm" :rules="safeFormRules" layout="vertical">
        <t-form-item field="mobile" :validate-trigger="['change', 'input']">
          <t-input
            v-model="safeForm.mobile"
            placeholder="请输入手机号"
            size="large"
            ><template #prefix>
              <iconpark-icon name="mobile"></iconpark-icon>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item field="captcha" :validate-trigger="['change', 'input']">
          <t-input
            v-model.trim="safeForm.captcha"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <iconpark-icon name="safe"></iconpark-icon>
            </template>
          </t-input>
          <t-button type="primary">获取短信验证码</t-button>
        </t-form-item>
        <t-form-item>
          <t-button
            class="btn"
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            long
            >验证</t-button
          >
        </t-form-item>
      </t-form>
    </div>
    <SliderCaptcha
      :visible="captchaVisible"
      @success="captchaSuccess"
    ></SliderCaptcha>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router';

import { Message } from '@tele-design/web-vue';

import { setToken } from '@/utils/auth';
import { apiLoginName } from '@/api/login';
import SliderCaptcha from './captcha.vue';

const emit = defineEmits(['register']);

const router = useRouter();

const captchaVisible = ref(false);
const loading = ref(false);
const currentStep = ref(1);

const formRef = ref();
const form = ref({
  username: '',
  password: '',
});

const safeForm = ref({
  mobile: '',
  captcha: '',
});

const formRules = {
  username: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号或用户名');
        if (/^$|^1[0-9][0-9]\d{8}$|^(5|6|8|9)[0-9]{7}$/.test(value)) {
          return cb();
        }
        return cb('手机号格式不正确,需要填写11位手机号');
      },
    },
  ],

  password: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入密码');
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
  ],
};

const safeFormRules = {
  phone: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号或用户名');
        if (/^$|^1[0-9][0-9]\d{8}$|^(5|6|8|9)[0-9]{7}$/.test(value)) {
          return cb();
        }
        return cb('手机号格式不正确,需要填写11位手机号');
      },
    },
  ],
  code: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入验证码');
        if (/^\d{6}$/.test(value)) {
          return cb();
        }
        return cb('验证码格式不正确');
      },
    },
  ],
};

const btnDisabled = computed(() => {
  const { username, password } = form.value;

  return !(username && password);
});

const goRegister = () => {
  emit('register');
};

const clickLoginBtn = () => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      captchaVisible.value = true;
    }
  });
};
const realLoginRequest = () => {
  const params = {
    username: form.value.username.trim(),
    password: form.value.password.trim(),
  };
  loading.value = true;

  apiLoginName(params)
    .then((response) => {
      currentStep.value = 2;
      const { token } = response;
      // 将token存入localstorage
      setToken(token);
      Message.success('登录成功');
      // 登录成功，进入首页
      router.push('/buyer');
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
};

const captchaSuccess = () => {
  captchaVisible.value = false;
  realLoginRequest();
};
</script>

<style lang="less" scoped>
.loginWrapper {
  position: absolute;
  top: 27%;
  left: 55%;
  width: 448px;
  height: 520px;
  padding: 60px 60px 40px 60px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 20px 0 rgba(124, 140, 241, 0.2);

  .title {
    display: inline-block;
    margin-bottom: 32px;
    color: #1d2129;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
  }

  :deep(.tele-tabs-nav) {
    &::before {
      display: none;
    }

    .tele-tabs-nav-type-line .tele-tabs-tab {
      margin-left: 0;
    }
  }

  :deep(.tele-form-item-layout-vertical > .tele-form-item-label-col) {
    display: none;
  }

  :deep(.tele-input-wrapper) {
    padding: 9px 12px;
    background: #f7f8fa;
    border: none;
    border-radius: 2px;

    .tele-input.tele-input-size-large {
      padding: 0;
      font-size: 14px;
      line-height: 22px;
    }
  }

  .btn {
    height: 40px;
    margin-top: 76px;
    padding: 9px 16px;
    font-size: 14px;
    line-height: 22px;
    background-color: #c2c3cc;
    border-radius: 2px;
  }

  .bottomOpt {
    display: inline-block;
    color: #4e5969;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px; /* 133.333% */
    text-align: center;
  }

  // :deep(.tele-form-item-label) {
  //   color: #1d2129;
  //   font-weight: 600;
  //   font-size: 14px;
  //   line-height: 22px;

  //   .tele-form-item-label-required-symbol {
  //     display: none;
  //   }
  // }
}
</style>
