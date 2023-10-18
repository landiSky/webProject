<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> {{ isEdit ? '编辑' : '新增' }}企业成员 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="roleName" label="成员姓名">
        <t-input
          v-model="state.formModel.roleName"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        />
      </t-form-item>

      <t-form-item field="roleDesc" label="成员角色">
        <t-select
          v-model="state.formModel.roleDesc"
          placeholder="请选择"
          multiple
        >
          <t-option v-for="(item, index) in roleSelect" :key="index">{{
            item.name
          }}</t-option>
        </t-select>
      </t-form-item>
      <t-form-item field="phone" label="手机号">
        <t-input
          v-model="state.formModel.phone"
          placeholder="请输入"
          allow-clear
          show-word-limit
        />
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
import { Message } from '@tele-design/web-vue';

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
    roleName: undefined,
    roleDesc: undefined,
    phone: undefined,
  },
});

const formRules = {
  roleName: [
    { required: true, message: '请输入成员姓名' },
    { maxLength: 10, message: '长度不超过10个字符' },
  ],
  roleDesc: [{ required: true, message: '请选择成员角色' }],
  phone: [
    { required: true, message: '请输入手机号' },
    { match: /^1[3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号' },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);

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
    state.formModel = { roleName, roleDesc, phone };

    // 二是从接口获取
    // getDetail();
  }
});
</script>

<style scoped lang="less"></style>
