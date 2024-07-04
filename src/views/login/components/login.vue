<template>
  <div class="loginWrapper">
    <div v-if="state == 1">
      <span class="title">欢迎登录智数通平台</span>
      <t-tabs default-active-key="1" @change="tabsChange">
        <t-tab-pane key="1" title="手机号登录">
          <form
            ref="orgFormRef"
            action="/auth/login"
            method="post"
            style="display: none"
          >
            <input name="username" :value="form.username" />
            <input ref="formInput" name="password" />
          </form>
          <t-form
            ref="formRef"
            :model="form"
            :rules="formRules"
            layout="vertical"
          >
            <t-form-item
              field="username"
              :validate-trigger="['change', 'blur']"
            >
              <t-input
                v-model.trim="form.username"
                placeholder="请输入手机号"
                size="large"
                ><template #prefix>
                  <iconpark-icon name="mobile"></iconpark-icon>
                </template>
              </t-input>
            </t-form-item>
            <t-form-item
              field="password"
              :validate-trigger="['change', 'blur']"
            >
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
            <t-form-item>
              <t-button
                class="btn"
                type="primary"
                html-type="submit"
                :loading="loginLoading"
                size="large"
                long
                :disabled="btnDisabled"
                @click="clickLoginBtn"
                >登录</t-button
              >
            </t-form-item>
          </t-form>
          <t-link class="bottomOpt" @click="forgotPassword">忘记密码</t-link>
          <t-divider direction="vertical" />
          <t-link class="bottomOpt" @click="goRegister">注册账号</t-link>
        </t-tab-pane>
        <t-tab-pane key="2" title="二级节点账号登录">
          <form
            ref="orgFormRef"
            action="/auth/login"
            method="post"
            style="display: none"
          >
            <input name="username" :value="form.username" />
            <input ref="formInput" name="password" />
          </form>
          <t-form
            ref="formRef"
            :model="form"
            :rules="formRules2"
            layout="vertical"
          >
            <t-form-item
              field="username"
              :validate-trigger="['change', 'blur']"
            >
              <t-input
                v-model.trim="form.username"
                placeholder="请输入二级节点系统用户名"
                size="large"
                ><template #prefix>
                  <iconpark-icon name="mobile"></iconpark-icon>
                </template>
              </t-input>
            </t-form-item>
            <t-form-item
              field="password"
              :validate-trigger="['change', 'blur']"
            >
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
            <t-form-item>
              <t-button
                class="btn"
                type="primary"
                html-type="submit"
                :loading="loginLoading"
                size="large"
                long
                :disabled="btnDisabled"
                @click="clickLoginBtn"
                >登录</t-button
              >
            </t-form-item>
          </t-form>
          <t-link class="bottomOpt" @click="forgotPassword">忘记密码</t-link>
          <t-divider direction="vertical" />
          <t-link class="bottomOpt" @click="goRegister">注册账号</t-link>
        </t-tab-pane>
      </t-tabs>
    </div>
    <div v-if="state == 2">
      <span class="title">找回密码</span>
      <t-form
        ref="performsRef"
        :model="performs"
        :rules="performsRules"
        layout="vertical"
      >
        <t-form-item field="username" :validate-trigger="['change', 'blur']">
          <t-input
            v-model.trim="performs.username"
            placeholder="请输入手机号"
            size="large"
            ><template #prefix>
              <iconpark-icon name="mobile"></iconpark-icon>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item field="code" :validate-trigger="['change', 'blur']">
          <t-input
            v-model.trim="performs.code"
            placeholder="短信验证码"
            size="large"
            class="code_input"
            ><template #prefix>
              <iconpark-icon name="safe"></iconpark-icon>
            </template>
          </t-input>
          <t-button
            class="code_button"
            type="primary"
            @click="
              () => {
                if (Number(counts) > 0) {
                  return;
                }
                captchaType = 5;
                captchaVisible = true;
              }
            "
            >{{ counts || counts === 0 ? counts : '' }}{{ codeText }}</t-button
          >
        </t-form-item>
        <t-form-item field="password" :validate-trigger="['change', 'blur']">
          <t-input-password
            v-model.trim="performs.password"
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
          :validate-trigger="['change', 'blur']"
        >
          <t-input-password
            v-model.trim="performs.confirmPassword"
            placeholder="请确认密码"
            size="large"
            autocomplete="new-password"
          >
            <template #prefix>
              <iconpark-icon name="lock"></iconpark-icon>
            </template>
          </t-input-password>
        </t-form-item>
        <t-form-item>
          <t-button
            class="btn bin_margin"
            type="primary"
            html-type="submit"
            :loading="loginLoading"
            size="large"
            long
            :disabled="btnDisabled2"
            @click="clickValidateBtn"
            >验证</t-button
          >
        </t-form-item>
      </t-form>
      <t-link @click="getLog">去登录</t-link>
    </div>

    <div v-if="state == 3">
      <span class="title">绑定手机号</span>
      <t-form
        ref="performsRef2"
        :model="performs2"
        :rules="performsRules"
        layout="vertical"
      >
        <t-form-item field="username" :validate-trigger="['change', 'blur']">
          <t-input
            v-model.trim="performs2.username"
            placeholder="请输入手机号"
            size="large"
            ><template #prefix>
              <iconpark-icon name="mobile"></iconpark-icon>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item field="code" :validate-trigger="['change', 'blur']">
          <t-input
            v-model.trim="performs2.code"
            placeholder="请输入验证码"
            size="large"
            class="code_input"
            ><template #prefix>
              <iconpark-icon name="safe"></iconpark-icon>
            </template>
          </t-input>
          <t-button
            class="code_button"
            type="primary"
            @click="
              () => {
                if (Number(counts) > 0) {
                  return;
                }
                captchaType = 6;
                captchaVisible = true;
              }
            "
            >{{ counts || counts === 0 ? counts : '' }}{{ codeText }}</t-button
          >
        </t-form-item>
        <t-form-item>
          <t-button
            class="btn bin_margin"
            type="primary"
            html-type="submit"
            :loading="loginLoading"
            size="large"
            long
            :disabled="btnDisabled3"
            @click="clickBindingBtn"
            >确认绑定</t-button
          >
        </t-form-item>
      </t-form>
    </div>

    <SliderCaptcha
      v-if="captchaVisible"
      @success="captchaSuccess"
      @cancel="onCaptchaCancel"
    ></SliderCaptcha>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Message } from '@tele-design/web-vue';
