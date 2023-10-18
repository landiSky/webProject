<template>
  <div class="boxModal">
    <t-modal
      v-model:visible="visible"
      :width="642"
      :on-before-ok="onConfirm"
      @cancel="emit('cancel')"
    >
      <template #title> {{ isEdit ? '变更' : '变更' }}管理员 </template>
      <t-form ref="formRef" :model="state.formModel" :rules="formRules">
        <t-form-item field="roleName" label="管理员账号">
          <!-- <span>章三</span> -->
          <t-input
            v-model="state.formModel.roleName"
            disabled
            placeholder="请输入管理员账号"
            style="font-size: 50px; background-color: transparent; border: none"
          />
        </t-form-item>
        <t-form-item field="phone" label="管理员手机号">
          <!-- <span>13230087819</span> -->
          <t-input
            v-model="state.formModel.phone"
            disabled
            placeholder="请输入"
            style="background-color: transparent; border: none"
          />
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
            <t-option v-for="(item, index) in inputSelect" :key="index">{{
              item
            }}</t-option>
            <!-- <t-option>Shanghai</t-option>
          <t-option>Guangzhou</t-option>
          <t-option>Disabled</t-option>
          <t-option>Shenzhen</t-option>
          <t-option>Chengdu</t-option>
          <t-option>Wuhan</t-option> -->
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
// import { roleUpdate, roleAdd } from '@/api/role-manage';
// import { Message } from '@tele-design/web-vue';

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

const isEdit = computed(() => Boolean(props.data?.id ?? false)); // 这里的id替换为编辑数据的唯一属性
const state = reactive({
  formModel: {
    roleName: '张三',
    phone: '13230087819',
    verification: undefined,
    roleDesc: undefined,
  },
});
const inputSelect = reactive([
  'Beijing',
  'Shanghai',
  'Guangzhou',
  'Disabled',
  'Shenzhen',
  'Chengdu',
  'Wuhan',
]);

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
      // flagText.value = true;
      // counts.value = 60;
      // clearInterval(times.value);
      emit('confirm');
    } else {
      done(false);
    }
  });
};
// 获取验证码
const verificationds = () => {
  flagText.value = false;
  times.value = setInterval(() => {
    if (counts.value < 1) {
      clearInterval(times.value);
      // flagNum.value = false;
      flagText.value = true;
      counts.value = 60;
      // this.counts === 100
    }

    counts.value -= 1;
  }, 1000);
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
  // if (isEdit.value) {
  //   // 这里分两种情况
  //   // 一是编辑信息从列表传入
  //   console.log(props.data);
  //   const { roleName } = props.data;
  //   state.formModel = { roleName };
  //   // 二是从接口获取
  //   // getDetail();
  // }
});
</script>

<style scoped lang="less">
// .boxModal {
//   ::v-deep .tele-empty {
//     padding: 10px 20px;
//     text-align: right;
//   }
//   ::v-deep .tele-empty-image {
//     display: none;
//   }
// }
</style>
