<template>
  <div class="boxModal">
    <t-modal
      v-model:visible="visible"
      :width="642"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> 变更管理员 </template>
      <t-form ref="formRef" :model="state.formModel" :rules="formRules">
        <t-form-item field="roleName" label="管理员账号">
          <span>{{ state.formModel.roleName }}</span>
          <!-- <t-input
            v-model="state.formModel.roleName"
            disabled
            placeholder="请输入管理员账号"
            style="font-size: 50px; background-color: transparent; border: none"
          /> -->
        </t-form-item>
        <t-form-item field="phone" label="管理员手机号">
          <span>{{ state.formModel.phone }}</span>
          <!-- <t-input
            v-model="state.formModel.phone"
            disabled
            placeholder="请输入"
            style="background-color: transparent; border: none"
          /> -->
        </t-form-item>
        <t-form-item field="verification" label="手机验证码">
          <!-- v-model="state.formModel.verification" -->
          <t-input
            v-model="state.formModel.verification"
            placeholder="请输入"
            :max-length="6"
            style="height: 35px"
          >
            <template #append>
              <div style="width: 100%">
                <p
                  v-if="flagText === true"
                  style="color: #1664ff"
                  @click="verificationds"
                >
                  获取验证码
                  <!-- {{ flagNum === true ? '重新发送' : '获取验证码' }} -->
                </p>

                <div v-if="flagText === false" style="color: #1664ff">
                  <p
                    style="
                      float: left;
                      width: 20px;
                      height: 15px;
                      line-height: 18px;
                    "
                  >
                    <!-- counts -->
                    {{ counts }}
                  </p>
                  <p style="float: left">秒后重新发送</p>
                </div>
              </div>
            </template>
          </t-input>
        </t-form-item>
        <!-- :max-length="{ length: 50, errorOnly: true, }" -->
        <t-form-item field="roleDesc" label="新管理员账号">
          <!-- <t-input
          v-model="state.formModel.roleDesc"
          placeholder="请输入新管理员账号"
          allow-clear
          show-word-limit
        /> -->
          <!-- v-model="state.formModel.roleDesc" -->
          <t-select
            v-model="state.formModel.roleDesc"
            placeholder="请输入新管理员账号"
            allow-search
          >
            <template #empty>
              <span style="display: block; padding: 10px 20px"
                >暂未找到该成员</span
              >
            </template>
            <t-option
              v-for="(item, index) in inputSelect"
              :key="index"
              :value="item.memberId"
              >{{ item.username }} {{ item.phone }}</t-option
            >
          </t-select>
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
import { useUserStore } from '@/store/modules/user';

import { storeToRefs } from 'pinia';

import { useRouter } from 'vue-router';

import {
  menberGetadmin,
  menberNormal,
  verificationCode,
  menberChangeAdmin,
} from '@/api/system/member';

const userStore = useUserStore();

const { userInfoByCompany }: Record<string, any> = storeToRefs(userStore);
// import { Message } from '@tele-design/web-vue';

const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['confirm', 'cancel']);
const formRef = ref();
const visible = ref(true);
// const flagNum = ref(false);
const flagText = ref(true);
const counts = ref(60);
const times = ref();

// const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleName: undefined,
    phone: '',
    verification: undefined,
    roleDesc: undefined,
    memberId: undefined,
  },
});
const inputSelect = ref();

const formRules = {
  roleName: [
    { required: true, message: '请输入成员姓名' },
    { maxLength: 10, message: '长度不超过10个字符' },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    // { match: /^1[3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号' },
  ],
  verification: [
    { required: true, message: '请输入验证码' },
    { match: /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/, message: '验证码有误' },
  ],
  roleDesc: [{ required: true, message: '请输入新管理员账号' }],
};
const handleLogout = async () => {
  try {
    await userStore.logout();
  } catch (e) {
    console.log('index.vue:67====handleLogout', e);
  }

  router.push({ path: '/wow' });
};
const onConfirm = (done: (closed: boolean) => void) => {
  formRef.value.validate((errors: any) => {
    if (!errors) {
      console.log(state.formModel);
      menberChangeAdmin({
        newAdminMemberId: state.formModel.roleDesc,
        code: state.formModel.verification,
        companyId: userInfoByCompany.value?.companyId,
        memberId: state.formModel.memberId,
        phone: state.formModel.phone,
      })
        .then((res) => {
          handleLogout();
          emit('confirm');
          // Message.success(`${isEdit.value ? '编辑' : '新增'}用户成功`);
          // clearInterval(times.value);
        })
        .catch(() => {
          done(false);
        });
    } else {
      done(false);
    }
  });
};
// 获取验证码
const verificationds = () => {
  verificationCode({ phone: state.formModel.phone, type: '3' }).then(() => {
    flagText.value = false;
    times.value = setInterval(() => {
      if (counts.value < 1) {
        clearInterval(times.value);

        flagText.value = true;
        counts.value = 60;
      }

      counts.value -= 1;
    }, 1000);
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
// 查找管理员信息;
const administratorled = () => {
  // const a={
  //   userName: "pf",
  //   phone: "18839014162",
  //   memberId: 1717067979902607400
  // },
  menberGetadmin({ companyId: userInfoByCompany.value?.companyId }).then(
    (res) => {
      console.log(res, 'res');

      state.formModel.roleName = res.username;
      state.formModel.phone = res.phone;
    }
  );
};
// 变更管理员- 查找企业下普通用户成员
const userNamelist = () => {
  menberNormal({ companyId: userInfoByCompany.value?.companyId }).then(
    (res) => {
      console.log(res);

      inputSelect.value = res;
      //   [
      //   {
      //     userName: 'kw', // 用户名
      //     phone: '18839014161', // 手机号
      //     memberId: 1, // 成员id
      //   },
      //   {
      //     userName: 'zh', // 用户名
      //     phone: '18839014163', // 手机号
      //     memberId: 1717072245149118500, // 成员id
      //   },
      // ];
    }
  );
};
onMounted(() => {
  administratorled();
  userNamelist();
  console.log(props.data);
  //  id,
  //   userId,
  //   userName,
  //   phone,
  //   companyId,
  //   memberId,
  //   status,
  //   roleList,
  //   roleName,
  const { memberId } = props.data;
  state.formModel.memberId = memberId;
});
</script>

<style scoped lang="less"></style>