import {
  apiConfigInfo,
  apiChheckLogin,
  apiSendCaptcha,
  apiLogin,
  userforgotPassword,
} from '@/api/login';
import { sm2 } from '@/utils/encrypt';
import { getToken, setToken } from '@/utils/auth';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

import SliderCaptcha from './captcha.vue';

const router = useRouter();
const orgFormRef = ref();
const formInput = ref();
const captchaVisible = ref(false);
const loginLoading = ref(false);
let configInfo: Record<string, any> = {};
const phoneTs = /^1[2|3|4|5|6|7|8|9][0-9]{9}$/; //  手机号正则
const captchaType = ref(1);
const formRef = ref();
const form = ref({
  username: '',
  password: '',
});

const performsRef = ref();
const performs = ref({
  username: '',
  code: '',
  password: '',
  confirmPassword: '',
});

const performsRef2 = ref();
const performs2 = ref({
  username: '',
  code: '',
});
const state = ref(1);
const userStore = useUserStore();

const formRules = {
  username: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号');
        if (!phoneTs.test(value)) {
          return cb('手机号格式不正确,需要填写11位手机号');
        }
        return cb();
        // if (/^$|^1[0-9][0-9]\d{8}$|^(5|6|8|9)[0-9]{7}$/.test(value)) {
        //   return cb();
        // }
        // return cb('手机号格式不正确,需要填写11位手机号');
      },
    },
  ],

  password: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入密码');
        return cb();
        // if (
        //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][])[\da-zA-Z~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][]{8,}/.test(
        //     value
        //   )
        // ) {
        //   return cb();
        // }
        // return cb('至少包含8位字符, 且包含大小写字母、数字和特殊字符');
      },
    },
  ],
};

const formRules2 = {
  username: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入二级节点系统用户名');
        return cb();
      },
    },
  ],

  password: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入密码');
        return cb();
      },
    },
  ],
};

const performsRules = {
  username: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入手机号');
        if (!phoneTs.test(value)) {
          return cb('手机号格式不正确,需要填写11位手机号');
        }
        return cb();
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
        if (!value) return cb('请输入新密码');
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
        if (value !== performs?.value?.password)
          return cb('两次输入密码不一致');
        return cb();
        // if (
        //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][])[\da-zA-Z~!@#$%^&*()_+`\-={}:";'<>?,./\\|\][]{8,}/.test(
        //     value
        //   )
        // ) {
        //   return cb();
        // }
        // return cb('至少包含8位字符, 且包含大小写字母、数字和特殊字符');
      },
    },
  ],
};

const btnDisabled = computed(() => {
  const { username, password } = form.value;

  return !(username && password);
});

const btnDisabled2 = computed(() => {
  const { username, code, password, confirmPassword } = performs.value;

  return !(username && code && password && confirmPassword);
});

const btnDisabled3 = computed(() => {
  const { username, code } = performs2.value;

  return !(username && code);
});

