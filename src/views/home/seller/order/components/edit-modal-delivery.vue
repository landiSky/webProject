<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> 填写交付信息 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="address" label="访问地址">
        <!-- :max-length="{
            length: 50,
            errorOnly: true,
          }" -->
        <t-input
          v-model="state.formModel.address"
          placeholder="请输入"
          allow-clear
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
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="cipher" label="密码">
        <t-input-password
          v-model="state.formModel.cipher"
          placeholder="请输入"
          allow-clear
          show-word-limit
        />
      </t-form-item>
      <t-form-item field="remark" label="备注">
        <t-textarea
          v-model="state.formModel.remark"
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
// import { roleUpdate, roleAdd } from '@/api/role-manage';

import { Modal, Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const roleSelect = [
  {
    name: '超级管理员',
    key: 1,
  },
  {
    name: '角色A',
    key: 2,
  },
  {
    name: '角色B',
    key: 3,
  },
  {
    name: '角色C',
    key: 4,
  },
  {
    name: '角色D',
    key: 5,
  },
];
const formRef = ref();
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    address: undefined,
    account: undefined,
    cipher: undefined,
    remark: undefined,
  },
});

const formRules = {
  address: [
    { required: true, message: '请输入' },
    // { maxLength: 10, message: '长度不超过10个字符' },
  ],
  account: [{ required: true, message: '请输入' }],
  cipher: [
    { required: true, message: '请输入' },
    {
      match: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      message: '请输入正确的密码',
    },
  ],
  remark: [{ required: true, message: '请输入' }],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);
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
      emit('confirm');
      Modal.warning({
        title: '我已完成账号重置，确定交付该应用',
        content: '交付订单流转到买家确定状态。',
        titleAlign: 'start',
        okText: ' 确定',
        hideCancel: false,
        // okButtonProps: {
        //   status: 'danger',
        // },
        onOk: () => {
          // deleteUsers(params);

          Message.success('交付成功');
        },
        onCancel: () => {
          Message.success('取消交付成功');
        },
      });
    } else {
      done(false);
    }
  });
};

// const getDetail = () => {
//   usersDetail({ id: props.data?.id })
//     .then((res: Record<string, any>) => {
//       const { roleName, roleDesc } = res || {};
//       state.formModel = { roleName, roleDesc };
//     })
//     .catch(() => {});
// };

onMounted(() => {
  if (isEdit.value) {
    // 这里分两种情况
    // 一是编辑信息从列表传入
    const { roleName, roleDesc, phone } = props.data;
    // state.formModel = { roleName, roleDesc, phone };

    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less"></style>
