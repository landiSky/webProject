<!--  -->
<template>
  <t-modal
    v-model:visible="visible"
    :on-before-ok="handleOk"
    :footer="isEdit"
    @close="onClose"
  >
    <template #title>
      {{ isEdit ? '编辑个人信息' : '个人信息' }}
    </template>
    <t-form ref="formRef" auto-label-width :model="form">
      <t-form-item
        field="nickName"
        label="姓名"
        :validate-trigger="['change', 'input']"
        :rules="[{ required: isEdit, message: '请输入姓名' }]"
        :required="isEdit"
      >
        <div v-if="!isEdit" class="text-line-cls">
          <span>{{ form.nickName }}</span>
          <t-button type="primary" @click="isEdit = true">编辑</t-button>
        </div>

        <t-input
          v-else
          v-model="form.nickName"
          placeholder="请输入"
          :max-length="20"
          allow-clear
          show-word-limit
          :disabled="!isEdit"
        />
      </t-form-item>
      <t-form-item field="depart" label="部门">
        <div class="text-line-cls">
          <span>{{ form.deptName }}</span>
        </div>
      </t-form-item>
      <t-form-item field="account" label="账号">
        <div class="text-line-cls">
          <span>{{ form.username }}</span>
        </div>
      </t-form-item>
      <t-form-item field="enabled" label="状态">
        <div class="text-line-cls">
          <span>{{ form.enabled === 0 ? '正常' : '停用' }}</span>
        </div>
      </t-form-item>
      <t-form-item field="gender" label="性别">
        <div v-if="!isEdit" class="text-line-cls">
          <span>{{
            form.sex === null ? '-' : form.sex === 1 ? '男' : '女'
          }}</span>
        </div>
        <t-radio-group
          v-else
          v-model="form.sex"
          :options="genderOptions"
          size="small"
        >
        </t-radio-group>
      </t-form-item>
      <t-form-item
        field="phone"
        label="手机号"
        :validate-trigger="['change', 'input']"
      >
        <div v-if="!isEdit" class="text-line-cls">
          <span>{{ phoneDisplay() }}</span>
        </div>
        <t-input
          v-else
          v-model="form.phone"
          placeholder="请输入11位手机号"
          :max-length="11"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="email" label="邮箱" validate-trigger="input">
        <div v-if="!isEdit" class="text-line-cls">
          <span>{{ form.email || '-' }}</span>
        </div>
        <t-input
          v-else
          v-model="form.email"
          placeholder="请输入"
          allow-clear
          show-word-limit
        />
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, onMounted, ref } from 'vue';
import { apiAccountDetail, apiAccountUpdate } from '@/api/user';
import { Message } from '@tele-design/web-vue';

const emit = defineEmits(['close']);
const formRef = ref();
const visible = ref(true);
const isEdit = ref(false);

enum Gender {
  Male = 1,
  Female = 0,
}

const form = reactive<Record<string, any>>({
  id: '',
  username: '',
  deptId: '',
  deptName: '',
  nickName: '',
  enabled: 0,
  sex: Gender.Male,
  phone: '',
  email: '',
  password: '',
});

const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
];

const accountDetail = () => {
  apiAccountDetail()
    .then((res) => {
      Object.assign(form, res);
    })
    .catch(() => {});
};

onMounted(() => {
  accountDetail();
});

function handleOk(done: (closed: boolean) => void) {
  formRef.value.validate().then(async (v: boolean) => {
    if (!v) {
      const { nickName, sex, phone, email } = form;
      apiAccountUpdate({ nickName, sex, phone, email })
        .then(() => {
          Message.success('编辑成功');
          emit('close');
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

const onClose = () => {
  isEdit.value = false;
  emit('close');
};

function phoneDisplay() {
  return form.phone
    ? form.phone.replace(form.phone.substring(3, 7), '****')
    : '-';
}
</script>

<style scoped lang="less">
.text-line-cls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;

  .tele-btn {
    margin-top: -2px; // 按钮距上边距是18px,dialog的padding是20px，所以需要向上移2px
  }
}

.tele-form {
  .tele-row {
    &:last-child {
      margin-bottom: 4px; // form表单最后一个距下边距是24px，默认是20px,dialog的padding是20px
    }
  }
}
</style>