const goRegister = () => {
  // window.location.href = configInfo?.registerUrl;
  router.push({ path: '/register' });
};

const forgotPassword = () => {
  state.value = 2;
};
const getLog = () => {
  state.value = 1;
};
const clickLoginBtn = () => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      captchaType.value = 1;
      loginLoading.value = true;
      captchaVisible.value = true;
    }
  });
};

const clickValidateBtn = () => {
  performsRef.value.validate((errors: any) => {
    if (!errors) {
      captchaType.value = 3;
      loginLoading.value = true;
      captchaVisible.value = true;
    }
  });
};

const clickBindingBtn = () => {
  performsRef2.value.validate((errors: any) => {
    if (!errors) {
      captchaType.value = 4;
      loginLoading.value = true;
      captchaVisible.value = true;
    }
  });
};

// 找回密码
const validate = () => {
  performsRef.value.validate((errors: any) => {
    if (!errors) {
      loginLoading.value = true;
      const { username, code, password, confirmPassword } = performs.value;
      userforgotPassword({
        mobile: username,
        code,
        password: sm2(password, userStore.configInfo?.publicKey),
        confirmPassword: sm2(confirmPassword, userStore.configInfo?.publicKey),
      })
        .then((res: any) => {
          Message.success('修改成功');
          getLog();
          loginLoading.value = false;
        })
        .catch(() => {
          loginLoading.value = false;
        })
        .finally(() => {
          loginLoading.value = false;
        });
    }
  });
};
// 确认绑定
const binding = () => {};

const realLoginRequest = () => {
  const publicKey =
    '047df36f25dab03d12739e57a1c3a86a72019bea590e5ffaefa79145d9129ae5ae9d395de0fba16a9577c7d52b27cda3e2ec63f522d4d69c5a92a0a0b388b1db10';
  formInput.value.value = sm2(
    form.value.password,
    configInfo?.publicKey ?? publicKey
  );
  setTimeout(() => {
    apiLogin({
      username: form.value.username,
      password: formInput.value.value,
    })
      .then((data) => {
        userStore.clearUserInfo();
        // orgFormRef.value.submit();
        setToken(data.tokenValue);
        const mallDetailPath = sessionStorage.getItem('mallDetailPath');
        const uriHash = mallDetailPath || '/buyer/index';
        router.push({ path: uriHash });
      })
      .catch(() => {
        loginLoading.value = false;
      });
  }, 100);
};

const onCaptchaCancel = () => {
  captchaVisible.value = false;
  loginLoading.value = false;
};

const tabsChange = (e: any) => {
  console.log(e, 'e--------');
  formRef.value.resetFields();
  formRef.value.clearValidate();
};
const counts: Record<string, any> = ref();
const times = ref();
const codeText = ref('获取短信验证码');
const codeFtn = (type: number) => {
  const { username } = performs.value;
  if (!username) {
    Message.error('手机号不能为空');
    return;
  }
  if (!phoneTs.test(username)) {
    Message.error('手机号格式不正确,需要填写11位手机号');
    return;
  }
  if (counts.value) {
    return;
  }
  apiSendCaptcha({ phone: performs.value.username, type }).then((res) => {
    if (res.data.code === 200) {
      counts.value = 60;
      times.value = setInterval(() => {
        if (counts.value === 0) {
          clearInterval(times.value);
          codeText.value = '获取短信验证码';
          counts.value = null;
          return;
        }
        counts.value -= 1;
      }, 1000);
      codeText.value = '秒后重新发送';
      Message.success('验证码已发送，注意查收');
    } else {
      Message.error(res.data.msg);
    }
  });
};

const captchaSuccess = () => {
  captchaVisible.value = false;
  switch (captchaType.value) {
    case 1:
      realLoginRequest();
      break;
    case 2:
      realLoginRequest();
      break;
    case 3:
      // 找回密码点击事件
      validate();
      break;
    case 4:
      // 绑定点击事件
      binding();
      break;
    case 5:
      // 找回密码验证码
      codeFtn(5);
      break;
    case 6:
      // 绑定验证码
      codeFtn(4);
      break;
    default:
      realLoginRequest();
  }
};

onMounted(() => {
  apiConfigInfo().then((data) => {
    configInfo = data;
  });
});
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

    &.tele-tabs-nav-type-line .tele-tabs-tab {
      margin-left: 0;
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 22px;
    }

    .tele-tabs-nav-ink {
      height: 2px;
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
    // background-color: #c2c3cc;
    border-radius: 2px;

    &:disabled {
      background-color: #c2c3cc;
    }
  }

  .bin_margin {
    margin-top: 0;
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
  .code_input {
    width: 178px;
  }

  .code_button {
    width: 130px;
    height: 37px;
    margin-left: 20px;
  }
}
</style>
