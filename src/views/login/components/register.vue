<template>
  <div class="loginWrapper">
    <span class="title">欢迎注册账号</span>

    <t-form ref="formRef" :model="form" :rules="formRules" layout="vertical">
      <t-form-item field="phone" :validate-trigger="['change', 'blur']">
        <t-input v-model="form.phone" placeholder="请输入手机号" size="large"
          ><template #prefix>
            <iconpark-icon name="mobile"></iconpark-icon>
          </template>
        </t-input>
      </t-form-item>
      <t-form-item field="code" :validate-trigger="['change', 'blur']">
        <t-input
          v-model="form.code"
          placeholder="短信验证码"
          size="large"
          class="verifyInput"
          ><template #prefix>
            <iconpark-icon name="safe"></iconpark-icon>
          </template>
        </t-input>
        <t-button
          type="primary"
          :loading="sendBtnLoading"
          class="verifyBtn"
          @click="clickSendBtn"
          >{{
            countDownTime === 0 ? '获取短信验证码' : `${countDownTime}s`
          }}</t-button
        >
      </t-form-item>
      <t-form-item field="password" :validate-trigger="['change', 'input']">
        <t-input-password
          v-model.trim="form.password"
          placeholder="请输入密码"
          size="large"
          autocomplete="new-password"
        >
          <template #prefix>
            <iconpark-icon name="lock"></iconpark-icon>
          </template>
        </t-input-password>
      </t-form-item>
      <t-form-item
        field="confirmPassword"
        :validate-trigger="['change', 'input']"
      >
        <t-input-password
          v-model.trim="form.confirmPassword"
          placeholder="请确认密码"
          size="large"
        >
          <template #prefix>
            <iconpark-icon name="lock"></iconpark-icon>
          </template>
        </t-input-password>
      </t-form-item>
      <t-form-item field="email" :validate-trigger="['change', 'blur']">
        <t-input
          v-model="form.email"
          placeholder="请输入邮箱"
          size="large"
          :max-length="{
            length: 255,
            errorOnly: true,
          }"
        >
          <template #prefix>
            <icon-email :size="12" />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item field="agreement">
        <t-checkbox v-model="agreement">我已阅读并遵守</t-checkbox>
        <t-link @click="goAgreement">《用户服务协议》</t-link>
      </t-form-item>
      <t-form-item>
        <t-button
          class="registerBtn"
          type="primary"
          :loading="regisLoading"
          size="large"
          long
          :disabled="btnDisabled"
          @click="goRegister"
          >注册</t-button
        >
      </t-form-item>
    </t-form>
    <span class="bottomOpt"
      >已有账号?
      <t-link @click="goLogin">去登录</t-link>
    </span>
  </div>
  <SliderCaptcha
    v-if="captchaVisible"
    @success="captchaSuccess"
    @cancel="captchaVisible = false"
  ></SliderCaptcha>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';

import { sm2 } from '@/utils/encrypt';
import { apiSendCaptcha, apiRegisterUser } from '@/api/login';
import SliderCaptcha from './captcha.vue';

const userStore = useUserStore();
const router = useRouter();
const emit = defineEmits(['login']);
const regisLoading = ref(false);
const sendBtnLoading = ref(false);
const agreement = ref(false); // 是否勾选服务协议
const timerId = ref();
const countDownTime = ref(0); // 倒计时3分钟
const captchaVisible = ref(false);

const formRef = ref();
const form = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  email: '',
});

const btnDisabled = computed(() => {
  const { phone, code, password, confirmPassword } = form.value;

  return !(phone && code && password && confirmPassword && agreement.value);
});

const formRules = {
  phone: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号');
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
  confirmPassword: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入确认密码');
        if (value !== form.value.password) return cb('密码和确认密码不一致');
        return cb();
      },
    },
  ],
  email: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入邮箱');
        const reata = new RegExp(
          '^$|^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$'
        );
        if (reata.test(value)) {
          return cb();
        }
        return cb('邮箱格式不正确');
      },
    },
  ],
};

const goAgreement = () => {
  const routeData = router.resolve({
    path: '/agreement',
  });
  window.open(routeData?.href, '_blank');
};

const goLogin = () => {
  userStore.jumpToLogin();
  // router.push('/buyer');
  // emit('login');
  // router.push('/login');
};

const goRegister = () => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      if (!agreement.value) {
        formRef.value.setFields({
          agreement: {
            status: 'error',
            message: '请勾选服务协议',
          },
        });
      } else {
        regisLoading.value = true;
        const { phone, code, password, confirmPassword, email } = form.value;
        apiRegisterUser({
          mobile: phone,
          code,
          password: sm2(password, userStore.configInfo?.publicKey),
          confirmPassword: sm2(
            confirmPassword,
            userStore.configInfo?.publicKey
          ),
          email,
        })
          .then(() => {
            Message.success('注册成功，去登录！');
            goLogin(); // 注册成功，跳转到登录
          })
          .catch(() => {
            clearInterval(timerId.value);
            countDownTime.value = 0;
          })
          .finally(() => {
            regisLoading.value = false;
          });
      }
    }
  });
};

const realSendRequest = () => {
  sendBtnLoading.value = true;
  apiSendCaptcha({ phone: form.value.phone, type: 2 })
    .then((res) => {
      if (res.data.code === 200) {
        Message.success('验证码已发送，注意查收');
        countDownTime.value = 60; // 3分钟
        timerId.value = setInterval(() => {
          if (countDownTime.value <= 0) {
            clearInterval(timerId.value);
          } else {
            countDownTime.value -= 1;
          }
        }, 1000);
      } else {
        countDownTime.value = 0;
        Message.error(res.message || '发送验证码异常，请重试');
      }
    })
    .catch(() => {})
    .finally(() => {
      sendBtnLoading.value = false;
    });
};

const clickSendBtn = () => {
  if (!form.value.phone) {
    formRef.value.setFields({
      phone: {
        status: 'error',
        message: '请输入手机号',
      },
    });
    return;
  }
  if (countDownTime.value) return; // 已发送在计时中

  captchaVisible.value = true;
};

const captchaSuccess = () => {
  captchaVisible.value = false;
  realSendRequest();
};

onUnmounted(() => {
  clearInterval(timerId.value);
});
</script>

<style lang="less" scoped>
.loginWrapper {
  position: absolute;
  top: 27%;
  left: 55%;
  width: 448px;
  min-height: 520px;
  padding: 60px 60px 40px 60px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 20px 0 rgba(124, 140, 241, 0.2);

  .title {
    display: inline-block;
    margin-bottom: 26px;
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

  .verifyInput {
    width: 178px;
    margin-right: 20px;
  }

  .verifyBtn {
    width: 130px;
    height: 40px;
  }

  .registerBtn {
    // margin-top: 76px;
    height: 40px;
    padding: 9px 16px;
    font-size: 14px;
    line-height: 22px;
    border-radius: 2px;

    &:disabled {
      background-color: #c2c3cc;
    }
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
