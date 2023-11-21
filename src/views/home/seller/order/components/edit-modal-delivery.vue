<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> 填写交付信息 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="accessAddress" label="访问地址">
        <!-- :max-length="{
            length: 50,
            errorOnly: true,
          }" -->
        <t-input
          v-model="state.formModel.accessAddress"
          placeholder="请输入"
          show-word-limit
        />
      </t-form-item>

      <t-form-item field="account" label="账号">
        <!-- :max-length="{
            length: 50,
            errorOnly: true,
          }" -->
        <t-input
          v-model="state.formModel.account"
          placeholder="请输入"
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="password" label="密码">
        <t-input-password
          v-model="state.formModel.password"
          placeholder="请输入"
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="remarks" label="备注">
        <t-textarea
          v-model="state.formModel.remarks"
          max-length="200"
          placeholder="请输入"
        />
        <!-- <t-input allow-clear show-word-limit /> -->
      </t-form-item>
    </t-form>
  </t-modal>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  reactive,
  ref,
  onMounted,
  computed,
} from 'vue';
import { merchantSub } from '@/api/seller/order';
// import { roleUpdate, roleAdd } from '@/api/role-manage';

import { Modal, Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);

const formRef = ref();
const visible = ref(true);
// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    id: '',
    accessAddress: undefined,
    account: undefined,
    password: undefined,
    remarks: undefined,
  },
});

const formRules = {
  accessAddress: [
    { required: true, message: '请输入访问地址' },
    {
      match: /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/,
      message: '请输入正确地址',
    },
  ],
  account: [{ required: true, message: '请输入账号' }],
  password: [
    { required: true, message: '请输入密码' },
    {
      match: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      message: '密码要有大小写不低于6位不大于16位',
    },
  ],
  remarks: [{ required: true, message: '请输入备注' }],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);
      merchantSub({
        id: state.formModel.id,
        accessAddress: state.formModel.accessAddress,
        account: state.formModel.account,
        password: state.formModel.password,
        remarks: state.formModel.remarks,
      })
        .then((res) => {
          Message.success('交付成功');
          emit('confirm');
          console.log(res);
        })
        .catch(() => {
          done(false);
        });
      // state.formModel.address = '111';

      //   const api = isEdit.value ? roleUpdata : roleAdd; // 这里是新增、编辑不是一个接口
      //   api(state.formModel)
      //     .then(() => {
      //       emit('confirm');
      //       Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
      //       done(true);
      //     })
      //     .catch(() => {
      //       done(false);
      //     });
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  const { id } = props.data;

  state.formModel.id = id;
  console.log(state.formModel, 'state.formModel');
});
</script>

<style scoped lang="less"></style>
