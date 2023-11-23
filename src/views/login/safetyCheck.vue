<template>
  <div class="container">
    <div class="overflowWrap">
      <picture>
        <!-- 可能是一些对兼容性有要求的，但是性能表现更好的现代图片格式-->
        <source
          class="container-bg-img"
          :srcset="getImgPath('avif')"
          type="image/avif"
        />
        <source
          class="container-bg-img"
          :srcset="getImgPath('webp')"
          type="image/webp"
        />

        <!-- 最终的兜底方案-->
        <img class="container-bg-img" :src="getImgPath('jpg')" />
      </picture>
      <div class="loginWrapper">
        <span class="title">请绑定手机号/安全验证</span>
        <t-form
          ref="safeFormRef"
          :model="safeForm"
          :rules="safeFormRules"
          layout="vertical"
        >
          <t-form-item field="phone" :validate-trigger="['change', 'blur']">
            <t-input
              v-model="safeForm.phone"
              placeholder="请输入手机号"
              size="large"
              ><template #prefix>
                <iconpark-icon name="mobile"></iconpark-icon>
              </template>
            </t-input>
          </t-form-item>
          <t-form-item field="captcha" :validate-trigger="['change', 'blur']">
            <t-input
              v-model.trim="safeForm.captcha"
              placeholder="短信验证码"
              size="large"
              class="captcha"
            >
              <template #prefix>
                <iconpark-icon name="safe"></iconpark-icon>
              </template>
            </t-input>
            <t-button
              :loading="sendBtnLoading"
              class="textBtn"
              type="primary"
              size="large"
              @click="clickSendBtn"
              >{{
                countDownTime === 0 ? '获取短信验证码' : `${countDownTime}s`
              }}</t-button
            >
          </t-form-item>
          <t-form-item>
            <t-button
              class="btn"
              type="primary"
              html-type="submit"
              :loading="checkBtnLoading"
              size="large"
              long
              :disabled="btnDisabled"
              @click="clickCheckBtn"
              >验证</t-button
            >
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { Message } from '@tele-design/web-vue';
import { useUserStore } from '@/store/modules/user';
import { apiBindPhone, apiSendCaptcha } from '@/api/login';

import loginBgJpg from '@/assets/images/login-bg.jpg';
import loginBgWebp from '@/assets/images/login-bg.webp';
import loginBgAvif from '@/assets/images/login-bg.avif';

const countDownTime = ref(0); // 倒计时2分钟

const userStore = useUserStore();
const router = useRouter();

const timerId = ref();
const sendBtnLoading = ref(false);
const checkBtnLoading = ref(false);

const safeFormRef = ref();
const safeForm = ref({
  phone: '',
  captcha: '',
});

const btnDisabled = computed(() => {
  const { phone, captcha } = safeForm.value;

  return !(phone && captcha);
});

const safeFormRules = {
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
  captcha: [
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

const getImgPath = (type: string) => {
  const imgObj: Record<string, any> = {
    jpg: loginBgJpg,
    webp: loginBgWebp,
    avif: loginBgAvif,
  };
  return imgObj[type];
};
const clickSendBtn = () => {
  if (!safeForm.value.phone) {
    safeFormRef.value.setFields({
      phone: {
        status: 'error',
        message: '请输入手机号',
      },
    });
    return;
  }
  // if (countDownTime.value) return; // 已发送在计时中

  sendBtnLoading.value = true;
  apiSendCaptcha({ phone: safeForm.value.phone, type: 4 })
    .then((res) => {
      if (res.code === 200) {
        Message.success('验证码已发送，注意查收');
        countDownTime.value = 180; // 3分钟
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
    .catch(() => {
      clearInterval(timerId.value);
    })
    .finally(() => {
      sendBtnLoading.value = false;
    });
};

const clickCheckBtn = () => {
  safeFormRef.value.validate((errors: any) => {
    if (!errors) {
      const { phone, captcha } = safeForm.value;
      checkBtnLoading.value = true;
      apiBindPhone({
        userId: userStore.userInfo?.userId,
        phone,
        captcha,
      })
        .then(() => {
          router.push({
            name: 'buyerIndex',
            query: {
              // 目的时校验成功后，能进入买家首页而不是停留在校验页
              safeCheck: 'true',
            },
          });
        })
        .catch((err) => {
          clearInterval(timerId.value);
          countDownTime.value = 0;
        })
        .finally(() => {
          checkBtnLoading.value = false;
        });
    }
  });
};

onUnmounted(() => {
  clearInterval(timerId.value);
});
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;

  .overflowWrap {
    min-height: 1080px;
  }

  .container-bg-img {
    width: 100%;
    min-width: 1920px;
    height: auto;
  }

  .container-title {
    padding-bottom: 18px;
    font-size: 48px;
  }

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

    .captcha {
      width: 178px;
      margin-right: 20px;
    }

    .textBtn {
      width: 130px;
      height: 40px;
    }

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
      // background-color: #c2c3cc;
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
}
</style>
