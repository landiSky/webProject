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
      <t-form-item field="username" label="成员姓名">
        <t-input
          v-model="state.formModel.username"
          placeholder="请输入"
          :max-length="{
            length: 50,
            errorOnly: true,
          }"
          allow-clear
          show-word-limit
        />
        <!-- <t-select
          v-model="state.formModel.userName"
          placeholder="请输入新管理员账号"
          allow-search
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
        </t-select> -->
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
import { menberAdd, memberPhone } from '@/api/system/member';
import { rolelist } from '@/api/system/role';

// import { Message } from '@tele-design/web-vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);

const roleSelect = ref([
  {
    id: 0, // 角色id
    roleName: '', // 角色名称
    remark: '', // 描述
    menuList: null,
    memberCount: 0, // 成员数量
  },
]);
const rolePhones = ref('');
const formRef = ref();
const visible = ref(true);
const isEdit = computed(() => Boolean(props.data?.memberId ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    // roleName: undefined,
    // roleDesc: undefined,
    // phone: undefined,
    id: undefined,
    userId: undefined, // 用户id
    username: undefined, // 用户名称
    phone: undefined, // 手机号
    companyId: undefined,
    memberId: undefined, // 成员id
    status: undefined, // 0:在职 1:离职
    roleList: undefined,
    roleName: undefined, // 角色名称
  },
});

const formRules = {
  username: [
    { required: true, message: '请输入成员姓名' },
    // { maxLength: 10, message: '长度不超过10个字符' },
  ],
  roleList: [{ required: true, message: '请选择成员角色' }],
  phone: [
    { required: true, message: '请输入手机号' },
    { match: /^1[3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号' },
    {
      validator: (value: any, cb: any) => {
        return new Promise((resolve: any) => {
          // if (value.length === 11) {
          //   console.log('name must be admin');
          //   cb('name must be admin');
          // }
          // resolve();
          console.log(rolePhones.value, state.formModel.phone);

          if (rolePhones.value === state.formModel.phone) {
            resolve();
            console.log(rolePhones.value, state.formModel.phone);
          } else if (value.length === 11) {
            memberPhone({
              type: '0',
              companyId: '1',
              phone: state.formModel.phone,
            }).then((res) => {
              if (res.data.code === 200) {
                console.log('====1999');
              } else {
                console.log('该手机号尚未在平台注册');
                cb(res.data.message);
              }
              resolve();
            });
          }

          // window.setTimeout(() => {

          // }, 2000);
        });
      },
    },
  ],
};
const init = () => {
  rolelist({
    pageSize: 1000,
    pageNum: 1,
    companyId: 1,
  })
    .then((res: any) => {
      console.log(res);
      roleSelect.value = res.records;
    })
    .catch((err) => {});
};

const onConfirm = (done: (closed: boolean) => void) => {
  console.log('====228', formRef.value);
  formRef.value.validate((errors: any) => {
    console.log('111', errors);
    if (!errors) {
      console.log(errors);
      console.log(state.formModel);
      menberAdd({
        id: state.formModel.id,
        memberId: state.formModel.memberId,
        companyId: 1,
        username: state.formModel.username,
        roleList: state.formModel.roleList,
        phone: state.formModel.phone,
      })
        .then((res) => {
          done(true);
          emit('confirm');
        })
        .catch((err) => {});
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
      console.log(state.formModel);
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
const applist = (a: any) => {
  console.log(a, 'a, b, c');
};
onMounted(() => {
  rolelist({
    pageSize: 1000,
    pageNum: 1,
    companyId: 1,
  })
    .then((res: any) => {
      console.log(res);
      roleSelect.value = res.records;
      if (isEdit.value) {
        console.log(props.data, '编辑');
        const {
          id,
          userId,
          username,
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
          username,
          phone,
          companyId,
          memberId,
          status,
          roleList,
          roleName,
        };
        rolePhones.value = phone;
      } else {
        // 新增
        console.log(props.data, '新增');
      }
    })
    .catch((err) => {});
  // init();
});
</script>

<style scoped lang="less"></style>
