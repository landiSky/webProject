<template>
  <div>
    <t-modal
      v-model:visible="visible"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> {{ isEdit ? '编辑' : '新增' }}企业成员 </template>
      <t-form ref="formRef" :model="state.formModel" :rules="formRules">
        <t-form-item field="username" label="成员姓名" validate-trigger="blur">
          <t-input
            v-model="state.formModel.username"
            placeholder="请输入"
            :max-length="{
              length: 10,
              errorOnly: true,
            }"
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

        <t-form-item field="roleList" label="成员角色" validate-trigger="blur">
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
        <t-form-item field="phone" label="手机号" validate-trigger="blur">
          <t-input
            v-model="state.formModel.phone"
            placeholder="请输入"
            show-word-limit
          />
        </t-form-item>
      </t-form>
    </t-modal>
  </div>
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
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const {
  userInfo,
  selectCompany,
  userInfoByCompany,
}: Record<string, any> = storeToRefs(userStore);
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
    {
      required: true,
      message: '请输入成员姓名',
      validator: (value: any, cb: any) => {
        // @ts-ignore
        if (!state.formModel.username?.split(' ').join('')) {
          return cb('请输入成员名称');
        }
        return cb();
      },
    },
    { maxLength: 10, message: '长度不超过10个字符' },
  ],
  roleList: [{ required: true, message: '请选择成员角色' }],
  phone: [
    { required: true, message: '请输入手机号' },
    { match: /^1[3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号' },
    {
      validator: (value: any, cb: any) => {
        return new Promise((resolve: any) => {
          if (rolePhones.value === state.formModel.phone) {
            resolve();
          } else if (value.length === 11) {
            memberPhone({
              type: '0',
              companyId: userInfoByCompany.value.companyId,
              phone: state.formModel.phone,
            }).then((res) => {
              if (res.data.code === 200) {
                // console.log('====1999');
              } else {
                cb(res.data.message);
              }
              resolve();
            });
          }
        });
      },
    },
  ],
};

const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      menberAdd({
        id: state.formModel.id,
        memberId: state.formModel.memberId,
        companyId: userInfoByCompany.value.companyId,
        username: state.formModel.username,
        roleList: state.formModel.roleList,
        phone: state.formModel.phone,
      })
        .then((res) => {
          done(true);
          emit('confirm');
          // Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
        })
        .catch((err) => {
          done(false);
        });
    } else {
      done(false);
    }
  });
};

onMounted(() => {
  rolelist({
    pageSize: 1000,
    pageNum: 1,
    companyId: userInfoByCompany.value.companyId,
    type: 1,
  })
    .then((res: any) => {
      roleSelect.value = res.records;
      if (isEdit.value) {
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
      }
    })
    .catch((err) => {});
});
</script>

<style scoped lang="less">
:deep(.tele-col-5) {
  flex: none;
  width: 76px;
}

:deep(.tele-col-19) {
  flex: 1;
}

// }
</style>
