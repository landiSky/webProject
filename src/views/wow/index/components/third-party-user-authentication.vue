<template>
  <div class="user-authentication-container">
    <t-modal
      v-model:visible="showModal"
      :has-back-btn="false"
      :width="448"
      :simple="true"
      modal-class="third-party-user-authentication"
      popup-container=".user-authentication-container"
      :footer="false"
      @back="emit('onCancel')"
    >
      <t-form ref="formRef" :model="form" :rules="formRules">
        <div class="form-box">
          <div class="title-text">{{ props.title }}</div>
          <t-form-item
            :hide-asterisk="true"
            :hide-label="true"
            field="phone"
            :disabled="true"
          >
            <t-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              ><template #prefix>
                <iconpark-icon name="mobile"></iconpark-icon>
              </template>
            </t-input>
          </t-form-item>
          <t-form-item :hide-asterisk="true" :hide-label="true" field="name">
            <t-input
              v-model="form.name"
              placeholder="请输入联系人姓名"
              size="large"
              autocomplete="new-name"
              ><template #prefix>
                <icon-user :size="12" />
              </template>
            </t-input>
          </t-form-item>
          <t-form-item
            :hide-asterisk="true"
            :hide-label="true"
            field="password"
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
          <t-form-item
            :hide-asterisk="true"
            :hide-label="true"
            field="confirmPassword"
          >
            <t-input-password
              v-model.trim="form.confirmPassword"
              placeholder="请确认密码"
              size="large"
              autocomplete="new-confirmPassword"
            >
              <template #prefix>
                <iconpark-icon name="lock"></iconpark-icon>
              </template>
            </t-input-password>
          </t-form-item>
          <t-form-item :hide-asterisk="true" :hide-label="true" field="email">
            <t-input
              v-model="form.email"
              placeholder="请输入邮箱"
              size="large"
              autocomplete="off"
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
          <t-form-item field="agreement" :hide-label="true">
            <t-checkbox
              v-model="form.agreement"
              :class="form.agreement ? '' : 'deep-checkbox'"
              >我已阅读并遵守</t-checkbox
            >
            <t-link @click="goAgreement">《用户服务协议》</t-link>
          </t-form-item>
          <t-form-item :hide-label="true">
            <t-button
              class="submitBtn"
              type="primary"
              :loading="state.launchLoading"
              size="large"
              long
              :disabled="btnDisabled"
              @click="handleSubmit"
              >提交</t-button
            >
          </t-form-item>
          <t-form-item :hide-label="true">
            <t-button class="cancelBtn" size="large" long @click="handleCancel"
              >取消</t-button
            >
          </t-form-item>
        </div>
      </t-form>
    </t-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { Message } from '@tele-design/web-vue';
import {
  apiFooterInfo,
  apiFooterUpdate,
} from '@/api/decoration/decoration-tools';
import { useRouter } from 'vue-router';

const props = defineProps({
  visible: Boolean,
  title: String,
});

const formRef = ref();
const router = useRouter();

const form: Record<string, any> = ref({
  phone: '', // 手机号
  name: '', // 联系人姓名
  password: '', // 密码
  confirmPassword: '', // 确认密码
  email: '', // 邮箱
  agreement: false, // 是否勾选服务协议
});

const btnDisabled = computed(() => {
  const { phone, name, password, confirmPassword, agreement } = form.value;

  // return !(phone && name && password && confirmPassword && agreement);
  return !agreement;
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
  name: [
    {
      validator: (value: string, cb: (params?: any) => void) => {
        if (!value) return cb('请输入联系人姓名');
        if (value.length > 10) {
          return cb('长度不超过10个字符');
        }
        return cb();
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
        if (value.length > 255) return cb('长度不超过255个字符');
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
  agreement: [
    {
      validator: (value: boolean, cb: (params?: any) => void) => {
        console.log(value);
        if (value !== true) return cb('请勾选服务协议');
        return cb();
      },
    },
  ],
};

const state = reactive<{
  launchLoading: boolean;
}>({
  launchLoading: false,
});

const emit = defineEmits(['onConfirm', 'onCancel']);

const showModal = computed(() => props.visible);

const FooterInfoDetails = async () => {
  await apiFooterInfo()
    .then((res: any) => {
      if (res.code !== 200) {
        return;
      }
      form.value.phone = res.data.phone ?? '';
    })
    .catch(() => {});
};

const goAgreement = () => {
  const routeData = router.resolve({
    path: '/agreement',
  });
  window.open(routeData?.href, '_blank');
};

// 取消
const handleCancel = () => {
  emit('onCancel');
};

// 提交
const handleSubmit = () => {
  console.log(form.value);
  formRef.value.validate((valid: any) => {
    if (!valid) {
      const params = {
        ...form.value,
      };
      apiFooterUpdate(params).then((res) => {
        if (res.code !== 200) return;
        Message.success('提交成功');
        emit('onConfirm', '123');
      });
    }
  });
};

onMounted(() => {
  FooterInfoDetails();
});
</script>

<style lang="less" scoped>
:deep(.third-party-user-authentication) {
  gap: 32px;
  padding: 48px 60px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px 0 #7c8cf133;
}

:deep(.tele-modal-simple .tele-modal-body) {
  margin-top: 0;
}

.title-text {
  margin-bottom: 32px;
  color: #1d2129;
  font-weight: 600;
  font-size: 20px;
  font-family: PingFang SC;
  line-height: 28px;
  text-align: center;
}

:deep(.tele-form-item) {
  display: flex;
  justify-content: center;
}

.submitBtn {
  height: 40px;
  padding: 9px 16px;
  font-weight: 400;
  font-size: 14px;
  font-family: PingFang SC;
  line-height: 22px;
  border-radius: 2px;

  &:disabled {
    background-color: #c2c3cc;
  }
}

.cancelBtn {
  height: 40px;
  padding: 9px 16px;
  color: #4e5969;
  font-weight: 400;
  font-size: 14px;
  font-family: PingFang SC;
  line-height: 22px;
  background: #fff;
  border: 1px solid #e5e8ef;
  border-radius: 2px;
}

.deep-checkbox {
  :deep(.tele-checkbox-icon) {
    background: rgba(243, 244, 246, 1);
    border: none;
  }

  :deep(.tele-checkbox-label) {
    color: rgba(128, 131, 148, 1);
    font-weight: 400;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 16px;
    text-align: left;
  }
}
</style>
