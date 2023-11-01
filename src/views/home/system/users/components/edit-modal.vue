<template>
  <t-modal
    v-model:visible="visible"
    :width="642"
    :height="400"
    :on-before-ok="onConfirm"
    @cancel="emit('cancel')"
  >
    <template #title> {{ isEdit ? '编辑' : '新增' }}企业成员 </template>
    <t-form ref="formRef" :model="state.formModel" :rules="formRules">
      <t-form-item field="userName" label="成员姓名">
        <!-- <t-input
          v-model="state.formModel.userName"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        /> -->
        <t-select
          v-model="state.formModel.userName"
          placeholder="请输入新管理员账号"
          allow-search
          :disabled="isEdit"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
        >
          <template #empty>
            <span style="display: block; padding: 10px 20px"
              >暂未找到该成员</span
            >
          </template>
          <t-option
            v-for="(item, index) in inputSelect"
            :key="index"
            :value="item.id"
            >{{ item.username }}</t-option
          >
        </t-select>
      </t-form-item>

      <t-form-item field="roleList" label="成员角色">
        <t-select
          v-model="state.formModel.roleList"
          placeholder="请选择"
          multiple
        >
          <t-option
            v-for="item in roleSelect"
            :key="item.id"
            :value="item.id"
            >{{ item.roleName }}</t-option
          >
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
// import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const inputSelect = reactive([
  {
    id: 1, // 用户id
    userId: null,
    username: 'kw', // 用户名称
    nickname: null,
    password: null,
    email: null,
    isReal: 1,
    mobile: '18839014161', // 手机号
    companyId: null,
    companyName: null,
    companyShort: null,
    companyStatus: null,
    companyNodeStatus: null,
    userType: null,
    userStatus: 1,
    createTime: '2023-10-25 14:23:38',
    updateTime: '2023-10-25 14:23:38',
    createUser: null,
    updateUser: null,
    isDeleted: 0,
  },
  {
    id: 2, // 用户id
    userId: null,
    username: 'pf', // 用户名称
    nickname: null,
    password: null,
    email: null,
    isReal: 1,
    mobile: '18839014162', // 手机号
    companyId: null,
    companyName: null,
    companyShort: null,
    companyStatus: null,
    companyNodeStatus: null,
    userType: null,
    userStatus: 1,
    createTime: '2023-10-24 19:43:39',
    updateTime: '2023-10-24 19:43:39',
    createUser: null,
    updateUser: null,
    isDeleted: 0,
  },
]);
const roleSelect = ref([
  {
    id: 1391112170700800, // 角色id
    roleName: '普通用户', // 角色名称
    remark: '描述', // 描述
    menuList: null,
    memberCount: 0, // 成员数量
  },
  {
    id: 1391112170700801, // 角色id
    roleName: '超级管理员', // 角色名称
    remark: '描述', // 描述
    menuList: null,
    memberCount: 0, // 成员数量
  },
]);
const formRef = ref();
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    // roleName: undefined,
    // roleDesc: undefined,
    // phone: undefined,
    id: undefined,
    userId: undefined, // 用户id
    userName: undefined, // 用户名称
    phone: undefined, // 手机号
    companyId: undefined,
    memberId: undefined, // 成员id
    status: undefined, // 0:在职 1:离职
    roleList: undefined,
    roleName: undefined, // 角色名称
  },
});

const formRules = {
  userName: [
    { required: true, message: '请输入成员姓名' },
    // { maxLength: 10, message: '长度不超过10个字符' },
  ],
  roleList: [{ required: true, message: '请选择成员角色' }],
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
// 获取已注册用户
const getName = () => {};
// 查询角色
const roleName = () => {};
// 查找手机号是否注册
const resPhone = () => {};
onMounted(() => {
  if (isEdit.value) {
    console.log(props.data, '编辑');
    const {
      id,
      userId,
      userName,
      phone,
      companyId,
      memberId,
      status,
      roleList,
      roleName,
    } = props.data;
    state.formModel = {
      id,
      userId,
      userName,
      phone,
      companyId,
      memberId,
      status,
      roleList,
      roleName,
    };
  } else {
    // 编辑
    console.log(props.data, '新增');
  }
});
</script>

<style scoped lang="less"></style>
